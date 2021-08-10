<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered is-vcentered">
          <div class="column is-half">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
    <div class="has-text-centered">
      <p class="has-text-grey-lighter">
        arte por
        <a
          class="has-text-grey-darker"
          href="https://www.deviantart.com/richtsu"
          target="_blank"
        >
          <strong>richtsu</strong>
        </a>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import LoginForm from '@components/forms/LoginForm.vue'
import { defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'LoginPage',
  components: { LoginForm },
  setup () {
    const route = useRoute()
    const toast = useToast()

    onMounted(() => {
      if (route.query.message) {
        toast(route.query.message)
      }
    })
  }
})
</script>

<style>
body {
  background-image: url('@assets/login-bg.jpg');
  background-attachment: fixed;
  background-size: cover;
}
</style>
