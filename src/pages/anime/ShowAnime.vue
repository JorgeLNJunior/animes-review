<template>
  <div
    class="modal is-hidden-mobile"
    :class="{ 'is-active': state.isModalOpen }"
  >
    <div
      class="modal-background"
      @click="closeModal()"
    />
    <div class="modal-content">
      <div class="has-text-centered">
        <img
          style="max-width: 300px;"
          :src="state.anime.cover"
        >
      </div>
    </div>
  </div>
  <div class="columns is-centered my-3">
    <div class="column is-10">
      <div
        v-if="state.isApiCallEnded"
        class="card"
      >
        <button
          class="button is-primary"
          style="position: absolute; top: 12px; right: 12px;"
          @click="redirectToReview()"
        >
          Avaliar
        </button>
        <div class="card-content">
          <div class="media">
            <div class="media-left is-hidden-mobile">
              <img
                class="cover"
                style="max-width: 130px;"
                :src="state.anime.cover"
                @click="openModal()"
              >
            </div>
            <div class="media-content">
              <div class="content">
                <p class="title is-4">
                  {{ state.anime.title }}
                </p>
                <div class="mb-4">
                  <div class="columns">
                    <div class="column is-2">
                      <b>Episódios: </b>
                      <span>{{ state.anime.episodes }}</span>
                    </div>
                    <div class="column is-4">
                      <b>Lançamento: </b>
                      <span>{{ formatDate(state.anime.releaseDate.replaceAll('-', ', ')) }}</span>
                    </div>
                    <div class="column is-2">
                      <b>Nota: </b>
                      <span>{{ state.anime.rating }}</span>
                    </div>
                    <div class="column is-2">
                      <b>Reviews: </b>
                      <span>{{ state.anime.reviews }}</span>
                    </div>
                  </div>
                </div>
                <span>{{ state.anime.synopsis }}</span>
                <div class="has-text-centered mt-5">
                  <iframe
                    v-if="state.anime.trailer"
                    width="426px"
                    height="240px"
                    :src="`https://youtube.com/embed/${state.anime.trailer.split('?v=').pop()}?controls=0`"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- TODO Listar os reviews do anime -->
</template>

<script lang="ts">
import { Anime, AnimeApi } from '@api/Anime'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ShowAnimePage',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      anime: {} as Anime,
      isModalOpen: false,
      isApiCallEnded: false
    })

    async function findAnime () {
      try {
        const anime = await new AnimeApi().find({ uuid: route.params.uuid as string })
        if (!anime[0]) {
          await router.push({ path: '/', query: { status: 'error', message: 'Anime não encontrado' } })
          return
        }

        state.anime = anime[0]
        state.isApiCallEnded = true
      } catch (error) {
        if (error.response) {
          await router.push({ path: '/', query: { status: 'error', message: 'Ocorreu um erro inesperado' } })
        }
      }
    }

    async function redirectToReview () {
      await router.push({ path: `/animes/${state.anime.uuid}/review` })
    }

    function openModal () {
      state.isModalOpen = true
    }

    function closeModal () {
      state.isModalOpen = false
    }

    function formatDate (date: string) {
      return format(new Date(date), "d 'de' LLLL 'de' y", { locale: ptBR })
    }

    onBeforeMount(async () => await findAnime())

    return { state, openModal, closeModal, formatDate, redirectToReview }
  }
})
</script>

<style scoped>
.cover {
  border-style: solid;
  border-width: 1px;
  border-radius: 3%;
  border-color: rgb(97, 97, 97);
}
.cover:hover {
  cursor: pointer;
}

iframe {
  border-style: solid;
  border-width: 1px;
  border-radius: 2%;
  border-color: rgb(97, 97, 97);
}
</style>
