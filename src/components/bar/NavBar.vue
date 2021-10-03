<template>
  <nav
    class="navbar has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <router-link
        to="/home"
        class="navbar-item"
      >
        <img
          src="https://bulma.io/images/bulma-logo.png"
          width="112"
          height="28"
        >
      </router-link>

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
        <router-link
          class="navbar-item"
          to="/animes"
        >
          Animes
        </router-link>
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
                <router-link
                  v-for="anime of state.dropDownAnimeList"
                  :key="anime.uuid"
                  :to="`/animes/${anime.uuid}`"
                  class="dropdown-item"
                >
                  <p class="title is-6">
                    {{ anime.title }}
                  </p>
                </router-link>
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
              <router-link
                style="text-decoration: none; color: inherit;"
                :to="`/users/${state.authenticatedUser.uuid}/config`"
              >
                <span class="level-item">Configurações</span>
              </router-link>
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
import { token } from '@api/token.interface'
import { User, UserApi } from '@api/User'
import jwtDecode from 'jwt-decode'
import { defineComponent, onBeforeMount, reactive } from 'vue'
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
      isDropdownActive: false,
      authenticatedUser: {} as User
    })

    onBeforeMount(async () => await findAuthenticatedUser())

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

    async function findAuthenticatedUser () {
      const token = localStorage.getItem('token')
      const decoded: token = jwtDecode(token as string)
      const userList = await new UserApi().find({ uuid: decoded.uuid })
      state.authenticatedUser = userList[0]
    }

    function logout () {
      localStorage.removeItem('token')
      router.push('/login')
    }

    return { state, logout, openCloseMenu, findAnimes }
  }
})
</script>
