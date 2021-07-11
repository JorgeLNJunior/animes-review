<template>
  <tr
    v-for="index in 3"
    :key="index"
  >
    <td
      v-for="i in 6"
      :key="i"
      class="loading"
    >
      <div class="bar" />
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AnimeListCardSkeleton'
})
</script>

<style lang="scss">
@keyframes loading {
  40% {
    background-position: 100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

.loading {
  position: relative;

  .bar {
    background-color: #e7e7e7;
    height: 18px;
    border-radius: 7px;
    width: 80%;
    margin: 6px 0;
  }

  &:after {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    left: 0;
    content: "";
    display: block;
    width: 100%;
    height: 24px;
    background-image: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0) 80%
    );
    background-size: 200px 24px;
    background-position: -100px 0;
    background-repeat: no-repeat;
    animation: loading 1s infinite;
  }
}
</style>
