<script lang="ts">
    import { goto } from "$app/navigation";
    import { showLogin, calendarData, calenderFetching } from "$lib/store";
    import { onMount } from "svelte";
    import { fly, slide } from "svelte/transition";

    let loaded = false;

    let titleText: string = "";

    let tbl: HTMLTableElement;

    onMount(() => {

        if ($showLogin) {
            goto("/login");
        }

        tbl = document.createElement("table");

        loaded = true;

        titleText = $calendarData.title;
        tbl.innerHTML = $calendarData.table;
    });
</script>

{#if loaded}
    {#if $calenderFetching}
        <div class="content" transition:slide={{ axis: "y" }}>
            <div class="mid">
                Getting data...
            </div>
        </div>
    {/if}
    {#if !$calendarData.table}
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
