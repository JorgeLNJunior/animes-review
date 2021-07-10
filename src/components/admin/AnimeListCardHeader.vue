<template>
  <div class="card-header">
    <div class="columns is-centered my-3">
      <div class="column is-one-fifth has-text-centered">
        <router-link to="#">
          <button class="button is-primary">
            <span class="icon is-small">
              <i class="fas fa-plus-circle" />
            </span>
            <span>Novo</span>
          </button>
        </router-link>
      </div>
      <div class="column">
        <div class="field">
          <p class="control has-icons-left">
            <input
              placeholder="Procurar"
              type="text"
              class="input"
            >
            <span class="icon is-small is-left">
              <i class="fas fa-search" />
            </span>
          </p>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="field">
          <p class="control has-icons-left">
            <input
              placeholder="Max"
              type="number"
              min="1"
              class="input"
            >
            <span class="icon is-small is-left">
              <i class="fas fa-list" />
            </span>
          </p>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="field">
          <p class="control has-icons-left">
            <input
              placeholder="Skip"
              type="number"
              min="0"
              class="input"
            >
            <span class="icon is-small is-left">
              <i class="fas fa-angle-double-right" />
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminAnimeListCardHeader'
})
</script>
