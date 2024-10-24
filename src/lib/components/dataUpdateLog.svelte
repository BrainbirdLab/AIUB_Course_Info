<script lang="ts">
    import { slide } from "svelte/transition";
    import { updateLog, updateStatus } from "$lib/store";
</script>

{#if $updateStatus == "loading" || $updateStatus == "success"}
	<div class="update-log" transition:slide={{ axis: "y" }}>
		<div class="mid">
			{$updateLog}
		</div>
		{#if $updateStatus == "success"}
			<i class="fa-solid fa-check"></i>
		{/if}
	</div>
{/if}