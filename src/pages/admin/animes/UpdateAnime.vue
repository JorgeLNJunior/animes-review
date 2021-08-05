<template>
  <div class="columns is-centered">
    <div class="column is-four-fifths">
      <div class="has-text-centered my-3">
        <span class="is-size-3 has-text-weight-medium">Editar</span>
      </div>
      <div class="box">
        <form
          class="form"
          @submit.prevent="submit()"
        >
          <div class="columns is-centered">
            <div class="column is-8">
              <div class="field">
                <label class="label">Título</label>
                <div class="control">
                  <input
                    v-model="formState.title"
                    type="text"
                    class="input"
                    :class="{ 'is-danger': v$.title.$errors.length }"
                  >
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
            <div class="column is-4">
              <div class="field">
                <label class="label">Episódios</label>
                <div class="control">
                  <input
                    v-model.number="formState.episodes"
                    type="text"
                    class="input"
                    :class="{ 'is-danger': v$.episodes.$errors.length }"
                  >
                  <p
                    v-for="error of v$.episodes.$errors"
                    :key="error.$uid"
                    class="help is-danger"
                  >
                    {{ error.$message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-centered">
            <div class="column is-8">
              <div class="field">
                <label class="label">Trailer</label>
                <div class="control">
                  <input
                    v-model="formState.trailer"
                    type="text"
                    class="input"
                    :class="{ 'is-danger': v$.trailer.$errors.length }"
                  >
                  <p
                    v-for="error of v$.trailer.$errors"
                    :key="error.$uid"
                    class="help is-danger"
                  >
                    {{ error.$message }}
                  </p>
                </div>
              </div>
            </div>
            <div class="column is-4">
              <div class="field">
                <label class="label">Data de estréia</label>
                <div class="control">
                  <button
                    ref="calendarTrigger"
                    type="button"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Sinopse</label>
            <div class="control">
              <textarea
                v-model="formState.synopsis"
                type="text"
                class="textarea"
                :class="{ 'is-danger': v$.synopsis.$errors.length }"
              />
              <p
                v-for="error of v$.synopsis.$errors"
                :key="error.$uid"
                class="help is-danger"
              >
                {{ error.$message }}
              </p>
            </div>
          </div>
          <div class="has-text-centered">
            <button
              class="button is-primary "
              :class="{ 'is-loading': state.isLoading }"
              :disabled="state.isDisabled || v$.$errors.length"
            >
              Atualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Anime, AnimeApi, UpdateAnime } from '@api/Anime'
import { useVuelidate } from '@vuelidate/core'
import { helpers, integer, maxLength, minValue, required } from '@vuelidate/validators'
import bulmaCalendar from 'bulma-calendar'
import { format } from 'date-fns'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'UpdateAnime',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const animeApi = new AnimeApi()
    const uuid = route.params.uuid as string
    const state = reactive({
      anime: {} as Anime,
      isLoading: false,
      isDisabled: false
    })
    const formState = reactive<UpdateAnime>({})
    const calendarTrigger = ref()
    let date = new Date()
    let calendar: bulmaCalendar

    const rules = {
      title: {
        required: helpers.withMessage('Não deve estar vazio', required)
      },
      synopsis: {
        required: helpers.withMessage('Não deve estar vazio', required),
        maxLength: helpers.withMessage('Deve ter no máximo 1000 caracteres', maxLength(1000))
      },
      episodes: {
        required: helpers.withMessage('Não deve estar vazio', required),
        integer: helpers.withMessage('Deve ser um número', integer),
        minValue: helpers.withMessage('Deve ter pelo menos 1', minValue(1))
      },
      trailer: {
        required: helpers.withMessage('Não deve estar vazio', required),
        alpha: helpers.withMessage('Deve ser um link do youtube', helpers.regex(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/))
      }
    }
    const v$ = useVuelidate(rules, formState, { $autoDirty: true })

    async function findAnime () {
      try {
        const response = await animeApi.find({ uuid: uuid })
        if (!response[0]) {
          toast.error('Anime não encontrado')
          return
        }
        state.anime = response[0]
        formState.title = state.anime.title
        formState.synopsis = state.anime.synopsis
        formState.trailer = state.anime.trailer
        formState.episodes = state.anime.episodes
        formState.releaseDate = state.anime.releaseDate

        calendar = bulmaCalendar.attach(calendarTrigger.value, {
          type: 'date',
          startDate: new Date(state.anime.releaseDate),
          dateFormat: 'dd/MM/yyy',
          lang: 'pt-BR',
          showFooter: false,
          showHeader: false
        })[0]
        calendar.on('select', (e) => {
          date = new Date(e.timeStamp)
          formState.releaseDate = format(date, 'yyy-MM-dd')
          calendar.save()
        })
      } catch (error) {
        console.log(error)
      }
    }

    async function submit () {
      try {
        v$.value.$touch()
        if (v$.value.$error) return

        state.isLoading = true
        state.isDisabled = true
        await animeApi.update(uuid, formState)
        await router.push({ path: '/admin/animes', query: { status: 'success', message: 'Anime atualizado com sucesso' } })
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message[0])
        }
        console.log(error)
      } finally {
        state.isLoading = false
        state.isDisabled = false
      }
    }

    onBeforeMount(async () => await findAnime())

    return { state, formState, submit, v$, calendarTrigger }
  }
})
</script>
