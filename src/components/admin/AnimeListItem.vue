<template>
  <tr>
    <td>{{ anime.title }}</td>
    <td><abbr :title="anime.synopsis">{{ anime.synopsis.slice(0, 50) }}...</abbr></td>
    <td>
      <button
        class="button is-info is-outlined"
        @click="ui.openYoutubeModal(String(anime.trailer.split('v=').pop()))"
      >
        Ver
      </button>
    </td>
    <td>{{ anime.episodes }}</td>
    <td>
      <button class="button is-info">
        Editar
      </button>
    </td>
    <td>
      <button class="button is-danger">
        Excluir
      </button>
    </td>
  </tr>
</template>

<script lang="ts">
import { Anime } from '@api/Anime'
import { useUiStore } from '@store/ui.store'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'AnimeListItem',
  props: {
    anime: {
      type: Object as PropType<Anime>,
      required: true
    }
  },
  setup () {
    const ui = useUiStore()

    return { ui }
  }
})
</script>

<style scoped>
abbr[title] {
  border-bottom: none;
  text-decoration: none;
}

tr :hover {
  cursor: pointer;
}
</style>
