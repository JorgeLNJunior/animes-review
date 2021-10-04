<template>
  <div class="columns is-centered mt-5">
    <div class="column is-8">
      <div class="card">
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
                  Atualizar
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
import { ReviewApi } from '@api/Review'
import { hasModifyPermission } from '@helpers/helpers'
import useVuelidate from '@vuelidate/core'
import { helpers, maxLength, required } from '@vuelidate/validators'
import { defineComponent, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
  name: 'UpdateReviewPage',
  setup () {
    const toast = useToast()
    const route = useRoute()
    const router = useRouter()
    const formState = reactive({
      title: '',
      description: '',
      rating: 5
    })
    const uiState = reactive({
      isBtnDisabled: false,
      isFormDisabled: false,
      isLoading: false
    })
    const state = reactive({
      reviewUserUuid: ''
    })

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

    async function findReview () {
      const reviewList = await new ReviewApi().find({ uuid: route.params.uuid as string })
      const review = reviewList[0]
      if (!review) {
        toast.error('Review não encontrado')
        uiState.isFormDisabled = true
      }
      formState.title = review.title
      formState.description = review.description
      formState.rating = review.rating
      state.reviewUserUuid = review.user.uuid
    }

    async function submit () {
      v$.value.$touch()
      if (v$.value.$error) return

      try {
        uiState.isBtnDisabled = true
        uiState.isLoading = true

        await new ReviewApi().update(route.params.uuid as string, formState)
        router.go(-1)
        toast.success('Review atualizado com sucesso')
      } catch (error) {
        console.log(error)
        const msg = (error as any).response.data.message
        if (msg) {
          toast.error(msg[0])
        }
      } finally {
        uiState.isBtnDisabled = false
        uiState.isLoading = false
      }
    }

    function checkPermission () {
      if (!hasModifyPermission(state.reviewUserUuid)) {
        toast.error('Você não tem permissão')
        uiState.isFormDisabled = true
      }
    }

    onBeforeMount(async () => {
      await findReview()
      checkPermission()
    })

    return { formState, uiState, submit, v$ }
  }
})
</script>
