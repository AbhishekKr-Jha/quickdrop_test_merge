<script>
import { toRaw } from 'vue';
import { post_func } from '@/apiHelper/apiRequests';
import FileShareModal from '@/components/FileShareModal.vue';
import DisplayCard from '@/components/DisplayCard.vue';
import DropdownFilter from '@/components/DropdownFilter.vue';
import Loader from '@/components/Loader.vue';
import { validateOtp, validateUserEmail } from '@/utilities/validator_func';

 
export default{
    name:'ProfilePage',
    props:{
active_menu_id:Number
    },
    data(){
        return{
uploadTypes:[
    {id:0,title: 'All'},
    {id:1,title: 'Image'},
    {id:2,title: 'Files'},
    {id:3,title: 'Video'}
],
fileList:[],
imageList:[],
videoList:[],
documentList:[],
others:[],
activeFilterDataTab:0,
calculate:0,
isModalOpen:false,
isMultiSelectFileOn:false,
isValidUser:false,
userEmail:localStorage.getItem('authorize-email'),
otp:"",
isOtpInputVisible:false,
isLoader:{
    title:'',
    state:false
},
selectedFiles:{
    selectedImageFiles:[],
    selectedVideoFiles:[],
    selectedDocumentFiles:[],
    selectedOtherFiles:[]
}
// selectedFile:null


        } 
    },
    components:{
        DisplayCard,
        FileShareModal,
        DropdownFilter,
        Loader
    },
    methods:{

      async sendProfileAuthorizationOtp  (){

        let validationStatus =  validateUserEmail(this.userEmail,"")
    if(!validationStatus.success) return this.$toast.error(validationStatus.message) 



  this.isLoader={
  state:true,title:"Sending Otp"
}
        const result =await post_func('/request_otp','application/json',{userEmail:this.userEmail})
this.isLoader={
  state:false,title:" "
}
        if(result.success){
            this.isOtpInputVisible=true
            localStorage.setItem('token',result.response.token)
           this.$toast.success('Otp Sent')
           return
        }
        this.$toast.error("Invalid User!")   

    },

    async verifyProfileAuthorizationOtp(){


      let validationStatus =  validateOtp(this.otp)
    if(!validationStatus.success) return this.$toast.error(validationStatus.message)  

      this.isLoader={
  state:true,title:"Sending Otp"
}
        const result =await post_func('/verify_profile_otp','application/json',{
          otp:this.otp,token:localStorage.getItem('token') || null
        })
this.isLoader={
  state:false,title:" "
}
console.log("the otp respopnse is",result)
        if(result.success){
           this.$toast.success('Otp Verified')
           localStorage.setItem('authorize-email',this.userEmail)
           this.get_all_uploads()
           return
        }
        this.$toast.error("Invalid Otp")   

    },
       
        async get_all_uploads(){
          this.isLoader={
  state:true,title:"Loading data..."
}
          console.log("the calcilate value is",this.calculate)
          this.calculate=+1 
            const data=await post_func('/get_upload_list','application/JSON',{userEmail:this.userEmail || localStorage.getItem('authorize-email') ,token:localStorage.getItem('token') || null})
            this.isLoader={
  state:false,title:""
}
console.log("the response data is",data)
            if(data.success){

                this.fileList=data.response.url_list
                this.imageList=[]
                this.videoList=[]
                this.documentList=[]
                this.others=[]
             this.fileList.forEach(item=>{
const fileType=item.key.split('/')[2]    
if(fileType=="image"){ this.imageList.push({fileType,...item}) }
else if(fileType=="video"){this.videoList.push({fileType,...item})}
else if(fileType=="application"){this.documentList.push({fileType,...item})}
else{this.others.push({fileType:"others",...item})}
                })
                this.isValidUser=true
                this.$toast.success(data.response.message)
                return
            }
            this.otp=''
            this.isOtpInputVisible=false
            this.$toast.error(data.message || "Something went wrong!")  
        },
  
        handleMultiFileSelect(file) {
           console.log(file.fileData.fileType)
 if(file.selectedValue){
  console.log("the true is",toRaw(file.fileData))
    if (file.fileData.fileType === "image") {
    this.selectedFiles.selectedImageFiles.push(toRaw(file.fileData));
  } else if (file.fileData.fileType === "video") {
    this.selectedFiles.selectedVideoFiles.push(toRaw(file.fileData));
  } else if (file.fileData.fileType === "application") {
    this.selectedFiles.selectedDocumentFiles.push(toRaw(file.fileData));
  } else {
    this.selectedFiles.selectedOtherFiles.push(toRaw(file.fileData));
  }
 }
 else if(!file.selectedValue) {
  
  console.log("the false is",toRaw(file.fileData))
    if (file.fileData.fileType == "image") {
    this.selectedFiles.selectedImageFiles= this.selectedFiles.selectedImageFiles.filter(item=>item.key!==file.fileData.key);
  } else if (file.fileData.fileType == "video") {
    this.selectedFiles.selectedVideoFiles=this.selectedFiles.selectedVideoFiles.filter(item=>item.key!==file.fileData.key);
  } else if (file.fileData.fileType == "application") {
    this.selectedFiles.selectedDocumentFiles=this.selectedFiles.selectedDocumentFiles.filter(item=>item.key!==file.fileData.key);
  } else {
    this.selectedFiles.selectedOtherFiles=this.selectedFiles.selectedOtherFiles.filter(item=>item.key!==file.fileData.key);
  }


 }
 let emitValue=this.selectedFiles.selectedImageFiles.length>0 || this.selectedFiles.selectedVideoFiles.length>0 || this.selectedFiles.selectedDocumentFiles.length>0  || this.selectedFiles.selectedOtherFiles.length>0  
  this.$emit('emit-toggle-share-btn',emitValue)


console.log(this.selectedFiles.selectedDocumentFiles.length)
}
,
        handleSingleFileShare(file){
            console.log("te file is",toRaw(file))
      this.toggle_modal(true)
//   this.handleFileSelect(file)
if (file.fileType == "image") {
    this.selectedFiles.selectedImageFiles=[toRaw(file)];
  } else if (file.fileType == "video") {
    this.selectedFiles.selectedVideoFiles=[toRaw(file)];
  } else if (file.fileType == "application") {
    this.selectedFiles.selectedDocumentFiles=[toRaw(file)];
  } else {
    this.selectedFiles.selectedOtherFiles=[toRaw(file)];
  }
},
        
        toggle_modal(value){
          console.log("the value of toggle modal is ",value)
this.isModalOpen=value
document.body.style.overflowY=value?"hidden":"auto" 
        },
        handleMultiSelectFileMode(value){
          // console.log(this.selectedFiles)
          if(!value) this.$emit('emit-toggle-share-btn',value)
this.isMultiSelectFileOn=value
this.selectedFiles={
    selectedImageFiles:[],
    selectedVideoFiles:[],
    selectedDocumentFiles:[],
    selectedOtherFiles:[]
}
       },
       handleFileDeletionProcess(loaderObj){
        console.log("the emit is triggered ",loaderObj)
        // this.isLoader=loaderObj
      this.get_all_uploads()
      },
      getUserEmail() {
    return localStorage.getItem('authorize-email') || '';
  }
    },
    mounted(){
        this.get_all_uploads()
    }

}

</script>


<template>
    <Loader v-show=" active_menu_id==1 && isLoader.state" :title="isLoader.title" />
<div v-show="active_menu_id==1 && !isLoader.state"  class="w-full  md:px-5 pt-16 space-y-10 ">


  <div v-if="!isValidUser"  class=" w-full max-w-[400px] mx-auto h-[50vh] flex flex-col items-center justify-center gap-4  ">
<input v-show="!isOtpInputVisible" type="text" v-model="userEmail" name="userEmail" placeholder="User Email" class="text-white  outline-0 focus:outline-none focus:ring-0 " required />
<input v-show="isOtpInputVisible" type="text" v-model="otp" name="otp" placeholder="6 digit OTP" class="text-white   outline-0 focus:outline-none focus:ring-0 " required />

<button  v-show="!isOtpInputVisible" @click="sendProfileAuthorizationOtp"   type="button"  class=" mt-8 px-6 py-2 text-lg  mx-auto rounded-lg bg-[#1D4ED8]  text-white cursor-pointer" >Continue</button>
<button  v-show="isOtpInputVisible" @click="verifyProfileAuthorizationOtp"   type="button"  class=" mt-8 px-6 py-2 text-lg  mx-auto rounded-lg bg-[#1D4ED8]  text-white cursor-pointer" >Continue</button>
 

<p class="text-sm text-red-600 font-medium text-center w-[95%]">First Upload some Files with your Email else there won't be any data to show it to you!</p>


</div>

  
  <div v-show="isValidUser" class="w-full fixed z-[150] p-5 top-0 left-0 flex items-center justify-start gap-5 bg-[#0F172B]">
    <div :class="{ 'pointer-events-none': isMultiSelectFileOn }">
      <DropdownFilter :isMultiSelectActiveValue="isMultiSelectFileOn"  @dropdown-selected="id=>activeFilterDataTab=id" />
    </div>
        <button @click="handleMultiSelectFileMode(!isMultiSelectFileOn)"
        :class="[
    'inline-flex justify-center items-center w-[150px] rounded-md px-4 py-2 text-white text-sm font-medium cursor-pointer',
    isMultiSelectFileOn ? 'bg-green-600' : 'bg-blue-700'
  ]"      >MultiSelect - {{ !isMultiSelectFileOn?'On':'Off' }}
      </button>
    </div>
  


<!-- ----Images----- -->
<div v-show=" imageList.length>0 && activeFilterDataTab==0 || activeFilterDataTab==1 " class="w-full space-y-8">
<div v-show="activeFilterDataTab==0" class="w-full flex justify-center items-center gap-8"><hr class="w-[35%] h-[2px] bg-white"><p class="text-2xl text-white">Images</p><hr class="w-[35%] h-[2px] bg-white"></div>
<div class=" w-full flex justify-center items-start gap-5 flex-wrap ">
<DisplayCard v-for="item in imageList" :key="item" :data="item" @share-btn-clicked="handleSingleFileShare" :multiSelectActive="isMultiSelectFileOn" @file-selection-multi-mode="handleMultiFileSelect"  @emit-handle-delete="handleFileDeletionProcess"   /> 
</div>
</div>



<!-- ----------documents----- -->
 <div v-show=" documentList.length>0 && activeFilterDataTab==0 || activeFilterDataTab==2" class="w-full space-y-8">
<div v-show="activeFilterDataTab==0" class="w-full flex justify-center items-center gap-8"><hr class="w-[35%] h-[2px] bg-white" ><p class="text-2xl text-white">Documents</p><hr class="w-[35%] h-[2px] bg-white"></div>
<div class="w-full flex justify-center items-start gap-5 flex-wrap">
<DisplayCard v-for="item in documentList" :key="item" :data="item"  @share-btn-clicked="handleSingleFileShare" :multiSelectActive="isMultiSelectFileOn" @file-selection-multi-mode="handleMultiFileSelect"   />
</div>
</div>


<!-- ----------videos----- -->
<div v-show=" videoList.length> 0 && activeFilterDataTab==0 || activeFilterDataTab==3" class="w-full space-y-8">
<div v-show="activeFilterDataTab==0" class="w-full flex justify-center items-center gap-8"><hr class="w-[35%] h-[2px]"><p class="text-2xl">Videos</p><hr class="w-[35%] h-[2px]"></div>
<div class="w-full flex justify-center items-start gap-5 flex-wrap">
<!-- <UploadCard v-for="item in videoList" :key="item" :data="item" /> -->
</div>
</div>





</div>

<div  v-show="isValidUser && !isLoader.state && isModalOpen"  class=" w-full h-screen px-3 flex justify-center items-center fixed top-0 left-0 z-[360] blur-background">
  <span @click="toggle_modal(false)" class="absolute top-5 right-5 text-white cursor-pointer text-4xl sm:text-5xl"><i class="fa-solid fa-xmark"></i></span> 
  <FileShareModal :email="getUserEmail()"  :files="selectedFiles" @close-modal-event="() => { toggle_modal(false); isMultiSelectFileOn = false }"  @emit-toggle-loader-state="obj=>isLoader=obj" />
</div>



</template>