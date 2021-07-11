<template>
  <div>
    <AdminNavBar />
    <YoutubeModal />
    <div class="columns is-centered">
      <div class="column is-four-fifths">
        <div class="has-text-centered my-4">
          <span class="is-size-3 has-text-weight-medium">Animes</span>
        </div>
        <div class="card">
          <AnimeListCardHeader />
          <div class="card-content">
            <div class="columns is-centered">
              <div class="column is-full">
                <table class="table is-fullwidth is-hoverable is-striped">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Sinopse</th>
                      <th>Trailer</th>
                      <th>Episódios</th>
                      <th>Editar</th>
                      <th>Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimeListCardSkeleton v-if="state.isLoading" />
                    <AnimeListItem
                      v-for="anime in state.animes"
                      v-else
                      :key="anime.uuid"
                      :anime="anime"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Anime, AnimeApi } from '@api/Anime'
import AnimeListCardHeader from '@components/admin/AnimeListCardHeader.vue'
import AnimeListCardSkeleton from '@components/admin/AnimeListCardSkeleton.vue'
import AnimeListItem from '@components/admin/AnimeListItem.vue'
import YoutubeModal from '@components/admin/YoutubeModal.vue'
import AdminNavBar from '@components/bar/AdminNavBar.vue'
import { useMainStore } from '@store/main.store'
import { defineComponent, onBeforeMount, onMounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'AdminHome',
  components: {
    AdminNavBar,
    AnimeListCardHeader,
    YoutubeModal,
    AnimeListItem,
    AnimeListCardSkeleton
  },
  setup () {
    const animeApi = new AnimeApi()
    const toast = useToast()
    const store = useMainStore()
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      animes: [] as Anime[],
      isLoading: false
    })

    async function findAnimes () {
      try {
        state.isLoading = true
        state.animes = (await animeApi.find(store.animeQuery)).reverse()
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message)
        }
        console.log(error)
      } finally {
        state.isLoading = false
      }
    }

    onBeforeMount(async () => {
      await findAnimes()
    })
    onMounted(() => {
      if (route.query.status === 'error') {
        toast.error(String(route.query.message))
        router.replace({ query: { message: null, status: null } })
      }
      if (route.query.status === 'success') {
        toast.success(String(route.query.message))
        router.replace({ query: { message: null, status: null } })
      }
    })
    watch(() => store.$state.animeQuery, async () => { await findAnimes() },
      { deep: true }
    )

    return { state }
  }
})
</script>
