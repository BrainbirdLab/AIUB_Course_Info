<script lang="ts">
    import "$lib/styles/global.scss";

    import { clearData, showLogin, currentPage } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import { onNavigate } from "$app/navigation";
    import { loadData } from "$lib/loader";

    let { children } = $props();

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
        loaded = true;
    });
</script>

{#if loaded}
    {@render children()}
{/if}