import { AnimeQuery } from '@api/Anime'
import { defineStore } from 'pinia'

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    isYoutubeModalOpen: false,
    youtubeVideoId: '',
    animeQuery: {} as AnimeQuery
  }),
  actions: {
    openYoutubeModal (videoId: string) {
      this.youtubeVideoId = videoId
      this.isYoutubeModalOpen = true
    },
    closeYoutubeModal () {
      this.isYoutubeModalOpen = false
      this.youtubeVideoId = ''
    }
  }
})
