
<script>
import Loader from '@/components/Loader.vue';
import ShareSection from '@/components/ShareSection.vue';
import UploadSection from '@/components/UploadSection.vue';

export default{
    name:'HomePage',
    props:{
active_menu_id:Number
    },
    data(){
        return{
isLoader:{
    title:'',
    state:false
}
        }
    },
    components:{
        ShareSection,
        UploadSection,
        Loader
    },
    mounted(){
        // console.log("the id value is", typeof this.active_menu_id,
        // this.active_menu_id
        // )
    }
}
</script>


<template>
    <Loader v-show="isLoader.state" :title="isLoader.title" />
<div v-show="  (active_menu_id==0 || active_menu_id==2) && !isLoader.state  " style="" class="w-full  mt-10  flex relative items-center justify-center gap-8 ">
    <div class=" w-full  md:w-1/2 py-5  flex justify-center   relative z-20">
        <ShareSection v-show="active_menu_id===0" @emit-toggle-loader-state="obj=>isLoader=obj" />
        <UploadSection  v-show="active_menu_id===2"  @emit-toggle-loader-state="obj=>isLoader=obj" />
        <!-- 2 -->
    </div>


    <div class="w-full h-full hidden md:flex  md:w-1/2  justify-center items-center absolute md:relative z-10 ">
        <div class=" size-[95%] max-w-[400px]">
<img src="https://cdni.iconscout.com/illustration/premium/thumb/file-sharing-network-illustration-download-in-svg-png-gif-formats--digital-online-document-exchange-electronic-transfer-pack-files-folders-illustrations-10288813.png?f=webp" class="w-full h-full object-contain"  alt="loading..."/>      
  </div>
    </div>


</div>
</template>