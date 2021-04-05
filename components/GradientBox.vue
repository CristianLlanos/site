<template>
  <div class="bg-gradient-primary p-2 rounded">
    <div class="bg-gradient-dark px-20 py-20 grid gap-15 rounded">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradientBox',
}
</script>
