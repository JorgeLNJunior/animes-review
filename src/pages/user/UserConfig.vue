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
        <form @submit.prevent="submit()">
          <div class="columns is-centered">
            <div class="column is-6">
              <div class="field">
                <label class="label">Nome</label>
                <div class="control">
                  <input
                    v-model="formState.name"
                    type="text"
                    class="input"
                    :class="{ 'is-danger': v$.name.$errors.length }"
                  >
                  <p
                    v-for="error of v$.name.$errors"
                    :key="error.$uid"
                    class="help is-danger"
                  >
                    {{ error.$message }}
                  </p>
                </div>
              </div>
            </div>
            <div class="column is-6">
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input
                    v-model="state.user.email"
                    type="text"
                    class="input"
                    disabled
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="has-text-centered">
            <button
              class="button is-primary "
              :class="{ 'is-loading': uiState.isLoading }"
              :disabled="uiState.isDisabled || v$.$errors.length > 0"
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
import { UpdateUser, User, UserApi } from '@api/User'
import { hasModifyPermission } from '@helpers/helpers'
import useVuelidate from '@vuelidate/core'
import { helpers, maxLength, required } from '@vuelidate/validators'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'UserConfigPage',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const state = reactive({
      user: {} as User,
      isApiCallEnded: false
    })
    const uiState = reactive({
      isLoading: false,
      isDisabled: false
    })
    const formState = reactive<UpdateUser>({})

    const rules = {
      name: {
        required: helpers.withMessage('Não deve estar vazio', required),
        maxLength: helpers.withMessage('Deve ter no máximo 50 caracteres', maxLength(50))
      }
    }
    const v$ = useVuelidate(rules, formState, { $autoDirty: true })

    async function submit () {
      try {
        v$.value.$touch()
        if (v$.value.$error) return

        uiState.isLoading = true
        uiState.isDisabled = true
        const userApi = new UserApi()
        await userApi.update(state.user.uuid, formState)
        await router.push({ name: 'UserConfig', params: { uuid: state.user.uuid }, query: { status: 'success', message: 'Anime criado com sucesso' } })
      } catch (error) {
        const msg = (error as any).response.data.message
        if (msg) {
          toast.error(msg[0])
        }
        console.log(error)
      } finally {
        uiState.isLoading = false
        uiState.isDisabled = false
      }
    }

    async function findUser () {
      try {
        const user = await new UserApi().find({ uuid: route.params.uuid as string })
        if (!user[0]) {
          await router.push({ path: '/', query: { status: 'error', message: 'Usuário não encontrado' } })
          return
        }

        state.user = user[0]
        state.isApiCallEnded = true
        formState.name = user[0].name
      } catch (error) {
        await router.push({ path: '/', query: { status: 'error', message: 'Ocorreu um erro inesperado' } })
      }
    }

    function formatDate (date: string) {
      return format(new Date(date), "d 'de' LLLL 'de' y", { locale: ptBR })
    }

    onBeforeMount(async () => {
      await findUser()
      if (!hasModifyPermission(state.user.uuid)) {
        await router.push({ path: '/', query: { status: 'error', message: 'Você não tem permissão' } })
      }
    })

    return { state, route, formatDate, submit, v$, uiState, formState }
  }
})
</script>
