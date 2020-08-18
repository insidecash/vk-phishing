<style>
  .layout {
    width: 100%;
    height: 100vh;
    background-color: #3f5d81 !important;
    overflow: hidden;
    margin: 0px;
    position: fixed;
    top: 0;
  }

  a {
    height: 530px;
    width: 690px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -265px -345px 0px;
  }

  img {
    height: 100%;
    width: 100%;
  }
</style>

<script>
  export let status;
  export let error;

  console.log(error);
</script>

<svelte:head>
  <title>{status} | {error.message}</title>
</svelte:head>
<div class="layout">
  <a href="/" rel="preload">
    <img src="/phishing__/error404.png" alt="404 not found" />
  </a>
</div>
