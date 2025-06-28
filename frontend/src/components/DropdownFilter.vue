<script>
export default {
  name: 'DropdownFilter',
  props:{
    isMultiSelectActiveValue:Boolean
  },
  data() {
    return {
      open: false,
      dropdown_list:[ 
      { id: 0, title: "All" },
        { id: 1, title: "Images" },
        { id: 2, title: "Documents" },
        { id: 3, title: "Videos" },
        { id: 4, title: "Others" },
      ],
      selectedOption:{ id: 0, title: "All" },
    };
  },
  methods: {
    toggleDropdown() {
      this.open = !this.open;
    },
    closeDropdown(e) {
      if (!this.$el.contains(e.target)) {
        this.open = false;
      }
    },
    handleDropdownSelection(dropdownValue){
        this.open = false;
this.selectedOption=dropdownValue
this.$emit('dropdown-selected',this.selectedOption.id)
    }
  },
  mounted() {
    document.addEventListener('click', this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  },
};
</script>

<template>
  <div class="relative inline-block text-left dropdown z-[10] ">
    <div>
      <button
      
        @click="toggleDropdown"
        class="inline-flex justify-center items-center w-full rounded-md px-4 py-2 text-white bg-[#1D4ED8] text-sm font-medium cursor-pointer " 
      >
        {{ selectedOption.title }} &nbsp; <i class="fa-solid fa-angle-down text-base"></i>
      </button>
    </div>

    <transition name="fade">
      <div
        v-if="open"
        class="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div style="" class="py-1">
          <div @click="handleDropdownSelection(item)" v-for="(item,index) in dropdown_list" :key="index" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
           {{ item.title }}
          </div>
         
         
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
