<script lang="ts">
    import { isOffline, isSubscribed } from "$lib/store";
    import "$lib/styles/global.scss";

    import { onDestroy, onMount } from "svelte";
    import type { Unsubscriber } from "svelte/store";
    import { fetchNoticesFromDB } from "./fetcher";

    async function detectSWUpdate(){

        const registration = await navigator.serviceWorker.ready;

        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    console.log("New update available");
                }
            });
        });

        // Listen for messages from the service worker
        if (registration.active) {
            navigator.serviceWorker.addEventListener("message", (event: any) => {
                if (event.data.type == "subscribed") {
                    console.log("Subscribed to push notifications");
                    isSubscribed.set(true);
                    localStorage.setItem("isSubscribed", "true");
                } else if (event.data.type == "unsubscribed") {
                    console.log("Unsubscribed from push notifications");
                    isSubscribed.set(false);
                    localStorage.setItem("isSubscribed", "false");
                } else if (event.data.type == "notice") {
                    console.log("New notice available");
                    fetchNoticesFromDB().catch((e) => {
                        console.log("Error fetching notices", e);
                    });
                }
            });
        } else {
            console.error("No active service worker to listen to messages from.");
        }
    }

    let unsub: Unsubscriber;

    onMount(async () => {
        try {
            detectSWUpdate();
            const isSubscribedLS = localStorage.getItem("isSubscribed") === "true" ? true : false;
            isSubscribed.set(isSubscribedLS);
            window.addEventListener("offline", () => {
                isOffline.set(true);
            });

            window.addEventListener("online", () => {
                isOffline.set(false);
            });
        } catch (error) {
            console.error(error);
        }
    })

    onDestroy(() => {
        unsub?.();
    });

</script>

<svelte:body on:contextmenu|preventDefault />

<slot></slot>