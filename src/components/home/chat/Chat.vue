<template>
  <div class="card">
    <div class="card-content">
      <div
        ref="messagesContainer"
        class="messages-container"
      >
        <span v-if="state.messageList.length <= 0">Nada por aqui...</span>
        <article
          v-for="(msg, index) of state.messageList"
          :key="index"
          class="media animate__animated animate__slideInLeft animate__faster"
        >
          <figure class="media-left">
            <p class="image is-24x24">
              <img
                class="is-rounded"
                :src="msg.avatar"
              >
            </p>
          </figure>
          <div>
            <router-link
              :to="`/users/${msg.userUuid}`"
              target="_blank"
              style="text-decoration: none; color: inherit;"
            >
              <span class="has-text-black">@{{ msg.username }}: </span>
            </router-link>
            <span class="line-break">{{ msg.message }}</span>
          </div>
        </article>
      </div>
      <div>
        <div class="field my-4">
          <div class="control">
            <input
              ref="messageInput"
              v-model="state.message"
              class="input"
              placeholder="Mensagem"
              @keypress.enter="send()"
            >
          </div>
        </div>
        <button
          class="button is-primary"
          @click="send()"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { token } from '@api/token.interface'
import { User, UserApi } from '@api/User'
import jwtDecode from 'jwt-decode'
import { io } from 'socket.io-client'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'

import { ChatMessage } from './interface/chatMessage.interface'

export default defineComponent({
  name: 'Chat',
  setup () {
    const token = localStorage.getItem('token')
    const decoded: token = jwtDecode(token as string)
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      query: {
        auth: token as string
      }
    })
    const state = reactive({
      message: '',
      user: {} as User,
      messageList: [] as ChatMessage[]
    })
    const messagesContainer = ref()
    const messageInput = ref()

    socket.on('chat', (msg: ChatMessage) => {
      state.messageList.push(msg)
      setTimeout(() => { // await to DOM update and scroll
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }, 50)
    })

    socket.on('exception', (error) => {
      console.log(error)
    })

    socket.on('error', (error) => {
      console.log(error)
    })

    onBeforeMount(async () => await getUser())

    function send () {
      if (state.message.length <= 0) return

      socket.emit('chat', {
        userUuid: state.user.uuid,
        avatar: state.user.avatar,
        username: state.user.name,
        message: state.message
      } as ChatMessage)

      state.message = ''

      if (state.messageList.length > 40) {
        state.messageList.shift()
      }

      messageInput.value.focus()
      messageInput.value.select()
    }

    async function getUser () {
      const userList = await new UserApi().find({ uuid: decoded.uuid })
      state.user = userList[0]
    }

    return { state, messagesContainer, messageInput, send }
  }
})
</script>

<style scoped>
.messages-container {
  min-height: 200px;
  max-height: 200px;
  overflow-y: auto;
}
.line-break {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>
