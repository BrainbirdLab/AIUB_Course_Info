<script lang="ts">

    import { allNotices, isOffline, isSubscribed, isSubUnsubRunning, subPermissionDenied } from "$lib/store";
    import { onMount } from "svelte";
    import { fly, slide } from "svelte/transition";
    import { fetchNoticesFromDB, parseNotices, subscribeToNotice, unsubscribeFromNotice } from "./fetcher";
    import { flip } from "svelte/animate";

    let fetching = false;
    let loadingText = "Fetching new notices...";

    onMount(() => {
        subPermissionDenied.set(Notification.permission === "denied");
        try {
            try {
                const notices = JSON.parse(localStorage.getItem("notices") || "[]") as string[];
                parseNotices(notices);
            } catch (error) {
                parseNotices([]);
                localStorage.removeItem("notices");
            }
        } catch (error) {
            console.error(error);
            fetching = false;
        }
    });

    async function getNotices() {
        fetching = true;
        loadingText = "Fetching new notices...";
        fetchNoticesFromDB().then(() => {
            fetching = false;
            loadingText = "New notices fetched";
        }).catch((e) => {
            loadingText = "Error fetching notices";
            setTimeout(() => {
                fetching = false;
            }, 2000);
        });
    }

    async function subStatus() {
        isSubUnsubRunning.set(true);
        if (Notification.permission === "granted" && $isSubscribed) {
            await unsubscribeFromNotice(navigator.serviceWorker.controller);
        } else {
            await subscribeToNotice(navigator.serviceWorker.controller);
        }
    }
</script>


<div class="container" in:fly|global={{x: 10}}>
    <div class="btn">
        <button class="permission button {$isSubscribed ? "unsubscribe" : ""}" disabled={$isOffline || $isSubUnsubRunning || $subPermissionDenied} on:click={subStatus}>
            {#if $subPermissionDenied}
                <i class="fa-solid fa-bell-slash"></i> Permission denied
            {:else}
                {#if Notification.permission === "granted" && $isSubscribed}
                    <i class="fa-solid fa-bell-slash"></i> Unsubscribe
                {:else}
                    <i class="fa-solid fa-bell"></i> Subscribe
                {/if}
            {/if}
        </button>
        <button class="refresh button" disabled={$isOffline || fetching} on:click={getNotices}>
            <i class="fa-solid fa-retweet"></i> Refresh
        </button>
    </div>
    {#if fetching}
        <div class="loading" transition:slide={{axis:"y", duration: 100}} class:error={loadingText == "Error fetching notices" ? true : false}>{loadingText}</div>
    {/if}
    {#if $allNotices && $allNotices.length > 0}
        <div class="notices">          
            {#key $allNotices}
            {#each $allNotices as notice, i (notice)}
                <div class="notice" animate:flip in:fly|global={{y: 5, delay: (i+1)*100}}>
                    <div class="date">
                        {notice.date}
                    </div>
                    <div class="text">
                        {notice.notice}
                    </div>
                </div>
            {/each}
            {/key}
        </div>
    {:else}
        <div class="empty" in:fly|global={{y: 5}}>No notices available</div>
    {/if}
</div>

<style lang="scss">

    .empty {
        font-size: 0.8rem;
        color: var(--label-color);
        padding-top: 50%;
    }

    button {
        padding: 6px 10px;
        border-radius: 16px;
        border: none;
        cursor: pointer;
        font-size: 0.8rem;
        color: white;
        &:disabled{
            filter: brightness(0.7);
            cursor: not-allowed;
        }
    }

    .btn {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 10px;
    }

    .refresh {
        background: var(--accent);
    }

    .permission {
        background: #2196F3;
        &.unsubscribe {
            background: #384350;
        }
    }


    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 10px;
        width: min(100%, 800px);
        max-width: 100%;
        height: 100%;
        min-height: 400px;
        max-height: 100%;
    }

    .notices {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        overflow-y: scroll;
        scroll-padding: 10px;
    }

    .notice {
        padding: 8px;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        display: flex;
        width: 100%;
        background-color: var(--light-dark);
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
    }

    .date {
        font-size: 0.8rem;
        background: var(--accent-dim);
        padding: 20px 10px;
        min-width: 64px;
        min-height: 64px;
        border-radius: 4px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading {
        font-size: 0.8rem;
        color: var(--accent);
        padding-bottom: 10px;
        &.error {
            color: rgb(209, 98, 70);
        }
    }
</style>