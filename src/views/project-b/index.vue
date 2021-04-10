<template>
  <!-- Project B -->
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: '项目2'
  },
  data() {
    return {
      msg: 'Hello, I will change in 3 seconds'
    }
  },
  mounted() {
    // eg..http request
    setTimeout(() => {
      this.msg = 'I changed.'
    }, 3000)
  }
}
</script>
