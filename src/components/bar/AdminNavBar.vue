<template>
  <nav
    class="navbar has-shadow"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a
        href="/admin"
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
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start" />
      <div class="navbar-end">
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
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AdminNavBar',
  setup () {
    const router = useRouter()

    function logout () {
      localStorage.removeItem('token')
      router.push('/login')
    }

    return { logout }
  }
})
</script>
