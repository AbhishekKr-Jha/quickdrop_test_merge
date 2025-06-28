
<script>
import { delete_func } from '@/apiHelper/apiRequests'

 

export default{
    name:'DisplayCard',
    props:{
        data:Object,
        multiSelectActive:Boolean
    },
    data(){
        return{
            isSelected:false
        }
    },
    methods:{
        handleFileSelect(value){
            this.isSelected=value
            this.$emit('file-selection-multi-mode',{fileData:this.data,selectedValue:value})
        },
      async  handleFileDelete(keyValue){

        this.$emit('emit-handle-delete',{
            state:true,title:"File Deletion in progress"
        })

const result=await delete_func('/delete_upload',{key:keyValue})
this.$emit('emit-handle-delete',{
            state:false,title:''
        })
if(result.success){
    this.$toast.success(result.response.message)
return
}
return this.$toast.error("File Deletion Error!")
        }
    },
    updated(){
      if(!this.multiSelectActive){
this.isSelected=false
      }
console.log("te value of multi select boolena is ",this.multiSelectActive)
    }
}
</script>



<template>
    <div  class="w-[150px]  sm:w-[200px] space-y-1 p-[6px] bg-green-500 rounded-lg">
    <div class="w-full flex items-center gap-2">
        <!-- <span class=" px-2 py-1 bg-blue-600 text-white font-medium rounded-sm text-xs ">pdf</span>  -->
        <p class="truncate text-sm font-semibold ">{{ data?.key?.split('/')[3] }}</p> 
    </div>
    <div  class="w-full h-[110px] sm:h-[150px] rounded-lg overflow-hidden bg-black  relative">
        <!-- ---for images-- -->
<img v-show="data.fileType=='image'" :src="data.view_url" class="w-full h-full object-contain"  alt="load..." />

<!-- --i frame-------- -->
<iframe v-show="data.fileType=='application'" :src="data.view_url" width="100%" height="100%" ></iframe>

<!-- -------selecting multi file mode --------- -->
<div  v-show="multiSelectActive" @click="handleFileSelect(!isSelected)" class="w-full h-full absolute top-0 right-0  flex justify-center items-center blur-display-card">

    <i v-show="isSelected" class="fa-solid fa-circle-check text-green-500 text-6xl"></i>

</div>

    <div v-show="!multiSelectActive" style="background: linear-gradient(to bottom,transparent, transparent, black);" class="w-full px-2  py-1 flex justify-around  items-start text-white absolute bottom-0 right-0 ">
<span title="View" class="text-xs sm:text-base cursor-pointer bg-[#0F172B]  w-[28px] sm:w-[35px] h-[28px] sm:h-[35px] rounded-full flex items-center justify-center"><a :href="data.view_url" target="_blank"><i class="fa-solid fa-eye"></i></a></span>
<span @click="$emit('share-btn-clicked',data)" title="Share" class="text-xs sm:text-base cursor-pointer bg-[#0F172B] w-[28px] sm:w-[35px] h-[28px] sm:h-[35px] rounded-full flex items-center justify-center"> <i class="fa-solid fa-share"></i></span>
<span  @click="$toast.error('Deleting not yet allowed by admin!')" title="Delete" class="text-xs sm:text-base cursor-pointer bg-[#0F172B]  w-[28px] sm:w-[35px] h-[28px] sm:h-[35px] rounded-full flex items-center justify-center"> <i class="fa-solid fa-trash-can"></i> </span>
</div> 
<!-- @click="handleFileDelete(data.key)" -->
</div>
</div>
</template>