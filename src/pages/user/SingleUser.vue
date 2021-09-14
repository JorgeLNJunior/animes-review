<template>
  <div>
    <div class="columns is-centered mt-3">
      <div class="column is-10">
        <div
          v-if="state.isApiCallEnded"
          class="card"
        >
          <div class="card-content">
            <div class="media">
              <div class="media-left is-hidden-mobile">
                <img
                  class="avatar"
                  style="max-width: 55px;"
                  :src="state.user.avatar"
                >
              </div>
              <div class="media-content">
                <div class="content">
                  <p class="title is-4 mt-3">
                    {{ state.user.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-8">
        <ReviewList
          v-for="review of state.reviews"
          :key="review.uuid"
          :review="review"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Review, ReviewApi } from '@api/Review'
import { User, UserApi } from '@api/User'
import ReviewList from '@components/animes/ReviewListItem.vue'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'SingleUser',
  components: { ReviewList },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      user: {} as User,
      reviews: [] as Review[],
      isApiCallEnded: false
    })

    async function findUser () {
      try {
        const user = await new UserApi().find({ uuid: route.params.uuid as string })
        if (!user[0]) {
          await router.push({ path: '/', query: { status: 'error', message: 'Usuário não encontrado' } })
          return
        }

        state.user = user[0]
        state.isApiCallEnded = true
      } catch (error) {
        if (error.response) {
          await router.push({ path: '/', query: { status: 'error', message: 'Ocorreu um erro inesperado' } })
        }
      }
    }

    async function findReviews () {
      state.reviews = await new ReviewApi().find({ userUuid: state.user.uuid as string, take: 10 })
    }

    onBeforeMount(async () => {
      await findUser()
      await findReviews()
    })

    return { state, route }
  }
})
</script>

<style scoped>
.avatar {
  border-style: solid;
  border-width: 1px;
  border-radius: 60%;
  border-color: rgb(97, 97, 97);
}
</style>
