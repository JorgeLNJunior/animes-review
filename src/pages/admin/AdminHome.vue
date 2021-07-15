<template>
  <div>
    <AdminNavBar />
    <router-view />
  </div>
</template>

<script lang="ts">
import AdminNavBar from '@components/bar/AdminNavBar.vue'
import {
  defineComponent
} from 'vue'

export default defineComponent({
  name: 'AdminHome',
  components: {
    AdminNavBar
  }
})
</script>
