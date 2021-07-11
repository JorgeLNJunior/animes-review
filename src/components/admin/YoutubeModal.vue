<template>
  <div
    class="modal is-full"
    :class="{ 'is-active': store.isYoutubeModalOpen }"
  >
    <div class="modal-background" />
    <div class="modal-card">
      <section class="modal-card-body has-background-transparent">
        <div class="columns is-centered">
          <div class="column has-text-centered">
            <iframe
              :src="`https://youtube.com/embed/${store.youtubeVideoId}?controls=0&autoplay=1`"
              width="480"
              height="360"
            />
          </div>
        </div>
      </section>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="store.closeYoutubeModal()"
    />
  </div>
</template>

<script lang="ts">
import { useMainStore } from '@store/main.store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'YoutubeModal',
  setup () {
    const store = useMainStore()

    return { store }
  }
})
</script>

<style scoped>
.has-background-transparent {
  background-color: transparent;
}
</style>
