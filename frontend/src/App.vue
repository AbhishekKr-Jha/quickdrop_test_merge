
<script>
import HomePage from './views/home/HomePage.vue';
import ProfilePage from './views/home/ProfilePage.vue';
// import { ModalsContainer } from 'vue-final-modal'
 

export default{
  name:'App',
  data(){
    return{
menuList:[
  {
    id:0,
    text: 'S',
    title: 'Share'
  },
  {
    id:1,
    text: 'P',
    title: 'Profile'
  },
  {
    id:2,
    text: 'U',
    title: 'Upload'
  } 
],
activeMenu:0,
isShareBtnActive:false
    }
  },
  components:{
    HomePage,
    ProfilePage,
    // ModalsContainer
  }
}

</script>


<template>
<div style="max-width: 1300px;margin-bottom: 100px;" class="w-full min-h-screen p-5  flex flex-col  mx-auto bg-slate-900">   
  <HomePage :active_menu_id="activeMenu" v-show="activeMenu!==1" /> 

  <ProfilePage v-show="activeMenu==1"  :active_menu_id="activeMenu" @emit-toggle-share-btn="val => isShareBtnActive = val"   ref="profilePageRef"
    /> 


  <div class=" fixed bottom-8  right-1/2  z-50 flex flex-col items-center      ">
    <img src="/web_logo.png" class="block mx-auto w-[170px] sm:w-[200px] h-auto object-contain " alt="loading..." >
    <div v-show="!isShareBtnActive" class="mt-2 flex items-center justify-center gap-5">
<!-- <div @click="activeMenu=item.id" class="rounded-full size-10 sm:size-12 bg-[#1D4ED8] flex items-center justify-center cursor-pointer font-semibold text-xl sm:text-2xl "   :class="{
    'bg-white text-[#1D4ED8]': activeMenu === item.id,
    'bg-[#1D4ED8] text-white': activeMenu !== item.id
  }" v-for="(item,index) in menuList" :key="index" :title="item.title">
  {{ item.text }}
</div> -->

<div @click="activeMenu=item.id" class="rounded-sm w-[90px] sm:w-[110px] h-10 bg-[#1D4ED8] flex items-center justify-center cursor-pointer font-medium text-base sm:text-xl "   :class="{
    'bg-white text-[#1D4ED8]': activeMenu === item.id,
    'bg-[#1D4ED8] text-white': activeMenu !== item.id
  }" v-for="(item,index) in menuList" :key="index" :title="item.title">
  {{ item.title }}
</div>

</div>

<button @click="$refs.profilePageRef?.toggle_modal(true)" v-show="isShareBtnActive" class=" mt-2  justify-center items-center w-[120px] rounded-md px-4 py-2 text-white bg-[#1D4ED8] text-sm font-medium cursor-pointer "  >
Send </button>

  </div>


</div>
</template>
