<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered is-vcentered">
          <div class="column is-half">
            <form
              class="box"
              @submit.prevent="submit()"
            >
              <!-- Name field -->
              <div class="field">
                <label class="label">Nome</label>
                <div class="control has-icons-left">
                  <input
                    v-model="formState.name"
                    type="text"
                    class="input"
                    :class="{ 'is-danger': v$.name.$errors.length }"
                    placeholder="Nome"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-user" />
                  </span>
                  <p
                    v-for="error of v$.name.$errors"
                    :key="error.$uid"
                    class="help is-danger"
                  >
                    {{ error.$message }}
                  </p>
                </div>
              </div>
              <!-- Email field -->
              <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left">
                  <input
                    v-model="formState.email"
                    type="text"
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
              <!-- Password field -->
              <div class="field">
                <label class="label">Senha</label>
                <div class="control has-icons-left">
                  <input
                    v-model="formState.password"
                    type="password"
                    class="input"
                    :class="{ 'is-danger': v$.password.$errors.length }"
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
              <div class="has-text-centered">
                <button
                  class="button is-primary is-fullwidth mt-5"
                  :class="{ 'is-loading': uiState.isLoading }"
                  :disabled="uiState.isDisabled"
                >
                  <span class="icon">
                    <i class="fas fa-sign-in-alt" />
                  </span>
                  <span>
                    Registrar
                  </span>
                </button>
                <router-link
                  to="/login"
                  style="text-decoration: none; color: inherit;"
                >
                  <button
                    class="button is-ghost"
                    @submit.prevent
                  >
                    Entrar
                  </button>
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <AuthFooter />
  </section>
</template>

<script lang="ts">
import { Auth } from '@api/Auth'
import AuthFooter from '@components/auth/AuthFooter.vue'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'RegisterPage',
  components: { AuthFooter },
  setup () {
    const toast = useToast()
    const router = useRouter()
    const formState = reactive({
      name: '',
      email: '',
      password: ''
    })
    const uiState = reactive({
      isDisabled: false,
      isLoading: false
    })

    const rules = {
      name: { required: helpers.withMessage('Campo obrigatório', required) },
      email: {
        required: helpers.withMessage('Campo obrigatório', required),
        email: helpers.withMessage('Deve ser um email', email)
      },
      password: {
        required: helpers.withMessage('Campo obrigatório', required),
        minLength: helpers.withMessage('Deve ter pelo menos 6 caracteres', minLength(6))
      }
    }
    const v$ = useVuelidate(rules, formState, { $autoDirty: true })

    async function submit () {
      v$.value.$touch()
      if (v$.value.$error) return

      try {
        uiState.isDisabled = true
        uiState.isLoading = true

        await new Auth().register(formState)
        toast.success('Registrado com sucesso')
        await router.push({ path: '/login' })
      } catch (error) {
        console.log(error)
        if (error.response.status === 400) {
          toast.error(error.response.data.message[0])
          return
        }
        toast.error('Ocorreu um erro inesperado')
      } finally {
        uiState.isDisabled = false
        uiState.isLoading = false
      }
    }

    return { v$, formState, uiState, submit }
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
