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

<footer class="footer">
    <div class="source"><a href="https://github.com/itsfuad/AIUB_Solution">Source code <i class="fa-solid fa-code"></i></a></div>
    ・
    <a href="https://www.flaticon.com/free-icons/course" title="course icons">Flaticon</a>
    ・
    <a href="https://www.fontawesome.com" title="fontawesome">Fontawesome</a>
</footer>

<style lang="scss">
    .footer{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 10px;
		gap: 5px;
		font-size: 0.6rem;
        position: relative;
		*{
			padding: 0;
			color: ghostwhite;
		}

		a{
			text-decoration: underline;
		}
		i{
			font-size: 0.7rem;
		}
	}
</style>