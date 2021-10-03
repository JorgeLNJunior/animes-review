<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered is-vcentered">
          <div class="column has-text-centered">
            <span
              v-if="!state.isApiCallEnded"
              class="is-size-3"
            >
              Aguarde...
            </span>
            <span
              v-if="state.isApiCallEnded && state.isEmailConfirmed"
              class="is-size-3"
            >Email Confirmado, você será redirecionado em {{ state.timer }}</span>
            <span
              v-if="state.isApiCallEnded && !state.isEmailConfirmed"
              class="is-size-3"
            >Erro ao confirmar o email</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Auth } from '@api/Auth'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'EmailConfirmationPage',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      isEmailConfirmed: false,
      isApiCallEnded: false,
      timer: 5
    })

    onBeforeMount(async () => await confirmEmail())

    async function confirmEmail () {
      const token = route.query.token
      if (!token) return

      await new Auth().confirmEmail(token as string)

      state.isApiCallEnded = true
      state.isEmailConfirmed = true

      await new Promise((resolve) => {
        const interval = setInterval(() => {
          state.timer--
          if (state.timer <= 0) {
            resolve(1)
            clearInterval(interval)
          }
        }, 1000)
      })

      router.push({ path: '/login' })
    }

    return { state }
  }
})
</script>

<style>
</style>
