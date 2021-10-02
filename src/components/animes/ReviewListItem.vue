<template>
  <div
    v-if="!state.isDestroyed"
    class="card block"
  >
    <div class="card-content">
      <div class="top-right-item columns is-mobile">
        <div
          v-if="hasModifyPermission"
          class="column is-4"
        >
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
        <div
          v-if="hasModifyPermission"
          class="column is-4"
        >
          <router-link :to="`/reviews/${review.uuid}/update`">
            <button class="button is-info is-inverted">
              <span class="icon is-small">
                <i class="fas fa-pen" />
              </span>
            </button>
          </router-link>
        </div>
        <div class="column is-4">
          <button
            class="button is-inverted"
            :class="{ 'is-loading': state.isVoteBtnLoading, 'is-primary': state.isUserAlreadyVoted }"
            @click="voteButtonClick()"
          >
            <span class="badge">{{ state.numberOfVotes }}</span>
            <div>
              <span class="icon is-small">
                <i class="far fa-thumbs-up" />
              </span>
            </div>
          </button>
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
import { User } from '@api/User'
import { Vote, VoteApi } from '@api/Vote'
import { defineComponent, onBeforeMount, PropType, reactive } from 'vue'
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
    },
    authenticatedUser: {
      type: Object as PropType<User>,
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      showMore: false,
      isDestroyed: false,
      isDeleteBtnLoading: false,
      isVoteBtnLoading: false,
      isUserAlreadyVoted: false,
      numberOfVotes: 0,
      userVote: {} as Vote
    })
    const toast = useToast()

    onBeforeMount(async () => {
      await findReviewVotes()
      await checkUserVote()
    })

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

    async function findReviewVotes () {
      const { total } = await new VoteApi().find({ reviewUuid: props.review.uuid })
      state.numberOfVotes = total
    }

    async function checkUserVote () {
      const { votes } = await new VoteApi().find({
        userUuid: props.authenticatedUser.uuid,
        reviewUuid: props.review.uuid
      })
      if (votes[0]) {
        state.userVote = votes[0]
        state.isUserAlreadyVoted = true
      }
    }

    async function voteButtonClick () {
      state.isVoteBtnLoading = true
      if (state.isUserAlreadyVoted) {
        try {
          await new VoteApi().delete(state.userVote.uuid)
          state.isUserAlreadyVoted = false
          state.numberOfVotes--
        } catch (error) {
          console.log(error)
          toast.error('Ocorreu um error ao votar')
        } finally {
          state.isVoteBtnLoading = false
        }
      } else {
        try {
          await new VoteApi().vote(props.review.uuid)
          state.isUserAlreadyVoted = true
          state.numberOfVotes++
        } catch (error) {
          console.log(error)
          toast.error('Ocorreu um error ao retirar o voto')
        } finally {
          state.isVoteBtnLoading = false
        }
      }
    }

    return { state, showMore, showLess, deleteReview, voteButtonClick }
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
