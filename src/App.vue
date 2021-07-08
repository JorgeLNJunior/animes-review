<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>

<style>
.Vue-Toastification__toast--default {
  background-color: hsl(171, 100%, 41%);
  color: #fff;
}
.Vue-Toastification__toast--info {
  background-color: hsl(204, 86%, 53%);
  color: #fff;
}
.Vue-Toastification__toast--success {
  background-color: hsl(141, 53%, 53%);
  color: #fff;
}
.Vue-Toastification__toast--error {
  background-color: hsl(348, 100%, 61%);
  color: #fff;
}
.Vue-Toastification__toast--warning {
  background-color: hsl(48, 100%, 67%);
  color: #fff;
}
</style>
