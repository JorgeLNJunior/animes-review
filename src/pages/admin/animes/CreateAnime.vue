<template>
  <div>
    <AdminNavBar />
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
              <div class="column is-three-quarters">
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
              <div class="column">
                <div class="field">
                  <label class="label">Epiódios</label>
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
              <div class="column is-three-quarters">
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
              <div class="column">
                <div
                  class="file is-boxed is-small is-centered mt-4"
                  :class="{ 'is-danger': false}"
                >
                  <label
                    class="file-label"
                  >
                    <input
                      type="file"
                      class="file-input"
                    >
                    <span class="file-cta">
                      <span class="file-icon">
                        <i class="fas fa-upload" />
                      </span>
                      <span class="file-label">
                        Selecione a capa…
                      </span>
                    </span>
                  </label>
                  <!-- <p
                    v-for="error of v$.trailer.$errors"
                    :key="error.$uid"
                    class="help is-danger"
                  >
                    {{ error.$message }}
                  </p> -->
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
                :class="{ 'is-loading': uiState.isLoading }"
                :disabled="uiState.isDisabled || v$.$errors.length"
              >
                Criar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AnimeApi, UpdateAnime } from '@api/Anime'
import AdminNavBar from '@components/bar/AdminNavBar.vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, integer, maxLength, minValue, required } from '@vuelidate/validators'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'UpdateAnime',
  components: { AdminNavBar },
  setup () {
    const router = useRouter()
    const toast = useToast()
    const animeApi = new AnimeApi()
    const uiState = reactive({
      isLoading: false,
      isDisabled: false
    })
    const formState = reactive<UpdateAnime>({})

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

        uiState.isLoading = true
        uiState.isDisabled = true
        await animeApi.create(formState)
        await router.push({ path: '/admin', query: { status: 'success', message: 'Anime criado com sucesso' } })
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

    return { uiState, formState, submit, v$ }
  }
})
</script>
