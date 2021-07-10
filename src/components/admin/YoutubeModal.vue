<template>
  <div
    class="modal is-full"
    :class="{ 'is-active': ui.isYoutubeModalOpen }"
  >
    <div class="modal-background" />
    <div class="modal-card">
      <section class="modal-card-body has-background-transparent">
        <div class="columns is-centered">
          <div class="column has-text-centered">
            <iframe
              :src="`https://youtube.com/embed/${ui.youtubeVideoId}?controls=0&autoplay=1`"
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
      @click="ui.closeYoutubeModal()"
    />
  </div>
</template>

<script lang="ts">
import { useUiStore } from '@store/ui.store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'YoutubeModal',
  setup () {
    const ui = useUiStore()

    return { ui }
  }
})
</script>

<style scoped>
.has-background-transparent {
  background-color: transparent;
}
</style>
