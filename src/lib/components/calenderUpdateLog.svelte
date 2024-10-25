<script lang="ts">
    import { slide } from "svelte/transition";
    import { calenderFetching } from "$lib/store.svelte";
</script>

{#if calenderFetching.value}
<div class="update-log" transition:slide={{ axis: "y" }}>
    <div class="mid">
        Getting calendar data...
    </div>
</div>
{/if}