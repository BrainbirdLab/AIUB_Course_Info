<script lang="ts">
    import { fly } from "svelte/transition";
    import LoginForm from "./LoginForm.svelte";
    import { onMount } from "svelte";
    import Footer from "./Footer.svelte";

    let loaded = false;

    onMount(() => {
        loaded = true;
    });

</script>

{#if loaded}
<div class="moto" in:fly|global={{ y: -10 }}>
    AIUB Course Info
    <div class="sub" in:fly|global={{ x: 10 }}>
        - A simple solution for your AIUB portal
    </div>
</div>
<LoginForm />
<Footer padding={"10px"}/>
{/if}

<style lang="scss">
    .moto {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        padding: 50px 0 35px;
        .sub {
            font-size: 0.7rem;
            color: var(--label-color);
        }
    }
</style>