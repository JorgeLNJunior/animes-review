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
                  <div class="mb-4">
                    <div class="columns">
                      <div class="column is-3">
                        <b>Email: </b>
                        <span>{{ state.user.email }}</span>
                      </div>
                      <div class="column is-4">
                        <b>Entrou em: </b>
                        <span>{{ formatDate(state.user.createdAt) }}</span>
                      </div>
                      <div class="column is-2">
                        <b>Administrador: </b>
                        <span>{{ state.user.isAdmin ? 'Sim' : 'Não' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-8">
        <ReviewListItem
          v-for="review of state.reviews"
          :key="review.uuid"
          :review="review"
          :has-modify-permission="checkPermission(review.user.uuid)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Review, ReviewApi } from '@api/Review'
import { User, UserApi } from '@api/User'
import ReviewListItem from '@components/animes/ReviewListItem.vue'
import { hasModifyPermission } from '@helpers/helpers'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'SingleUser',
  components: { ReviewListItem },
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

    function checkPermission (userUuid: string) {
      return hasModifyPermission(userUuid)
    }

    function formatDate (date: string) {
      return format(new Date(date), "d 'de' LLLL 'de' y", { locale: ptBR })
    }

    onBeforeMount(async () => {
      await findUser()
      await findReviews()
    })

    return { state, route, checkPermission, formatDate }
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
