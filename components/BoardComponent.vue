<template>
  <div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from '@nuxtjs/composition-api'
import { TodoKey } from '~/composition/compositionKey'
import { TodoStore } from '~/composition/useTodo'

export default defineComponent({
  setup() {
    const { created } = inject(TodoKey) as TodoStore
    return { created }
  },
})
</script>
