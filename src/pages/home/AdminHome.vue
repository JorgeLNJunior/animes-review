<template>
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
                  <AnimeListItem
                    v-for="anime in state.animes.reverse()"
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
</template>

<script lang="ts">
import { Anime, AnimeApi } from '@api/Anime'
import AnimeListCardHeader from '@components/admin/AnimeListCardHeader.vue'
import AnimeListItem from '@components/admin/AnimeListItem.vue'
import YoutubeModal from '@components/admin/YoutubeModal.vue'
import AdminNavBar from '@components/bar/AdminNavBar.vue'
import { defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
  name: 'AdminHome',
  components: { AdminNavBar, AnimeListCardHeader, YoutubeModal, AnimeListItem },
  setup () {
    const animeApi = new AnimeApi()
    const state = reactive({
      animes: [] as Anime[]
    })

    async function findAnimes () {
      state.animes = await animeApi.find()
      console.log(state.animes)
    }

    onBeforeMount(async () => await findAnimes())

    return { state }
  }
})
</script>
