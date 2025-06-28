
<script> 
export default{
  name:'Loader',
  props:{
    title:String
  },
  mounted(){
    // console.log("loader stared")
  },
  updated(){
    // console.log("loader changed")
  }
}

</script>

<template>
<div class="m-auto w-full text-center  space-y-4 z-[200] ">
    <p class="text-xl fonty-semibold text-white">{{title}} ...</p>
<div class="loader bg-red-900 "></div> 
</div>

</template>


<style scoped>  
.loader {
  display: block;
  --height-of-loader: 4px;
  --loader-color: #0071e2;
  width:80%;
  max-width: 400px;
  height: var(--height-of-loader);
  border-radius: 30px;
  background-color: rgba(0,0,0,0.2);
  position: relative;
  margin: auto;
}


.loader::before {
  content: "";
  position: absolute;
  background: var(--loader-color);
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
  
}

@keyframes moving {
  50% {
    width: 100%;
  }

  100% {
    width: 0;
    right: 0;
    left: unset;
  }
}

</style>