<template>
  <tr>
    <td @click="redirect()">
      {{ anime.title }}
    </td>
    <td @click="redirect()">
      <abbr :title="anime.synopsis">{{ anime.synopsis.slice(0, 50) }}...</abbr>
    </td>
    <td>
      <button
        class="button is-info is-outlined"
        @click="store.openYoutubeModal(String(anime.trailer.split('v=').pop()))"
      >
        Ver
      </button>
    </td>
    <td @click="redirect()">
      {{ anime.episodes }}
    </td>
    <td>
      <router-link :to="`/admin/animes/update/${anime.uuid}`">
        <button class="button is-info">
          Editar
        </button>
      </router-link>
    </td>
    <td>
      <button
        class="button is-danger"
        :class="{ 'is-loading': state.isDeleteBtnLoading }"
        @click="deleteAnime()"
      >
        Excluir
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { Anime, AnimeApi } from '@api/Anime'
import { useMainStore } from '@store/main.store'
import { defineComponent, PropType, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AnimeListItem',
  props: {
    anime: {
      type: Object as PropType<Anime>,
      required: true
    }
  },
  setup (props) {
    const animeApi = new AnimeApi()
    const store = useMainStore()
    const router = useRouter()
    const state = reactive({
      isDeleteBtnLoading: false
    })

    async function redirect () {
      await router.push({ path: `/animes/${props.anime.uuid}` })
    }

    async function deleteAnime () {
      try {
        state.isDeleteBtnLoading = true
        await animeApi.delete(props.anime.uuid)
        await router.push({ path: '/admin/animes', query: { status: 'success', message: 'Anime excluído com sucesso' } })
        router.go(0)
      } catch (error) {
        if (error.response) {
          await router.push({ path: '/admin/animes', query: { status: 'error', message: 'Falha ao excluir anime' } })
          router.go(0)
        }
        console.log(error)
      } finally {
        state.isDeleteBtnLoading = false
      }
    }

    return { store, state, deleteAnime, redirect }
  }
})
</script>

<style scoped>
abbr[title] {
  border-bottom: none;
  text-decoration: none;
}

tr :hover {
  cursor: pointer;
}
</style>
