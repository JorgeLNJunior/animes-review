<template>
  <router-link
    :to="`/animes/${anime.uuid}`"
    style="text-decoration: none; color: inherit;"
  >
    <div class="columns my-1">
      <div class="column is-1 is-hidden-mobile">
        <span class="has-text-weight-semibold">{{ position }}- </span>
      </div>
      <div class="column is-11">
        <div>
          <div class="media">
            <div class="media-left">
              <figure class="image is-32x32">
                <img
                  :src="anime.cover"
                  class="cover"
                >
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-6">
                {{ anime.title }}
              </p>
              <p class="subtitle is-7">
                Nota: {{ anime.rating }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { Anime } from '@api/Anime'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'TopItem',
  props: {
    anime: {
      type: Object as PropType<Anime>,
      required: true
    },
    position: {
      type: Number,
      required: true
    }
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
</style>
