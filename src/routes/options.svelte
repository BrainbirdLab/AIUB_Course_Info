
<script lang="ts">

    import { fly } from "svelte/transition";
    import { showGrade, updateStatus, isOffline, updateLog, clearData } from "$lib/store";
    import { page } from "$app/stores";
    import { GetData } from "./fetcher";
    import { goto } from "$app/navigation";

    let src: EventSource | null = null;
    
	function handleOptions(node: HTMLElement) {
		node.onclick = (e: Event) => {
			const target = e.target as HTMLElement;
			if (node == target) {
				history.back();
			} else if (target.id == "clearData") {
				clearData();
                if (src) {
                    src.close();
                }
			} else if (target.id == "updateData") {
				updateData();
				history.back();
			} else if (target.id == "showGrade") {
				const value = (target as HTMLInputElement).checked;
				if (!value) {
					localStorage.setItem("showGrade", "false");
				} else {
					localStorage.setItem("showGrade", "true");
				}
			}
		};

		return {
			destroy() {
				node.onclick = null;
			},
		};
	}

	async function updateData() {
		const UserName = localStorage.getItem("UserName");
		const Password = localStorage.getItem("Password");
		if (!UserName || !Password) {
			console.log("No user name or password");
			updateLog.set("Credentials not found. Please login again");
			updateStatus.set("error");
			return;
		}

		src = GetData(UserName, Password, (error: boolean) => {
			if (error) {
				return;
			}
			updateStatus.set("success");
			updateLog.set("Data updated");
			setTimeout(() => {
				updateStatus.set("");
				updateLog.set("");
			}, 1200);
		});
	}
</script>


{#if $page.state.options}
	<div
		class="wrapper"
		use:handleOptions
		transition:fly={{ y: 10, duration: 200 }}
	>
		<div class="settings-options">
			<div class="title-text">
				Options <i class="fa-solid fa-gear"></i>
			</div>
			<div class="subsettings">
				<!-- Enable/disable button sounds -->
				<div
					class="field-checkers"
					transition:fly|global={{ y: 20, delay: 20 }}
				>
					<input
						type="checkbox"
						id="showGrade"
						bind:checked={$showGrade}
					/>
					<label for="showGrade">
						<div class="textContainer">Show grades</div>
						<span class="toggleButton" />
					</label>
				</div>
			</div>
			<div
				class="subsettings btn-grp"
				transition:fly|global={{ y: 20, delay: 100 }}
			>
				<button id="updateData"
					disabled={$updateStatus == "loading" || $isOffline}
					>Sync with portal <i class="fa-solid fa-rotate"
					></i></button
				>
				<button id="clearData"
					>Clear Data <i class="fa-solid fa-trash"
					></i></button
				>
			</div>
		</div>
	</div>
{/if}


<style lang="scss">

	.wrapper {
		height: 100%;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 30;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(2px) brightness(0.8);
	}

	.subsettings {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
	}

	.btn-grp {
		flex-direction: row;
		gap: 20px;
	}

	.field-checkers {
		display: flex;
		position: relative;
		cursor: pointer;
		user-select: none;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 5px;
		padding: 10px;
		padding: 5px 10px;
		width: 100%;
		border-radius: 10px;
		label {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			gap: 5px;
			width: 100%;
			cursor: pointer;
			padding: 10px;
			border-radius: 10px;

			&:hover {
				background: var(--primary);
			}
		}
	}

	.settings-options {
		background: #031826;
		padding: 10px 25px 20px;
		border-radius: 10px;
		width: max-content;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 15px;
		filter: drop-shadow(2px 5px 10px black);

		.btn-grp {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 15px;
		}

		button {
			border: none;
			outline: none;
			border-radius: 10px;
			padding: 10px 15px;
			color: ghostwhite;
			font-size: 0.8rem;
			background: var(--accent);
			cursor: pointer;
			&:hover {
				filter: brightness(0.9);
			}
		}
	}

	.title-text {
		font-size: 1rem;
		font-weight: bold;
		padding: 10px 0 5px 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		justify-content: center;
		gap: 10px;
		color: var(--label-color);
		border-bottom: 2px solid #ffffff1f;
	}

	input {
		cursor: pointer;
		display: none;
		&:checked ~ label .toggleButton {
			background: rgb(0, 149, 255);
			&::after {
				transform: translateX(20px);
			}
		}
	}

	#clearData {
		background: red;
	}
    
	#updateData:disabled{
		filter: brightness(0.7);
		cursor: not-allowed;
	}

	.toggleButton {
		position: relative;
		width: 40px;
		height: 20px;
		background: tomato;
		display: flex;
		border-radius: 25px;
		transition: 300ms ease-in-out;
		&::after {
			content: "";
			position: absolute;
			height: 20px;
			width: 20px;
			border-radius: 50px;
			background: white;
			top: 0;
			left: 0;
			transition: 300ms ease-in-out;
			transform: translateX(0px);
		}
	}
</style>