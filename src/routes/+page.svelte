<script lang="ts">
	import {
		User,
		semesterName,
		showLogin,
		tabs,
	} from "$lib/store";
	import { fade } from "svelte/transition";
	import CourseCompleted from "./CourseCompleted.svelte";
	import UnlockedCourses from "./UnlockedCourses.svelte";
	import Routine from "./Routine.svelte";
	import Navbar from "./Navbar.svelte";
    import Notice from "./Notice.svelte";
    import DataUpdateLog from "./dataUpdateLog.svelte";
    import PopupModal from "./popupModal.svelte";
    import Options from "./options.svelte";
	import Login from "./Login.svelte";

</script>

<div class="container">
	<PopupModal />
	
	<Options />
	{#if $showLogin}
		<Login />
	{:else}
		<div class="user" in:fade>
			<i class="fa-solid fa-user"></i> Hello, {$User}!
		</div>
		
		<Navbar />
		
		<DataUpdateLog />
		
		{#if $tabs == "Routine"}
			{#if $semesterName}
				<Routine />
			{/if}
		{:else if $tabs == "Completed"}
			<CourseCompleted />
		{:else if $tabs == "Unlocked"}
			<UnlockedCourses />
		{:else if $tabs == "Notice"}
			<Notice />
		{/if}
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
		<div class="verision">
			v2.0.1
		</div>
	</footer>
</div>

<style lang="scss">

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		min-height: 100%;
        height: 100%;
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

	.user {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		padding: 30px 10px 10px 10px;
		gap: 10px;
	}

	i {
		font-size: 1rem;
		pointer-events: none;
	}
</style>
