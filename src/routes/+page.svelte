<script lang="ts">
	import {
		User,
		semesterName,
		showLogin,
		tabs,
	} from "$lib/store";
	import { onMount } from "svelte";
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

	let loaded = false;

	onMount(() => {
		if (!$User) {
            showLogin.set(true);
        }
		loaded = true;
	});

</script>

{#if loaded}
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

		<PopupModal />

		<Options />
	{/if}
{/if}


<style lang="scss">

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
