<script lang="ts">
    import { PUBLIC_API_SERVER_URL } from "$env/static/public";
    import { onMount } from "svelte";

    let aiubPortal = $state() as Promise<Response>;
    let system = $state() as Promise<Response>;
    let noticeSystem = $state() as Promise<Response>;

    onMount(() => {
        ready = true;
        aiubPortal = fetch("/fetch?url=https://portal.aiub.edu");
        system = fetch(`${PUBLIC_API_SERVER_URL}`);
        noticeSystem = fetch(`${PUBLIC_API_SERVER_URL}/notices`);
    });

    let ready = $state(false);

</script>

{#if ready}
<div class="container">
    <ul>
        <li>
        AIUB Portal: 
        {#await aiubPortal}
            <i class="fas fa-spinner fa-spin"></i>
        {:then res}
            {#if res.ok}
                <i class="fas fa-check ok"></i>
            {:else}
                <i class="fas fa-times error"></i>
            {/if}
        {:catch _}
            <i class="fas fa-times error"></i>
        {/await}
        </li>
        <li>
        System: 
        {#await system}
            <i class="fas fa-spinner fa-spin"></i>
        {:then res}
            {#if res.ok}
                <i class="fas fa-check ok"></i>
            {:else}
                <i class="fas fa-times error"></i>
            {/if}
        {:catch _}
            <i class="fas fa-times error"></i>
        {/await}
        </li>
        <li>
        Notice System: 
        {#await noticeSystem}
            <i class="fas fa-spinner fa-spin"></i>
        {:then res}
            {#if res.ok}
                <i class="fas fa-check ok"></i>
            {:else}
                <i class="fas fa-times error"></i>
            {/if}
        {:catch _}
            <i class="fas fa-times error"></i>
        {/await}
    </ul>
    <a href="/">
        Back to Home
    </a>
</div>
{/if}

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        gap: 50px;
    }

    li {
        font-size: 0.9rem;
    }

    .fa-check {
        color: rgb(43, 237, 43);
    }

    .fa-times {
        color: red;
    }

    a {
        color: var(--accent);
        font-size: 0.9rem;
    }
</style>