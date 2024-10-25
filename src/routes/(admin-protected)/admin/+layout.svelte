<script lang="ts">

    import "$lib/styles/global.scss";

    import { pageLoaded } from "$lib/store.svelte";
    import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import Logo from "$lib/components/Logo.svelte";

	let { children } = $props();

    onMount(() => {
        pageLoaded.value = true;
    });

</script>

<svelte:body oncontextmenu={(e) => e.preventDefault()} />

{#if !pageLoaded.value}
	<div class="preload" in:fade out:fly={{ y: 10 }}>
		<Logo />
	</div>
{:else}
    <div class="container">
		{@render children()}
    </div>
{/if}

<style lang="scss">
	.preload {
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		inset: 0;
		font-size: 0.8rem;
		color: var(--accent);
		gap: 10px;
		z-index: 100;
	}

    .container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		min-height: 100%;
		margin: auto;
	}
</style>
