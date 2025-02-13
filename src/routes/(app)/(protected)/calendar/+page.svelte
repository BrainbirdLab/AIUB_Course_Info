<script lang="ts">
    import { calendarData } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let loaded = $state(false);

    let titleText: string = $state("");

    let tbl: HTMLTableElement = $state() as HTMLTableElement;

    onMount(() => {
        tbl = document.createElement("table");

        loaded = true;

        titleText = calendarData.value.title;
        tbl.innerHTML = calendarData.value.table;
    });
</script>

{#if loaded}
    {#if !calendarData.value.table}
        <div class="empty">
            No data avaliable
        </div>
    {/if}
    <div class="content" in:fly={{ y: 10 }}>
        <div class="title" in:fly={{ x: 5, delay: 100 }}>
            {titleText}
        </div>
        <table in:fly={{ y: 10, delay: 150 }}>
            {@html tbl.innerHTML}
        </table>
    </div>
{/if}

<style lang="scss">
    .content {
        padding: 10px;
        .title {
            font-size: 1.2rem;
            padding: 0 0 10px 0;
        }
    }
</style>
