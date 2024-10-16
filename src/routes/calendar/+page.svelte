<script lang="ts">
    import { goto } from "$app/navigation";
    import { getCalendarData } from "$lib/fetcher";
    import { showLogin } from "$lib/store";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let loaded = false;

    let titleText: string = "";

    let tbl: HTMLTableElement;

    let state = "Loading...";

    try {
        // if offline, use localstorage data
        if (window.navigator?.onLine === false) {
            throw new Error("offline");
        }

        getCalendarData().then((data) => {
            if (!data || !data.title || !data.table) {
                throw new Error("No data");
            }
            titleText = data.title;
            tbl.innerHTML = data.table;
            state = "";
        });

    } catch (e) {
        if (window.navigator?.onLine === false) {
            state = "You are Offline. Please connect to the internet to get the latest data";
        } else {
            state = "Failed to get data. Please try again later.";
        }
    }

    onMount(() => {
        if ($showLogin) {
            goto("/login");
        }
        loaded = true;
    });
</script>

{#if loaded}
    {#if !titleText}
        <div class="content" in:fly={{ y: 10 }}>
            <div class="mid">
                {state}
            </div>
        </div>
    {/if}
    <div class="content" in:fly={{ y: 10 }}>
        <div class="title" in:fly={{ x: 5, delay: 100 }}>
            {titleText}
        </div>
        <table bind:this={tbl} in:fly={{ y: 10, delay: 150 }}></table>
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
    .mid {
        font-size: 0.7rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent);
    }
</style>
