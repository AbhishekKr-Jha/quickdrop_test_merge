

<script >
import { post_func } from '@/apiHelper/apiRequests';
import { send_uploaded_files_func } from '../utilities/validator_func';

export default{
    name:'FileShareModal',
props:{
    files:Array,
email:String,
},
data(){
    return{
fileSharingDetails:{
    userEmail: this.email,
    receiverEmail: '', 
    title: 'pahse 4 testing',
    message:'optinal msg ',
    // sharedFile:''
}
    }
},
methods:{
    
async share_file_upload_links(){
    const senderEmail=localStorage.getItem('authorize-email')
console.log("-----now current email vliodation is----", senderEmail)
    let validationStatus =  send_uploaded_files_func({
 
        userEmail: senderEmail,
  receiverEmail: this.fileSharingDetails.receiverEmail,
  title: this.fileSharingDetails.title,
  sharedFile:this.files
    })
    // console.log(">>>>>",validationStatus)
    if(!validationStatus.success) return this.$toast.error(validationStatus.message) 


    this.$emit('emit-toggle-loader-state',{state:true,title:"Sending File"})
    const data=await post_func('/share_file_links','application/JSON',{
        userEmail:senderEmail,
        receiverEmail:this.fileSharingDetails.receiverEmail,
        title:this.fileSharingDetails.title,
        message:this.fileSharingDetails.message,
        imageFiles:this.files.selectedImageFiles ,
        videoFiles:this.files.selectedVideoFiles ,
        applicationFiles:this.files.selectedDocumentFiles , 
        otherFiles:this.files.selectedOtherFiles
    })
    this.$emit('emit-toggle-loader-state',{state:false,title:""})

    console.log("the payoload is",this.files.selectedImageFiles.length)
    if(data.success) { 
        this.$emit('close-modal-event')
        this.$toast.success(data.response.message)
    return
    }
this.$toast.error("something went wrong during multi share")
},
},
mounted(){
    console.log("the email is ",localStorage.getItem('authorize-email'))
//     const storedEmail = localStorage.getItem('authorize-email');
//   if (storedEmail) {
//     this.fileSharingDetails.userEmail = storedEmail;
//   }
}
}

</script>
<!-- slate-900 -->
<template>
    <div @click.stop  class="w-full max-w-[420px] py-4 pt-8 flex flex-col items-center justify-center gap-6  rounded-xl bg-slate-900 text-white relative">
        <!-- <span class="absolute -top-2 -right-2 cursor-pointer text-4xl"><i class="fa-solid fa-xmark"></i></span>  -->
        <!-- <Loader v-show="isLoader.state" :title="isLoader.title" /> -->

        <p class="text-2xl text-center ">Share To -</p>

<div class="w-full   flex flex-col items-center justify-center gap-4">

        <input type="text" v-model="fileSharingDetails.receiverEmail" name="receiverEmail" placeholder="Send to " class="text-white  outline-0 focus:outline-none focus:ring-0" required />

<input type="text"  v-model="fileSharingDetails.title"   name="title" placeholder="Title" class="text-white  outline-0 focus:outline-none focus:ring-0" required />

<input type="text"  v-model="fileSharingDetails.message"  name="message" placeholder="Enter your message (Optional)" class="text-white  outline-0 focus:outline-none focus:ring-0" required />

<div class="w-full flex flex-wrap gap-4 justify-center items-center">
    <!-- <div  class="w-[130px] h-[100px] rounded-lg overflow-hidden   relative">
<img :src="files.selectedImageFiles[0]?.view_url" width="100%" height="100%" class="object-contain" >
<div class="w-full px-2 py-[2px] absolute bottom-0 right-0 bg-red-900 text-xs">
        <p class="truncate">{{ files.selectedImageFiles[0]?.key?.split('/')[3] }}</p>
    </div>
</div> -->

<!-- <div class="px-2 w-[120x] py-1 border-[1px] border-black truncate" v-for="item in files" :key="item.key">
    {{item.key.split('/')[3]}}
</div> -->
<!-- Sending {{ files[0].length }} files -->
</div>

<button @click="share_file_upload_links"  type="button"  class=" mt-6 px-6 py-2 text-lg  mx-auto rounded-lg bg-[#1D4ED8]  text-white cursor-pointer" >Continue</button>

</div>
    </div>
</template>