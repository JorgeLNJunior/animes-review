<template>
  <div
    v-if="!state.isDestroyed"
    class="card block"
  >
    <div class="card-content">
      <div
        v-if="hasModifyPermission"
        class="top-right-item columns"
      >
        <div class="column is-4">
          <button
            class="button is-danger is-inverted"
            :class="{ 'is-loading': state.isDeleteBtnLoading }"
            @click="deleteReview()"
          >
            <span class="icon is-small">
              <i class="fas fa-trash-alt" />
            </span>
          </button>
        </div>
        <div class="column is-4">
          <router-link :to="`/reviews/${review.uuid}/update`">
            <button class="button is-info is-inverted">
              <span class="icon is-small">
                <i class="fas fa-pen" />
              </span>
            </button>
          </router-link>
        </div>
      </div>
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
import { Review, ReviewApi } from '@api/Review'
import { defineComponent, PropType, reactive } from 'vue'
import { useToast } from 'vue-toastification'
export default defineComponent({
  name: 'ReviewListItem',
  props: {
    review: {
      type: Object as PropType<Review>,
      required: true
    },
    hasModifyPermission: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup (props) {
    const state = reactive({
      showMore: false,
      isDestroyed: false,
      isDeleteBtnLoading: false
    })
    const toast = useToast()

    function showMore () {
      state.showMore = true
    }

    function showLess () {
      state.showMore = false
    }

    async function deleteReview () {
      try {
        state.isDeleteBtnLoading = true
        await new ReviewApi().delete(props.review.uuid)
        state.isDestroyed = true
        toast.success('Review deletado com sucesso')
      } catch (error) {
        console.log(error)
        toast.error('Ocorreu um error ao deletar o review')
      } finally {
        state.isDeleteBtnLoading = false
      }
    }

    return { state, showMore, showLess, deleteReview }
  }
})
</script>

<style scoped>
.top-right-item {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
