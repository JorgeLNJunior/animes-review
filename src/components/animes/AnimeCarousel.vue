<template>
  <div>
    <Carousel
      :autoplay="autoplay"
      :items-to-show="2.5"
      :wrap-around="true"
    >
      <Slide
        v-for="anime in animes"
        :key="anime.uuid"
      >
        <div class="carousel__item">
          <router-link :to="`/animes/${anime.uuid}`">
            <img
              class=""
              :src="anime.cover"
            >
          </router-link>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<script lang="ts">
import { Anime } from '@api/Anime'
import { defineComponent, PropType } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'

export default defineComponent({
  name: 'AnimeCarousel',
  components: { Carousel, Navigation, Slide },
  props: {
    animes: {
      type: Array as PropType<Anime[]>,
      required: true
    },
    autoplay: {
      type: Number,
      default: 2000,
      required: false
    }
  }
})
</script>
