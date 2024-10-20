<script lang="ts">

    import "$lib/styles/global.scss";

    import { pageLoaded } from "$lib/store";
    import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import Logo from "$lib/components/Logo.svelte";

    onMount(() => {
        pageLoaded.set(true);
    });

</script>

<svelte:body on:contextmenu|preventDefault />

{#if !$pageLoaded}
	<div class="preload" in:fade out:fly={{ y: 10 }}>
		<Logo />
	</div>
{:else}
    <div class="container">
        <slot></slot>
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
