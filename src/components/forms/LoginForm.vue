<template>
  <form class="box">
    <!-- email field -->
    <div class="field">
      <label class="label">Email</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="email"
          placeholder="user@mail.com"
        >
        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>
      </div>
    </div>

    <!-- password field -->
    <div class="field">
      <label class="label">Senha</label>
      <div class="control has-icons-left">
        <input
          class="input"
          type="password"
          placeholder="********"
        >
        <span class="icon is-small is-left">
          <i class="fas fa-lock" />
        </span>
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginForm'
})
</script>
