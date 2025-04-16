<template>
  <button
    class="min-w-40 bg-white hover:bg-primary/20 text-primary border-primary border-2 py-2 px-4 rounded-md transition ease-in-out cursor-pointer"
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