<template>
  <button
    class="min-w-40 bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded-md transition ease-in-out cursor-pointer"
  >
    {{ text }}
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>