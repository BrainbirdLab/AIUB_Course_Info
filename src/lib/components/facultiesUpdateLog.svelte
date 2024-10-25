<script lang="ts">
    import { slide } from "svelte/transition";
    import { facultiesIsFetching } from "$lib/store.svelte";
</script>

{#if facultiesIsFetching.value}
<div class="update-log" transition:slide={{ axis: "y" }}>
    <div class="mid">Getting faculty data...</div>
</div>
{/if}