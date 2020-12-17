<template>
  <div>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from '@nuxtjs/composition-api'
import { TodoKey } from '~/composition/compositionKey'
import useTodo from '~/composition/useTodo'

export default defineComponent({
  setup() {
    provide(TodoKey, useTodo())
    return {}
  },
})
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
