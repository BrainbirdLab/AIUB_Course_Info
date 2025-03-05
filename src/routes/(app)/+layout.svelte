<script lang="ts">
    import "$lib/styles/global.scss";

    import { clearData, isOffline, isSubscribed, isSubUnsubRunning, pageLoaded, showLogin, subCheckingDone, subPermissionDenied, currentPage, User } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { showToastMessage } from "@itsfuad/domtoastmessage";
    import { updateNoticesLocally } from "$lib/fetcher";
    import { onNavigate } from "$app/navigation";
    import { loadData } from "$lib/loader";

    let { children } = $props();

    async function detectSWUpdate(){

        const registration = await navigator.serviceWorker.ready;

        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    console.log("New update available");
                    showToastMessage("App Updated. Re-launch to see changes.", 1500);
                }
            });
        });

        // Listen for messages from the service worker
        if (registration.active && showLogin.value == false) {
            navigator.serviceWorker.addEventListener("message", (event: any) => {
                if (event.data.type == "subscribed") {
                    isSubUnsubRunning.value = false;
                    subCheckingDone.value = true;
                    if (!event.data.data) {
                        return;
                    }
                    updateNoticesLocally();
                    isSubscribed.value = true;
                    localStorage.setItem("isSubscribed", "true");
                    console.log("Subscribed to push notifications");
                } else if (event.data.type == "unsubscribed") {
                    isSubUnsubRunning.value = false;
                    subCheckingDone.value = true;
                    if (!event.data.data) {
                        return;
                    }
                    isSubscribed.value = false;
                    localStorage.setItem("isSubscribed", "false");
                    console.log("Unsubscribed from push notifications");
                } else if (event.data.type == "notice-update") {
                    updateNoticesLocally();
                }
            });
        } else {
            console.log("No active service worker to listen to messages from.");
        }
    }

    onNavigate(() => {
        currentPage.value = (window.location.pathname.at(-1) === '/' && window.location.pathname != '/') ? window.location.pathname.slice(0, -1) : window.location.pathname;
    });

    function validateUser() {
        if (!loadData()) {
            console.log("Error loading data");
            showLogin.value = true;
            clearData();
        } else {
            showLogin.value = false;
        }
    }

    let loaded = $state(false);

    onMount(() => {
        validateUser();
        detectSWUpdate();
        loaded = true;
    });
</script>

{#if loaded}
    {@render children()}
{/if}