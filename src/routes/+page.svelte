<script context="module" lang="ts">
	const url = import.meta.env.VITE_API_SERVER_URL as string;
</script>

<script lang="ts">
	import Login from "./Login.svelte";
	import Logo from "./Logo.svelte";
	import {
		updateLog,
		updateStatus,
		showGrade,
		clearData,
		showLogin,
		User,
		semesterClassRoutine,
		semesterName,
		completedCourses,
		type SemesterDataType,
		unlockedCourses,
		tabs,
		type TABS,
		preregisteredCourses,
	} from "$lib/store";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";
	import CourseCompleted from "./CourseCompleted.svelte";
	import UnlockedCourses from "./UnlockedCourses.svelte";
	import Routine from "./Routine.svelte";
	import { page } from "$app/stores";
	import Navbar from "./Navbar.svelte";

	let loaded = false;

	onMount(() => {
		try {
			const raw = localStorage.getItem("semesterClassRoutine");

			if (raw == null || raw == undefined || raw == "" || raw == "{}") {
				localStorage.removeItem("semesterClassRoutine");
				console.log("No data");
				showLogin.set(true);
				loaded = true;
				return;
			}

			const sem = localStorage.getItem("semester") as string;

			semesterName.set(sem);

			User.set(localStorage.getItem("user") || "");

			const data = JSON.parse(raw);

			const rawCompletedCourses =
				localStorage.getItem("completedCourses");
			const rawPreregisteredCourses = localStorage.getItem(
				"preregisteredCourses",
			);
			const rawUnlockedCourses = localStorage.getItem("unlockedCourses");

			const parsedCompletedCourses = rawCompletedCourses
				? JSON.parse(rawCompletedCourses)
				: {};

			const parsedPreregisteredCourses = rawPreregisteredCourses
				? JSON.parse(rawPreregisteredCourses)
				: {};

			const parsedUnlockedCourses = rawUnlockedCourses
				? JSON.parse(rawUnlockedCourses)
				: {};

			completedCourses.set(parsedCompletedCourses);
			preregisteredCourses.set(parsedPreregisteredCourses);
			unlockedCourses.set(parsedUnlockedCourses);

			tabs.set((localStorage.getItem("tabs") as TABS) || "Routine");
			localStorage.setItem("tabs", $tabs);

			const gradeshow = localStorage.getItem("showGrade") as string;
			if (gradeshow == "true") {
				showGrade.set(true);
			} else {
				showGrade.set(false);
			}

			if (data satisfies SemesterDataType) {
				//console.log("Data loaded from local storage");
				semesterClassRoutine.set(data);
				//console.log("Semester set");
				showLogin.set(false);
				//console.log("Login shown");
			} else {
				console.log("Invalid data");
				clearData();
			}

			loaded = true;
			//console.log("Loaded set to true");
		} catch (e) {
			console.log("Error loading data");
			loaded = true;
			clearData();
		}
	});

	let controller = new AbortController();
	let signal = controller.signal;

	function handleOptions(node: HTMLElement) {
		node.onclick = (e: Event) => {
			const target = e.target as HTMLElement;
			if (node == target) {
				history.back();
			} else if (target.id == "clearData") {
				clearData();
				//abort all fetch requests
				controller.abort();
				history.back();
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

		//if offline
		if (navigator.onLine == false) {
			updateLog.set("You are offline");
			updateStatus.set("error");
			return;
		}

		updateLog.set("Updating data");
		updateStatus.set("loading");

		try {
			//abort previous fetch requests
			controller.abort();
			controller = new AbortController();
			signal = controller.signal;

			const res = await fetch(url, {
				method: "POST",
				body: new URLSearchParams({
					UserName: UserName,
					Password: Password,
				}),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				signal: signal,
			});

			const data = await res.json();

			if (data.success) {
				updateStatus.set("success");
				//console.log(data);
				//logText = data.message;
				User.set(data.result.user);
				semesterClassRoutine.set(data.result.semesterClassRoutine);
				unlockedCourses.set(data.result.unlockedCourses);
				preregisteredCourses.set(data.result.preregisteredCourses);
				completedCourses.set(data.result.completedCourses);
				semesterName.set(data.result.currentSemester);
				localStorage.setItem("user", data.result.user);
				localStorage.setItem(
					"semesterClassRoutine",
					JSON.stringify(data.result.semesterClassRoutine),
				);
				localStorage.setItem(
					"unlockedCourses",
					JSON.stringify(data.result.unlockedCourses),
				);
				localStorage.setItem(
					"preregisteredCourses",
					JSON.stringify(data.result.preregisteredCourses),
				);
				localStorage.setItem(
					"completedCourses",
					JSON.stringify(data.result.completedCourses),
				);
				//localStorage.setItem("allCourses", JSON.stringify(data.result.allCourses));
				localStorage.setItem("semester", data.result.currentSemester);
				showLogin.set(false);
				updateLog.set("Updated successfully");
				setTimeout(() => {
					updateLog.set("");
					updateStatus.set("");
				}, 2000);
			} else {
				updateStatus.set("error");
				//console.log(data);
				updateLog.set(data.message);
			}
		} catch (e: any) {
			//if aborted
			if (e.name == "AbortError") {
				console.log("Aborted update");
				return;
			}
			updateStatus.set("error");
			updateLog.set("Something went wrong.");
		}
	}

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

<svelte:head>
	<title>AIUB Course Info</title>
</svelte:head>
{#if !loaded}
	<div class="preload" in:fade out:fly={{ y: 10 }}>
		<Logo />
	</div>
{:else}
	<div class="container">
		{#if $showLogin}
			<div class="moto" in:fly|global={{ y: -10 }}>
				AIUB Course Info
				<div class="sub" in:fly|global={{ x: 10 }}>
					- A simple solution for your AIUB portal
				</div>
			</div>

			<Login {url} />

			<!-- Say concent before loging in with their password -->
			<div class="concent" in:fly|global={{ y: -10 }}>
				<div class="t">Please read the following carefully!</div>
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
		{:else}
			<div class="user" in:fade>
				<i class="fa-solid fa-user"></i> Hello, {$User}!
			</div>

			<Navbar />

			<div class="log">
				{#if $updateStatus == "loading" || $updateStatus == "success"}
					<div class="content" transition:fly={{ y: 10 }}>
						{$updateLog}
						{#if $updateStatus == "loading"}
							<i class="fa-solid fa-rotate fa-spin"></i>
						{:else if $updateStatus == "success"}
							<i class="fa-solid fa-check"></i>
						{/if}
					</div>
				{/if}
			</div>

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

			{#if $tabs == "Routine"}
				{#if $semesterName}
					<Routine />
				{/if}
			{:else if $tabs == "Completed"}
				<CourseCompleted />
			{:else if $tabs == "Unlocked"}
				<UnlockedCourses />
			{/if}
		{/if}

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
		<footer class="footer">
			<div class="source">
				<a href="https://github.com/BrainbirdLab/AIUB_Course_Info"
					>Source code <i class="fa-solid fa-code"></i></a
				>
			</div>
			・
			<div class="support">
				<a href="https://github.com/BrainbirdLab/AIUB_Course_Info/issues">
					Submit issues <i class="fa-solid fa-circle-exclamation"></i>
				</a>
			</div>
		</footer>
	</div>
{/if}

<style lang="scss">
	.preload {
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		inset: 0;
		font-size: 0.8rem;
		color: var(--accent);
		gap: 10px;
		z-index: 100;
	}

	.footer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 10px;
		gap: 5px;
		font-size: 0.6rem;
		position: relative;
		margin: auto 0 0;
		color: var(--label-color);

		a {
			text-decoration: underline;
			color: inherit;
		}

		i {
			font-size: inherit;
		}
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
		padding: 20px;
		gap: 20px;
		z-index: 30;
		min-width: 200px;
		filter: drop-shadow(2px 5px 10px black);

		button {
			background: black;
			border-radius: 10px;
			padding: 10px 20px;
			color: ghostwhite;
			cursor: pointer;
			font-size: 0.8rem;

			&:hover {
				background: rgb(17, 17, 17);
			}
		}
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

	.log {
		font-size: 0.7rem;
		color: var(--accent);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 3px;
		height: 10px;
		i {
			font-size: inherit;
		}
	}

	.fa-triangle-exclamation {
		color: orange !important;
		font-size: 0.8rem;
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

	.user {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		padding: 30px 10px 10px 10px;
		gap: 10px;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		min-height: 100%;

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
	}

	i {
		font-size: 1rem;
		pointer-events: none;
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
</style>
