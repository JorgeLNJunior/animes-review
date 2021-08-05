<template>
  <div class="columns is-centered">
    <div class="column is-four-fifths">
      <div class="has-text-centered my-3">
        <span class="is-size-3 has-text-weight-medium">Novo</span>
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
                  >
                    Selecionar
                  </button>
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
          <div class="columns is-centered">
            <div class="column has-text-centered">
              <div
                class="file is-boxed is-small is-centered mt-4"
                :class="{ 'is-danger': false}"
              >
                <label
                  class="file-label"
                >
                  <input
                    ref="file"
                    type="file"
                    class="file-input"
                    accept="image/png, image/jpeg, image/jpeg"
                    @change="fileSelected()"
                  >
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload" />
                    </span>
                    <span class="file-label">
                      Selecione a capa…
                    </span>
                  </span>
                  <span
                    v-if="uiState.fileName"
                    class="file-name"
                  >
                    {{ uiState.fileName }}
                  </span>
                  <p
                    v-if="uiState.isFileError"
                    class="help is-danger"
                  >
                    {{ uiState.fileErrorMsg }}
                  </p>
                </label>
              </div>
            </div>
          </div>
          <div class="has-text-centered">
            <button
              class="button is-primary "
              :class="{ 'is-loading': uiState.isLoading }"
              :disabled="uiState.isDisabled || v$.$errors.length || uiState.isFileError"
            >
              Criar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AnimeApi, UpdateAnime } from '@api/Anime'
import { useVuelidate } from '@vuelidate/core'
import { helpers, integer, maxLength, minValue, required } from '@vuelidate/validators'
import bulmaCalendar from 'bulma-calendar'
import { format } from 'date-fns'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'UpdateAnime',
  setup () {
    const router = useRouter()
    const toast = useToast()
    const animeApi = new AnimeApi()
    const uiState = reactive({
      isLoading: false,
      isDisabled: false,
      isFileError: false,
      fileErrorMsg: '',
      fileName: undefined
    })
    const formState = reactive<UpdateAnime>({})
    const file = ref()
    const calendarTrigger = ref()
    let date = new Date()

    onMounted(() => {
      formState.releaseDate = format(date, 'yyy-MM-dd')
      const calendar = bulmaCalendar.attach(calendarTrigger.value, {
        type: 'date',
        startDate: date,
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
    })

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

    async function submit () {
      try {
        v$.value.$touch()
        if (v$.value.$error) return

        if (!file.value.files[0]) {
          uiState.isFileError = true
          uiState.fileErrorMsg = 'Campo obrigatório'
          return
        }

        uiState.isLoading = true
        uiState.isDisabled = true
        const { uuid } = await animeApi.create(formState)
        await animeApi.upload(uuid, file.value.files[0])
        await router.push({ path: '/admin/animes', query: { status: 'success', message: 'Anime criado com sucesso' } })
      } catch (error) {
        if (error.response.data.message) {
          toast.error(error.response.data.message[0])
        }
        console.log(error)
      } finally {
        uiState.isLoading = false
        uiState.isDisabled = false
      }
    }

    function fileSelected () {
      uiState.isFileError = false
      uiState.fileErrorMsg = ''
      uiState.fileName = file.value.files[0].name
    }

    return { uiState, formState, submit, v$, file, fileSelected, calendarTrigger }
  }
})
</script>
