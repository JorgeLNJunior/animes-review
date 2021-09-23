<template>
  <div class="columns is-centered mt-4">
    <div class="column is-7">
      <AnimeCarousel :animes="state.ramdomAnimes" />
    </div>
    <div class="column is-3">
      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
            Top 10
          </p>
        </div>
        <div class="card-content">
          <TopItem
            v-for="(anime, index) of state.topAnimes"
            :key="index"
            :position="index + 1"
            :anime="anime"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Anime, AnimeApi } from '@api/Anime'
import AnimeCarousel from '@components/animes/AnimeCarousel.vue'
import TopItem from '@components/home/TopItem.vue'
import { defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
  name: 'AnimeHome',
  components: { AnimeCarousel, TopItem },
  setup () {
    const state = reactive({
      topAnimes: [] as Anime[],
      ramdomAnimes: [] as Anime[]
    })

    onBeforeMount(async () => {
      await findTopAnimes()
      await findRamdomAnimes()
    })

    async function findTopAnimes () {
      state.topAnimes = await new AnimeApi().findTop10()
    }

    async function findRamdomAnimes () {
      state.ramdomAnimes = await new AnimeApi().findTop10()
    }

    return { state }
  }
})
</script>

<style>
.carousel__prev,
.carousel__next {
  background-color: hsl(171, 100%, 41%);
}
</style>
