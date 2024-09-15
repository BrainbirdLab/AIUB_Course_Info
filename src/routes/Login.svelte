<script lang="ts">
    import { fly } from "svelte/transition";
    import LoginForm from "./LoginForm.svelte";
    import { onMount } from "svelte";

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

<!-- Say concent before loging in with their password -->
<div class="concent" in:fly|global={{ y: -10 }}>
    <div class="t" in:fly|global={{ x: 10, delay: 120 }}>Please read the following carefully!</div>
    <ul in:fly|global={{ x: -10, delay: 200 }}>
        <li>
            We use your User Id and Password only for getting your
            data from the portal.
        </li>
        <li>We do not store your User Id and Password anywhere.</li>
        <li>
            After completing the session all data is stored on your
            device.
        </li>
        <li>Use this site with your concent</li>
    </ul>
</div>
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
    .concent {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--label-color);
		padding: 20px;
		.t {
			color: ghostwhite;
			font-size: 0.8rem;
		}
		ul {
			padding: 15px;
			font-size: 0.7rem;
			li {
				margin: 5px 0;
				font-size: 0.7rem;
			}
		}
	}
</style>