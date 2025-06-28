

<script>
import { post_func, put_func } from '@/apiHelper/apiRequests';
import { file_upload_validator_func } from '@/utilities/validator_func';

 
export default{
    name:'UploadSection',
    data(){
        return{
            accessCode:'commandcode00010',
            isAccessCodePassed:false,
            fileUploadingDetails:{
    userEmail:'abhishekhp935@gmail.com',
    fileName:'',
    fileType:'',
    contentType:'',
    sharedFile:'',
    fileExtension:''
},
        }
    },
    methods:{
        async verify_access_code(){
const result=await post_func('/access_upload_authorization','application/JSON',{access_code:this.accessCode})
console.log(result)
if(result.success) {
        this.isAccessCodePassed=true
    return this.$toast.success(result.response.message)
}
return this.$toast.error("Invalid Access Code!")
},

async request_uploading_url(){

    let validationStatus =  file_upload_validator_func({userEmail:this.fileUploadingDetails.userEmail,sharedFile:this.fileUploadingDetails.sharedFile})
    console.log(">>>>>",validationStatus)
    if(!validationStatus.success) return this.$toast.error(validationStatus.message) 

    if(!this.fileUploadingDetails.fileName) return this.$toast.error("File name is required!")

    this.$emit('emit-toggle-loader-state',{state:true,title:"Uploading File"})


    const result=await post_func('/upload_url','application/JSON',{
        userEmail:this.fileUploadingDetails.userEmail ,
        contentType :this.fileUploadingDetails.contentType ,
        fileType: this.fileUploadingDetails.fileType ,
        fileName:this.fileUploadingDetails.fileName+`.${this.fileUploadingDetails.fileExtension}`
    })

    if(result.success) {
        // this.$toast.success(result.response.message)
        this.upload_file(result.response.presigned_url)
        return
    } 

this.$toast.error(result.message)
this.$emit('emit-toggle-loader-state', {
  state: true,
  title: "Uploading File"
})
return
},
async upload_file(presignedUrl){
const formData=new FormData()
formData.append('file',this.fileUploadingDetails.sharedFile)
const result=await put_func(presignedUrl,this.fileUploadingDetails.contentType,this.fileUploadingDetails.sharedFile)
this.$emit('emit-toggle-loader-state', {
  state: false,
  title: ""
})
if(result.success) {
     this.$toast.success("File Uploaded successflly")
this.fileUploadingDetails.fileName='',
this.fileUploadingDetails.sharedFile=''
this.fileUploadingDetails.fileType=''
this.fileUploadingDetails.contentType=''
this.fileUploadingDetails.fileExtension=''
this.$refs.fileInput.value = null
return
}
return this.$toast.error("File Uploading Error!")
},
handleFileChange(e){
    if ( e.target.files[0].type.startsWith("video/")) {
        return this.$toast.error(" Video file not allowed!")
    }
        console.log(e.target.files)
        const file_info=e.target.files[0].type.split('/')
        this.fileUploadingDetails.sharedFile=e.target.files[0]
        this.fileUploadingDetails.fileType=file_info[0]
        this.fileUploadingDetails.fileExtension=file_info[1]
        this.fileUploadingDetails.contentType=e.target.files[0].type
console.log(e)
    }
}
        }
    


</script>


<template>

<div  class="w-full max-w-[420px] py-4  flex flex-col items-center justify-center gap-4  rounded-xl blur-background">

    <!-- authenticatioin code -->  
<div v-show="!isAccessCodePassed" class="w-full   flex flex-col items-center justify-center gap-4  ">
    <input class="text-white bg-[#0F172B]  outline-0 focus:outline-none focus:ring-0" type="text" v-model="accessCode" name="accessCode" placeholder=" Access Code" required />
    <button @click="verify_access_code" type="button"  class=" mt-6 px-6 py-2 text-lg  mx-auto rounded-lg bg-[#1D4ED8]  text-white cursor-pointer" >Continue</button>
<div class="space-y-1">
    <p class="text-red-600 font-medium text-center w-[90%] text-xs">The access code is there to stop unwanted uploads.</p>
<p class="text-red-600 font-medium text-center text-sm w-[95%]">Current code is : " commandcode00010 "</p>

</div>
</div>


<!-- -----email validation--- -->
<div v-show="isAccessCodePassed" class="w-full flex flex-col items-center justify-center gap-4 " >
    <p class="text-2xl text-center text-white ">Upload</p>
<input type="text" class="text-white   outline-0 focus:outline-none focus:ring-0"  v-model="fileUploadingDetails.userEmail"  name="senderEmail" placeholder="Your Email " required />

<input type="text" class="text-white   outline-0 focus:outline-none focus:ring-0"  v-model="fileUploadingDetails.fileName"   name="filename" placeholder="File Name" required />

<div style="margin: 8px 0;" class= " w-[90%] overflow-hidden" > 
<input  ref="fileInput" @change="handleFileChange" type="file" placeholder="File Upload" />
</div>

<button  @click="request_uploading_url"   type="button"  class=" mt-6 px-6 py-2 text-lg  mx-auto rounded-lg bg-[#1D4ED8]  text-white cursor-pointer" >Continue</button>

</div>

<!--- ---files upload--- -->

</div>

</template>