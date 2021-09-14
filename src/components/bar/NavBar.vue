<template>
  <nav
    class="navbar has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a
        href="/home"
        class="navbar-item"
      >
        <img
          src="https://bulma.io/images/bulma-logo.png"
          width="112"
          height="28"
        >
      </a>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        @click="openCloseMenu()"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
    <div
      class="navbar-menu"
      :class="{ 'is-active': state.isMenuActive }"
    >
      <div class="navbar-start">
        <a
          class="navbar-item"
          href="/animes"
        >
          Animes
        </a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div
            class="dropdown"
            :class="{ 'is-active': state.isDropdownActive}"
          >
            <div class="dropdown-trigger">
              <div class="field">
                <p
                  class="control has-icons-left"
                  :class="{ 'is-loading': state.isLoading }"
                >
                  <input
                    v-model="state.search"
                    v-debounce:600ms="findAnimes"
                    type="text"
                    class="input"
                    placeholder="Procurar"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-search" />
                  </span>
                </p>
              </div>
            </div>
            <div
              id="dropdown-menu"
              class="dropdown-menu"
              role="menu"
            >
              <div class="dropdown-content">
                <a
                  v-for="anime of state.dropDownAnimeList"
                  :key="anime.uuid"
                  :href="`/animes/${anime.uuid}`"
                  class="dropdown-item"
                >
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-28x28">
                        <img
                          :src="anime.cover"
                          class="cover"
                        >
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-6">
                        {{ anime.title }}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Opções
          </a>

          <div class="navbar-dropdown is-boxed is-right">
            <a class="navbar-item">
              <span class="level-item">Configurações</span>
            </a>
            <hr class="navbar-driver">
            <a
              class="navbar-item"
              @click="logout()"
            >
              <span class="level-item">Sair</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Anime, AnimeApi } from '@api/Anime'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'NavBar',
  setup () {
    const router = useRouter()
    const state = reactive({
      search: '',
      dropDownAnimeList: [] as Anime[],
      isLoading: false,
      isMenuActive: false,
      isDropdownActive: false
    })

    async function findAnimes () {
      if (state.search.length <= 0) {
        state.isDropdownActive = false
        return
      }

      try {
        state.isLoading = true
        state.dropDownAnimeList = await new AnimeApi().find({ title: state.search })
      } finally {
        state.isLoading = false
      }

      if (state.dropDownAnimeList.length > 0) {
        state.isDropdownActive = true
      } else {
        state.isDropdownActive = false
      }
    }

    function openCloseMenu () {
      state.isMenuActive = !state.isMenuActive
    }

    function logout () {
      localStorage.removeItem('token')
      router.push('/login')
    }

    return { state, logout, openCloseMenu, findAnimes }
  }
})
</script>
