<script lang="ts">

    import { allNotices, isOffline, isSubscribed, isSubUnsubRunning, subPermissionDenied } from "$lib/store";
    import { onMount } from "svelte";
    import { fly, slide } from "svelte/transition";
    import { checkSubscription, fetchNoticesFromDB, parseNotices, subscribeToNotice, unsubscribeFromNotice } from "../lib/fetcher";
    import { flip } from "svelte/animate";
    import { deleteFromDB } from "$lib/db";

    let fetching = false;
    let loadingText = "Fetching new notices...";

    onMount(() => {
        subPermissionDenied.set(Notification.permission === "denied");
        try {
            // check subscription status
            checkSubscription(navigator.serviceWorker.controller);
        } catch (error) {
            console.error(error);
            fetching = false;
        }
    });

    function getNotices() {
        fetching = true;
        loadingText = "Fetching new notices...";
        fetchNoticesFromDB().then((notices) => {
            fetching = false;
            loadingText = "";
            if (notices !== null && notices instanceof Array && notices.length > 0) {
                parseNotices(notices);
            }
        }).catch((e) => {
            loadingText = "Error fetching notices";
            setTimeout(() => {
                fetching = false;
            }, 2000);
        });
    }

    async function subStatus() {
        if ($isSubscribed) {
            await unsubscribeFromNotice(navigator.serviceWorker.controller);
        } else {
            //ask for permission
            Notification.requestPermission().then(async (permission) => {
                if (permission === "granted") {
                    await subscribeToNotice(navigator.serviceWorker.controller);
                }
            });
        }
    }
</script>


<div class="container" in:fly|global={{x: 10}}>
    <div class="btn">
        <button class="permission button {$isSubscribed && !$subPermissionDenied ? "unsubscribe" : ""}" disabled={$isOffline || $isSubUnsubRunning || $subPermissionDenied} on:click={subStatus}>
            {#if $subPermissionDenied}
                <i class="fa-solid fa-bell-slash"></i> Denied
            {:else}
                {#if Notification.permission === "granted" && $isSubscribed}
                    <i class="fa-solid fa-bell-slash"></i> {#if $isSubUnsubRunning} Unsubscribing... {:else} Unsubscribe {/if}
                {:else}
                    <i class="fa-solid fa-bell"></i> {#if $isSubUnsubRunning} Subscribing... {:else} Subscribe {/if}
                {/if}
            {/if}
        </button>
        <button class="refresh button" disabled={$isOffline || fetching} on:click={getNotices}>
            <i class="fa-solid fa-retweet"></i> Refresh
        </button>
        <button class="clear button" on:click={() => {
            deleteFromDB("notices", "aiub");
            parseNotices([]);
        }}>
            <i class="fa-solid fa-trash"></i> Clear
        </button>
        <a href="https://www.aiub.edu" target="_blank" class="button" class:disabled={$isOffline}>
            <i class="fa-solid fa-globe"></i>
            <div class="txt">
                AIUB
                <i class="fa-solid fa-external-link"></i>
            </div>
        </a>
    </div>
    {#if fetching}
        <div class="loading" transition:slide={{axis:"y", duration: 100}} class:error={loadingText == "Error fetching notices" ? true : false}>{loadingText}</div>
    {/if}
    {#if $allNotices && $allNotices.length > 0}
        <div class="notices">          
            {#each $allNotices as notice, i (notice.notice)}
                <div class="notice" animate:flip in:fly|global={{y: 5, delay: (i+1)*100}}>
                    <div class="date">
                        {notice.date}
                    </div>
                    {#if notice.link}
                    <a class="text" href="{notice.link}" target="_blank">
                        {notice.notice} <i class="fa-solid fa-external-link"></i>
                    </a>
                    {:else}
                    <div class="text">
                        {notice.notice}
                    </div>
                    {/if}
                </div>
            {/each}
        </div>
    {:else}
        <div class="empty" in:fly|global={{y: 5}}>No notices available</div>
    {/if}
</div>

<style lang="scss">

    .empty {
        font-size: 0.8rem;
        color: var(--label-color);
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    a {
        text-decoration: none;
        color: var(--label-color);
        .txt {
            text-decoration: underline;
        }
    }

    a.disabled {
        filter: brightness(0.7);
        cursor: not-allowed;
    }

    .button {
        padding: 6px 10px;
        border-radius: 16px;
        border: none;
        cursor: pointer;
        font-size: 0.8rem;
        color: var(--accent);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        i {
            font-size: 1rem;
        }
        &:disabled{
            filter: brightness(0.7);
            cursor: not-allowed;
        }
    }

    .clear {
        color: #f13c3c;
    }

    .btn {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 10px;
    }

    .permission {
        color: #42a5f3;
    }

    .unsubscribe {
        color: var(--label-color);
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

        a {
            text-decoration: underline;
            color: inherit;
        }
    }

    .date {
        font-size: 0.8rem;
        background: var(--accent);
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