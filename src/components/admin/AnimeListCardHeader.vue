<template>
  <div class="card-header">
    <div class="columns is-centered my-3">
      <div class="column is-one-fifth has-text-centered">
        <router-link to="/admin/animes/new">
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
              v-model="state.title"
              v-debounce:800ms="updateStore"
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
              v-model.number="state.take"
              v-debounce:800ms="updateStore"
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
              v-model.number="state.skip"
              v-debounce:800ms="updateStore"
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
import { useMainStore } from '@store/main.store'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'AdminAnimeListCardHeader',
  setup () {
    const store = useMainStore()
    const state = reactive({
      title: '',
      take: undefined,
      skip: undefined
    })

    function updateStore () {
      store.animeQuery.title = state.title
      store.animeQuery.take = state.take
      store.animeQuery.skip = state.skip
    }

    return { state, updateStore }
  }
})
</script>
