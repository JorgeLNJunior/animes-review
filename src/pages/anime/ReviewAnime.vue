<template>
  <div class="columns is-centered mt-5">
    <div class="column is-8">
      <div class="card">
        <div class="card-header has-text-centered">
          <p
            v-if="anime"
            class="card-header-title"
          >
            {{ anime.title }}
          </p>
        </div>
        <div class="card-content">
          <form @submit.prevent="submit()">
            <fieldset :disabled="uiState.isFormDisabled">
              <div class="columns">
                <div class="column is-10">
                  <div class="field">
                    <label class="label">Título</label>
                    <div class="control has-icons-left">
                      <input
                        v-model="formState.title"
                        type="text"
                        class="input"
                        placeholder="Título"
                        :class="{ 'is-danger': v$.title.$errors.length }"
                      >
                      <div class="icon is-small is-left">
                        <i class="fas fa-heading" />
                      </div>
                      <p
                        v-for="error of v$.title.$errors"
                        :key="error.$uid"
                        class="help is-danger"
                      >
                        {{ error.$message }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="column is-2">
                  <div class="field">
                    <label class="label">Nota</label>
                    <div class="control has-icons-left">
                      <div class="select">
                        <select v-model="formState.rating">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>
                      </div>
                      <div class="icon is-small is-left">
                        <i class="fas fa-star" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="columns">
                <div class="column is-10">
                  <div class="field">
                    <label class="label">Descrição</label>
                    <div class="control">
                      <textarea
                        v-model="formState.description"
                        class="textarea"
                        :class="{ 'is-danger': v$.description.$errors.length }"
                        placeholder="Descrição"
                      />
                      <p
                        v-for="error of v$.description.$errors"
                        :key="error.$uid"
                        class="help is-danger"
                      >
                        {{ error.$message }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="has-text-centered mt-5">
                <button
                  class="button is-primary"
                  :class="{ 'is-loadind': uiState.isLoading }"
                  :disabled="uiState.isBtnDisabled || v$.$errors.length > 0"
                >
                  Avaliar
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Anime, AnimeApi } from '@api/Anime'
import { ReviewApi } from '@api/Review'
import { token } from '@api/token.interface'
import useVuelidate from '@vuelidate/core'
import { helpers, maxLength, required } from '@vuelidate/validators'
import decode from 'jwt-decode'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'CreateReviewPage',
  setup () {
    const toast = useToast()
    const route = useRoute()
    const router = useRouter()
    const formState = reactive({
      anime: route.params.uuid as string,
      title: '',
      description: '',
      rating: 5
    })
    const uiState = reactive({
      isBtnDisabled: false,
      isFormDisabled: false,
      isLoading: false
    })
    const anime = ref<Anime>()

    const rules = {
      title: {
        required: helpers.withMessage('Não deve estar vazio', required),
        maxLength: helpers.withMessage('Deve ter no máximo 60 caracteres', maxLength(60))
      },
      description: {
        required: helpers.withMessage('Não deve estar vazio', required),
        maxLength: helpers.withMessage('Deve ter no máximo 1000 caracteres', maxLength(1000))
      }
    }

    const v$ = useVuelidate(rules, formState, { $autoDirty: true })

    async function findAnime () {
      const animes = await new AnimeApi().find({ uuid: route.params.uuid as string })
      if (!animes[0]) {
        toast.error('Anime não encontrado')
        uiState.isFormDisabled = true
      }

      anime.value = animes[0]
    }

    async function verifyIfUserAlreadyReviewed () {
      const token = localStorage.getItem('token')
      const decoded: token = decode(token as string)

      const reviews = await new ReviewApi().find({
        animeUuid: route.params.uuid as string,
        userUuid: decoded.uuid
      })

      if (reviews[0]) {
        uiState.isFormDisabled = true
        toast.error('Você já avaliou este anime')
      }
    }

    async function submit () {
      v$.value.$touch()
      if (v$.value.$error) return

      try {
        uiState.isBtnDisabled = true
        uiState.isLoading = true

        await new ReviewApi().create(formState)
        await router.push({ path: `/animes/${route.params.uuid as string}` })
      } catch (error) {
        console.log(error)
        const msg = (error as any).response.data.message
        if (msg) {
          toast.error(msg)
        }
      } finally {
        uiState.isBtnDisabled = false
        uiState.isLoading = false
      }
    }

    onBeforeMount(async () => {
      await findAnime()
      await verifyIfUserAlreadyReviewed()
    })

    return { formState, uiState, submit, v$, anime }
  }
})
</script>
