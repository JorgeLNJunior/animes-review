<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered is-vcentered">
          <div class="column has-text-centered">
            <span class="is-size-3">
              Não encontrado...
            </span>
            <br class="my-5">
            <router-link to="/">
              <button class="button is-primary is-inverted">
                Voltar
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EmailConfirmationPage'
})
</script>
