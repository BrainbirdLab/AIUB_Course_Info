<script lang="ts">
    import { fly } from "svelte/transition";
    import LoginForm from "./LoginForm.svelte";
    import { onMount } from "svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { showLogin } from "$lib/store.svelte";
    import { goto } from "$app/navigation";

    let loaded = $state(false);

    onMount(() => {
        if (!showLogin.value){
            goto("/");
        }
        loaded = true;
    });

</script>

{#if loaded && showLogin.value}
<div class="container">
    <div class="moto" in:fly|global={{ y: -10 }}>
        AIUB Course Info
        <div class="sub" in:fly|global={{ x: 10 }}>
            - A simple solution for your AIUB portal
        </div>
    </div>
    <LoginForm />
    <Footer padding={"10px"}/>
</div>
{/if}

<style lang="scss">
    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: safe center;
    }
    .moto {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        padding: 10px 0 35px;
        margin-top: auto;
        .sub {
            font-size: 0.7rem;
            color: var(--label-color);
        }
    }
</style>