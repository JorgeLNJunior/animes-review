<template>
  <div class="columns is-centered mt-3 mr-2 ml-2">
    <div class="column is-8">
      <Chat />
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
import Chat from '@components/home/chat/Chat.vue'
import TopItem from '@components/home/TopItem.vue'
import { defineComponent, onBeforeMount, reactive } from 'vue'

export default defineComponent({
  name: 'AdminHomePage',
  components: { TopItem, Chat },
  setup () {
    const animeApi = new AnimeApi()
    const state = reactive({
      top10: [] as Anime[]
    })

    onBeforeMount(async () => await findTop10())

    async function findTop10 () {
      state.top10 = await animeApi.findTop10()
    }

    return { state }
  }
})
</script>
