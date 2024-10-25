<script lang="ts">

    import { fly } from "svelte/transition";
    import { showGrade, updateStatus, isOffline, updateLog, clearData, calenderFetching, facultiesIsFetching } from "$lib/store.svelte";
    import { page } from "$app/stores";
    import { getCalendarData, GetData, getFaculties } from "$lib/fetcher";
    import Footer from "./Footer.svelte";
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
				goto("/login");
			} else if (target.id == "updateData") {
				updateData();
				history.back();
			} else if (target.id == "updateCalendar") {
				history.back();
				getCalendarData();
			} else if (target.id == "updateFaculties") {
				history.back();
				getFaculties();
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
			updateLog.value = "Credentials not found. Please login again";
			updateStatus.value = "error";
			return;
		}

		src = GetData(UserName, Password, (error: boolean) => {
			if (error) {
				return;
			}
			updateStatus.value = "success";
			updateLog.value = "Data updated";
			setTimeout(() => {
				updateStatus.value = "";
				updateLog.value = "";
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
					in:fly|global={{ y: 10, delay: 20 }}
				>
					<label class="hoverHighlight">
						<div class="controller">
							<div class="textContainer">Show grades</div>
							<div class="moreInfo">
								{#if showGrade.value}
								Grades will be shown in the courses
								{:else}
								Grades will not be shown in the courses
								{/if}
							</div>
						</div>
						<input
							type="checkbox"
							id="showGrade"
							bind:checked={showGrade.value}
						/>
						<span class="toggleButton"></span>
					</label>
				</div>
			</div>
			<div
				class="subsettings row btn-grp"
				in:fly|global={{ y: 10, delay: 100 }}
			>
				<button id="updateData"
					disabled={updateStatus.value == "loading" || isOffline.value}
					>Update courses <i class="fa-solid fa-book"></i></button
				>
				<button id="updateCalendar"
					disabled={calenderFetching.value || isOffline.value}
					>
					Update Calendar <i class="fa-solid fa-calendar"></i>
					</button
				>
				<button id="updateFaculties"
					disabled={facultiesIsFetching.value || isOffline.value}
				>
					Update Faculties <i class="fa-solid fa-chalkboard-user"></i>
				</button>
				<button id="clearData"
					>Clear Data <i class="fa-solid fa-trash"
					></i></button
				>
			</div>
			<div class="ft" in:fly|global={{ y: 10, delay: 200}}>
				<Footer />
			</div>
		</div>
	</div>
{/if}


<style lang="scss">

	.moreInfo {
		width: 100%;
		color: var(--label-color);
	}

	.row {
		flex-direction: row;
	}

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
		width: 100%;
		border-radius: 10px;
		label {
			padding: 5px;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 5px;
			width: 100%;
			cursor: pointer;
			border-radius: 10px;
		}
	}
	
	.hoverHighlight {
		&:hover {
			background: var(--primary);
		}
	}
	.settings-options {
		background: #031826;
		padding: 20px;
		border-radius: 10px;
		margin: 10px;
		width: min(400px, 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 15px;
		
		filter: drop-shadow(2px 5px 10px black);

		.btn-grp {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
		}

		button {
			border: none;
			outline: none;
			border-radius: 10px;
			padding: 15px 0;
			font-size: 0.8rem;
			background: var(--button-color);
			color: white;
			cursor: pointer;
			width: 100%;
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
		justify-content: flex-start;
		gap: 10px;
		color: var(--accent);
	}

	input {
		cursor: pointer;
		display: none;
	}

	input:checked ~ .toggleButton {
		background: rgb(0, 149, 255);
		&::after {
			transform: translateX(20px);
		}
	}

	.controller{
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		flex-direction: column;
	}

	#clearData {
		background: rgb(245, 51, 51);
	}
    
	button:disabled{
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
