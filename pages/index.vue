<template>
  <div></div>
</template>

<script>
export default {
  middleware({ redirect }) {
    redirect('/login')
  }
}
</script>
