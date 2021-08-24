<template>
  <div class="columns is-centered mt-3 mr-2 ml-2">
    <div class="column is-9">
      <h1>Left</h1>
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
            v-for="(anime, index) of state.top10"
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
import TopItem from '@components/home/TopItem.vue'
import { defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
  name: 'HomePage',
  components: { TopItem },
  setup () {
    const animeApi = new AnimeApi()
    const state = reactive({
      top10: [] as Anime[],
      animes: {} as Anime[]
    })

    onBeforeMount(async () => {
      await findTop10()
      await findAnimes()
    })

    async function findTop10 () {
      state.top10 = await animeApi.findTop10()
    }

    async function findAnimes () {
      state.animes = await animeApi.find({ take: 10 })
    }

    return { state }
  }
})
</script>
