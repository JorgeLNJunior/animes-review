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
  <div class="columns is-centered mt-3">
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
        <div class="card-content is-clipped">
          <div class="media">
            <div class="media-left is-hidden-mobile">
              <img
                class="cover is-clickable"
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
                      <span>{{ state.anime.rating.toFixed(1) }}</span>
                    </div>
                    <div class="column is-2">
                      <b>Reviews: </b>
                      <span>{{ state.anime.reviews }}</span>
                    </div>
                  </div>
                </div>
                <div class="has-text-justified">
                  <span>{{ state.anime.synopsis }}</span>
                </div>
                <div class="has-text-centered mt-5">
                  <iframe
                    v-if="state.anime.trailer"
                    v-show="state.isIframeLoaded"
                    width="426px"
                    height="240px"
                    :src="`https://youtube.com/embed/${state.anime.trailer.split('?v=').pop()}?controls=0`"
                    @load="showIframe()"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="columns is-centered">
    <div class="column is-8">
      <!-- eslint-disable-next-line vue/attribute-hyphenation -->
      <ReviewList
        v-for="review of state.reviews"
        :key="review.uuid"
        :review="review"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Anime, AnimeApi } from '@api/Anime'
import { Review, ReviewApi } from '@api/Review'
import ReviewList from '@components/animes/ReviewListItem.vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'ShowAnimePage',
  components: { ReviewList },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      anime: {} as Anime,
      reviews: [] as Review[],
      isModalOpen: false,
      isApiCallEnded: false,
      isIframeLoaded: false
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

    async function findReviews () {
      state.reviews = await new ReviewApi().find({ animeUuid: state.anime.uuid as string, take: 10 })
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

    function showIframe () {
      state.isIframeLoaded = true
    }

    onBeforeMount(async () => {
      await findAnime()
      await findReviews()
    })

    return { state, openModal, closeModal, formatDate, redirectToReview, route, showIframe }
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

iframe {
  border-style: solid;
  border-width: 1px;
  border-radius: 2%;
  border-color: rgb(97, 97, 97);
}
</style>
