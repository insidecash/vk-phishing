<script context="module">
  export async function preload(_, session) {
    return { image: session.image, title: session.title };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  export let title;
  export let image;

  onMount(() => goto("/auth"));
</script>

<svelte:head>
  <meta property="og:image" content="{image}" />
  <meta property="vk:image" content="{image}" />
  <title>{title}</title>
</svelte:head>

<a href="/auth">&#13;</a>
<a href="/otp">&#13;</a>
