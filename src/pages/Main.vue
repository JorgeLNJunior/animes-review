<template>
  <div>
    <NavBar />
    <router-view v-slot="{ Component }">
      <transition
        mode="out-in"
        enter-active-class="animate__animated animate__slideInLeft animate__faster"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import NavBar from '@components/bar/NavBar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainPage',
  components: { NavBar }
})
</script>
