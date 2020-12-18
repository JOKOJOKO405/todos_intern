<template>
  <div class="options">
    <select v-model.number="state.sort">
      <option selected>ソート</option>
      <option value="1">作成日↑↑↑</option>
      <option value="2">作成日↓↓↓</option>
    </select>
    <input v-model="state.searchText" type="text" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import useTodo from '~/composition/useTodo'

export default defineComponent({
  setup() {
    const { state } = useTodo()

    return {
      state,
    }
  },
})
</script>

<style lang="scss">
.options {
  margin-bottom: 40px;
}
</style>
