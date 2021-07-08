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
      type="submit"
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
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginForm',
  setup () {
    const router = useRouter()

    const formState = reactive({
      email: '',
      password: ''
    })

    const rules = {
      email: { required: helpers.withMessage('Campo obrigatório', required) },
      password: { required: helpers.withMessage('Campo obrigatório', required) }
    }
    const v$ = useVuelidate(rules, formState, { $autoDirty: true })

    async function submit () {
      v$.value.$touch()
      if (v$.value.$error) return

      try {
        const token = await new Auth().Login(formState.email, formState.password)
        localStorage.setItem('token', token)
        await router.push({ path: '/' })
      } catch (error) {
        console.log(error)
      }
    }

    return { formState, v$, submit }
  }
})
</script>
