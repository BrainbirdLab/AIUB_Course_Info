<script lang="ts">

	import Routine from "$lib/components/Routine.svelte";
    import { onMount } from "svelte";

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});

</script>

{#if loaded}
	<Routine />
{/if}