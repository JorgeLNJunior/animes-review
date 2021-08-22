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
    <AuthFooter />
  </section>
</template>

<script lang="ts">
import AuthFooter from '@components/auth/AuthFooter.vue'
import LoginForm from '@components/forms/LoginForm.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginPage',
  components: { LoginForm, AuthFooter }
})
</script>

<style>
body {
  background-image: url('@assets/login-bg.jpg');
  background-attachment: fixed;
  background-size: cover;
}
</style>
