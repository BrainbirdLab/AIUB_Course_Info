<script lang="ts">
    import { goto } from "$app/navigation";
    import { showLogin } from "$lib/store";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    let loaded = false;

    let titleText: string = "";

    let tbl: HTMLTableElement;

    fetch('/api/calendar').then(async (res) => {
        try {
            const text = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const table = doc.querySelector("table");
            // title -> article h1 [ex: ACADEMIC CALENDAR  2024-2025]
            // article h2 -> article h2 [ex: Fall 2024-25]
            // table tbody tr -> each tr has 3 td [month, day, blank], [data, data, data], [data, data, data]
    
            const title = doc.querySelector("article h1");
            const h2 = doc.querySelector("article h2");
    
            console.log(title?.textContent);
            console.log(h2?.textContent);
    
            if (!title || !h2 || !table) {
                return;
            }
    
            titleText = title.textContent + " " + h2.textContent;
    
            tbl.innerHTML = table.innerHTML;
    
            //store in localstorage
            localStorage.setItem("calendar", JSON.stringify({
                title: titleText,
                table: table.innerHTML
            }));
        } catch (e) {
            console.log("failed to get calendar data");
            //use localstorage data if available
            const data = localStorage.getItem("calendar");
            if (data) {
                const { title, table } = JSON.parse(data);
                titleText = title;
                tbl.innerHTML = table;
            }
        }
    });

    onMount(() => {
        if ($showLogin){
            goto("/login");
        }
        loaded = true;
    });
    
</script>

{#if loaded}
{#if !titleText}
<div class="content" in:fly={{y: 10}}>
    <div class="mid">
        Getting latest data...
    </div>
</div>
{/if}
<div class="content" in:fly={{y: 10}}>
    <div class="title" in:fly={{x: 5, delay: 100}}>
        {titleText}
    </div>
    <table bind:this={tbl} in:fly={{y: 10, delay: 150}}></table>
</div>
{/if}

<style lang="scss">
    .content{
        padding: 10px;
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