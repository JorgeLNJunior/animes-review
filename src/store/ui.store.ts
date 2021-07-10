import { defineStore } from 'pinia'

export const useUiStore = defineStore({
  id: 'ui',
  state: () => ({
    isYoutubeModalOpen: false,
    youtubeVideoId: ''
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
