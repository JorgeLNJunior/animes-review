<template>
  <div class="card block">
    <div class="card-content">
      <article class="media">
        <figure class="media-left">
          <p class="image is-48x48">
            <img
              class="is-rounded"
              :src="review.user.avatar"
            >
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <div class="mt-2">
              <router-link
                :to="`/users/${review.user.uuid}`"
                target="_blank"
                style="text-decoration: none; color: inherit;"
              >
                <strong>{{ review.user.name }}</strong>
              </router-link>
              <div class="columns is-centered is-gapless">
                <div class="column is-1 has-text-centered is-size-6">
                  <strong>Nota: </strong>
                  <span>{{ review.rating }}</span>
                </div>
              </div>
            </div>
            <div class="divider">
              <strong>{{ review.title }}</strong>
            </div>
            <!-- description start -->
            <div
              v-if="review.description.length >= 300"
              class="has-text-justified"
            >
              <p v-if="state.showMore">
                {{ review.description }}
                <a @click="showLess()">Ver menos</a>
              </p>
              <div v-else>
                <p>
                  {{ review.description.slice(0, 300) }}...
                  <a @click="showMore()">Ver mais</a>
                </p>
              </div>
            </div>
            <div
              v-else
              class="has-text-justified"
            >
              <p>
                {{ review.description }}
              </p>
            </div>
            <!-- description end -->
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { Review } from '@api/Review'
import { defineComponent, PropType, reactive } from 'vue'
export default defineComponent({
  name: 'ReviewListItem',
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true
    }
  },
  setup () {
    const state = reactive({
      showMore: false
    })

    function showMore () {
      state.showMore = true
    }

    function showLess () {
      state.showMore = false
    }

    return { state, showMore, showLess }
  }
})
</script>
