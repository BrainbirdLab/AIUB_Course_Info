<script lang="ts">
    import "$lib/styles/global.scss";

    import { onMount } from "svelte";

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
    }

    onMount(() => {
        detectSWUpdate();
    })

</script>

<svelte:body on:contextmenu|preventDefault />

<slot></slot>