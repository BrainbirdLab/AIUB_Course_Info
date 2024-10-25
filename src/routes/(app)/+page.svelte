<script lang="ts">
	import {
    showLogin,
	} from "$lib/store.svelte";
	import Routine from "./Routine.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

	onMount(() => {
		if (showLogin.value){
			goto("/login");
		}
	});

</script>

{#if !showLogin.value}

<Routine />

{/if}
