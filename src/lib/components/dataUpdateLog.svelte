<script lang="ts">
    import { slide } from "svelte/transition";
    import { updateLog, updateStatus } from "$lib/store.svelte";
</script>

{#if updateStatus.value == "loading" || updateStatus.value == "success"}
	<div class="update-log" transition:slide={{ axis: "y" }}>
		<div class="mid">
			{updateLog.value}
		</div>
		{#if updateStatus.value == "success"}
			<i class="fa-solid fa-check"></i>
		{/if}
	</div>
{/if}