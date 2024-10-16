<script lang="ts">
	import {
    showLogin,
	} from "$lib/store";
	import Routine from "./Routine.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

	onMount(() => {
		if ($showLogin){
			goto("/login");
		}
	});

</script>

{#if !$showLogin}

<Routine />

{/if}
