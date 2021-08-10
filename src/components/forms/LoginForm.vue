<template>
  <form
    class="box"
    @submit.prevent="submit()"
  >
    <!-- email field -->
    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left">
        <input
          v-model="formState.email"
          class="input"
          :class="{ 'is-danger': v$.email.$errors.length }"
          placeholder="user@mail.com"
        >
        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>
        <p
          v-for="error of v$.email.$errors"
          :key="error.$uid"
          class="help is-danger"
        >
          {{ error.$message }}
        </p>
      </div>
    </div>

    <!-- password field -->
    <div class="field">
      <label class="label">Senha</label>
      <div class="control has-icons-left">
        <input
          v-model="formState.password"
          :class="{ 'is-danger': v$.password.$errors.length }"
          class="input"
          type="password"
          placeholder="********"
        >
        <span class="icon is-small is-left">
          <i class="fas fa-lock" />
        </span>
        <p
          v-for="error of v$.password.$errors"
          :key="error.$uid"
          class="help is-danger"
        >
          {{ error.$message }}
        </p>
      </div>
    </div>

    <button
      class="button is-primary is-fullwidth mt-5"
      :class="{ 'is-loading': uiState.loginBtn.isLoading }"
      type="submit"
      :disabled="uiState.loginBtn.isDisabled"
    >
      <span class="icon">
        <i class="fas fa-sign-in-alt" />
      </span>
      <span>
        Entrar
      </span>
    </button>
  </form>
</template>

<script lang="ts">
import { Auth } from '@api/Auth'
import { token } from '@api/token.interface'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import decode from 'jwt-decode'
import { defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'LoginForm',
  setup () {
    const toast = useToast()
    const route = useRoute()

    const formState = reactive({
      email: '',
      password: ''
    })
    const uiState = reactive({
      loginBtn: {
        isLoading: false,
        isDisabled: false
      }
    })

    const rules = {
      email: { required: helpers.withMessage('Campo obrigatório', required) },
      password: { required: helpers.withMessage('Campo obrigatório', required) }
    }
    const v$ = useVuelidate(rules, formState, { $autoDirty: true })

    async function submit () {
      v$.value.$touch()
      if (v$.value.$error) return

      uiState.loginBtn.isLoading = true
      uiState.loginBtn.isDisabled = true

      try {
        const token = await new Auth().Login(formState.email, formState.password)
        localStorage.setItem('token', token)

        const user: token = decode(token)

        if (route.query.redirect) {
          window.location.replace(route.query.redirect as string)
          return
        }
        if (user.isAdmin) {
          window.location.replace('/admin')
        } else {
          window.location.replace('/')
        }
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
        console.log(error)
      } finally {
        uiState.loginBtn.isLoading = false
        uiState.loginBtn.isDisabled = false
      }
    }

    return { formState, v$, submit, uiState }
  }
})
</script>
