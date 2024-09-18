<script lang="ts">
    import { fly } from "svelte/transition";
    import { updateLog, updateStatus } from "$lib/store";
</script>

<div class="log">
	{#if $updateStatus == "loading" || $updateStatus == "success"}
		<div class="content" transition:fly={{ y: 10 }}>
			{$updateLog}
			{#if $updateStatus == "success"}
				<i class="fa-solid fa-check"></i>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
    .log {
		font-size: 0.7rem;
		color: var(--accent);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 3px;
		height: 10px;
		min-height: 10px;
		i {
			font-size: inherit;
		}
	}
</style>