<script lang="ts">
    import { updateStatus, updateLog } from "$lib/store";
    import { fly } from "svelte/transition";

    function resetError(node: HTMLElement) {
		node.onclick = (e: Event) => {
			const target = e.target as HTMLElement;
			if (
				target.classList.contains("modalwrapper") ||
				target.classList.contains("ok")
			) {
				updateStatus.set("");
				updateLog.set("");
			}
		};

		return {
			destroy() {
				node.onclick = null;
			},
		};
	}
</script>

{#if $updateStatus == "error"}
	<div class="modalwrapper" use:resetError>
		<div class="errorModal" transition:fly|global={{ y: 10 }}>
			<div class="text">
				{$updateLog}
				<i class="fa-solid fa-triangle-exclamation"></i>
			</div>
			<button class="ok">Ok</button>
		</div>
	</div>
{/if}

<style lang="scss">
    .fa-triangle-exclamation {
		color: orange !important;
		font-size: 0.8rem;
	}
    
    .modalwrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 20;
		backdrop-filter: blur(2px) brightness(0.8);
	}

	.errorModal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #031826;
		border-radius: 10px;
		width: max-content;
		font-size: 0.9rem;
		padding: 30px 20px;
		gap: 20px;
		z-index: 30;
		min-width: 200px;
		filter: drop-shadow(2px 5px 10px black);

		.text {
			font-size: 1rem;
			padding-top: 20px;
		}

		button {
			background: var(--accent);
			border-radius: 10px;
			padding: 10px 20px;
			color: ghostwhite;
			cursor: pointer;
			font-size: 0.8rem;

			&:hover {
				filter: brightness(0.9);
			}
		}
	}
</style>