

<script >
import {  post_func } from '@/apiHelper/apiRequests';
import { send_otp_validator_func,otp_data_validator_func } from '@/utilities/validator_func';

export default{
name:'ShareSection',
data(){
        return{
fileSharingDetails:{
    userEmail:'',
    receiverEmail:'',
    title: '',
    message:'',
    sharedFile:''
},
otp:'',
isOtpInputVisible:false, 
otpToken:''
        }
    },
    methods:{
        async sendOtp  (){
  // ------validations
  let validationStatus =  send_otp_validator_func(this.fileSharingDetails)
    console.log(">>>>>",validationStatus)
    if(!validationStatus.success) return this.$toast.error(validationStatus.message) 


    this.$emit('emit-toggle-loader-state',{state:true,title:"Sending Otp"})

        const result =await post_func('/request_otp','application/json',{
            userEmail:this.fileSharingDetails.userEmail,
            receiverEmail: this.fileSharingDetails.receiverEmail,
            title: this.fileSharingDetails.title
        })
        this.$emit('emit-toggle-loader-state',{state:false,title:''})

        if(result.success){
            this.isOtpInputVisible=true
            this.otpToken=result.response.token
           
        }
    },
    async verifyOtp  (){

        let validationStatus =  otp_data_validator_func({otp:this.otp,token:this.otpToken,...this.fileSharingDetails})
    console.log(">>>>>",validationStatus)
    if(!validationStatus.success) return this.$toast.error(validationStatus.message) 

        const formData = new FormData();
        formData.append('userEmail', this.fileSharingDetails.userEmail);
formData.append('receiverEmail',this.fileSharingDetails.receiverEmail )
formData.append('sharedFile',this.fileSharingDetails.sharedFile[0] ); 
formData.append('title', this.fileSharingDetails.title);
formData.append('message', this.fileSharingDetails.message);
formData.append('token',this.otpToken );
formData.append('otp',this.otp );

console.log(this.fileSharingDetails.sharedFile.length)

this.$emit('emit-toggle-loader-state',{state:true,title:"Verifying Otp"})

        const result =await post_func('/verify_otp','multipart/form-data',formData)
        this.$emit('emit-toggle-loader-state',{state:false,title:''})
console.log(result.response)
        if(result.response.success){
            this.$toast.success(result.response.message)
            this.isOtpInputVisible=false  
            this.fileSharingDetails={
                userEmail:'',
    receiverEmail:'',
    title: '',
    message:'',
    sharedFile:''
            }
            return 
        }
        else if(!result.response.success) return this.$toast.error(result.response.message)

        this.$toast.error("Server Error")
    },
    handleFileChange(e){
        if ( e.target.files[0].type.startsWith("video/")) {
        return this.$toast.error(" Video file not allowed!")
    }
        console.log(e.target.files)
        this.fileSharingDetails.sharedFile=e.target.files
console.log(e)
    },
    handleBackBtn(){
        this.isOtpInputVisible=false
        this.fileSharingDetails.sharedFile=''
        this.otp=''
        this.otpToken=''

    }
    },
}

</script>


<template>

<div class="w-full max-w-[420px] pt-3 pb-5  flex flex-col items-center justify-center gap-6  rounded-xl blur-background">
    <div class="w-full flex items-center  px-3"   :class="!isOtpInputVisible ? 'justify-center' : 'justify-between'"> 
        <i @click="handleBackBtn" v-show="isOtpInputVisible" class="fa-solid fa-arrow-left text-2xl cursor-pointer"></i>
        <p class="text-2xl text-center text-white  ">Share</p>
        <div v-show="isOtpInputVisible"  class=""> </div>
    </div>
<div v-if="!isOtpInputVisible"  class=" w-full   flex flex-col items-center justify-center gap-4  ">


    <input class="text-white  outline-0 focus:outline-none focus:ring-0" type="text" v-model="fileSharingDetails.receiverEmail" name="receiverEmail" placeholder="Send to " required />

<input class="text-white  outline-0 focus:outline-none focus:ring-0" type="text"  v-model="fileSharingDetails.userEmail"  name="senderEmail" placeholder="Your Email " required />

<input class="text-white  outline-0 focus:outline-none focus:ring-0" type="text"  v-model="fileSharingDetails.title"   name="title" placeholder="Title" required />

<input class="text-white  outline-0 focus:outline-none focus:ring-0" type="text"  v-model="fileSharingDetails.message"  name="message" placeholder="Enter your message (Optional)" required />


 <div style="margin: 8px 0;" class= " w-[90%] overflow-hidden " > 
<input @change="handleFileChange" type="file" placeholder="File Upload" />
</div> 


<!-- <div style="margin: 8px 0;" class="w-[90%] overflow-hidden">
  <input @change="handleFileChange" ref="fileInputRef" type="file" />
  <div v-if="fileSharingDetails.sharedFile?.length">
    <p class="text-sm mt-2 text-gray-600">Selected File: {{ fileSharingDetails.sharedFile[0].name }}</p>
  </div>
</div> -->

<button  @click="sendOtp"   type="button"  class=" mt-6 px-6 py-2 text-lg  mx-auto rounded-lg bg-[#1D4ED8]  text-white cursor-pointer" >Continue</button>
</div>

<div v-if="isOtpInputVisible"  class=" w-full max-w-[400px]  flex flex-col items-center justify-center gap-4  ">
    <input class="text-white  outline-0 focus:outline-none focus:ring-0" type="text" v-model="otp" name="otpt" placeholder="Enter your Otp" />

    <button @click="verifyOtp" type="button"  class=" mt-6 px-6 py-2 text-lg  mx-auto rounded-lg bg-[#1D4ED8]  text-white cursor-pointer" >Send</button>
</div>


</div>

</template>


<style>

input[type="text"]{
    width: 90%;
    padding:5px 10px ;
    border: none;
    border-bottom:1px solid gray ;
    outline: none;
    /* border-radius: 8px; */
margin: 0 auto;
}

</style>