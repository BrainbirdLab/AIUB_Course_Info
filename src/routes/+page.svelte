

<script lang="ts">
	import Login from "./Login.svelte";
	import { clearData, showLogin, User, semesterClassRoutine, semesterName, completedCourses, type SemesterDataType, unlockedCourses, tabs, type TABS } from "$lib/store";
    import { onMount } from "svelte";
	import { fly } from "svelte/transition";
    import ClassRoutine from "./ClassRoutine.svelte";
    import CourseCompleted from "./CourseCompleted.svelte";
	import UnlockedCourses from "./UnlockedCourses.svelte";
	//localStorage.setItem('semesterClassRoutine', JSON.stringify(data));

	let loaded = false;

	onMount(() => {

		try{
			const raw = localStorage.getItem('semesterClassRoutine');

			if (raw == null || raw == undefined || raw == '' || raw == '{}'){
				localStorage.removeItem('semesterClassRoutine');
				console.log("No data");
				showLogin.set(true);
				loaded = true;
				return;
			}

			const sem = localStorage.getItem('semester') as string;

			semesterName.set(sem);
			
			User.set(localStorage.getItem('user') || '');
	
			const data = JSON.parse(raw);

			const rawCompletedCourses = localStorage.getItem('completedCourses');
			const rawUnlockedCourses = localStorage.getItem('unlockedCourses');

			const parsedCompletedCourses = rawCompletedCourses ? JSON.parse(rawCompletedCourses) : {};
			const parsedUnlockedCourses = rawUnlockedCourses ? JSON.parse(rawUnlockedCourses) : {};

			completedCourses.set(parsedCompletedCourses);
			unlockedCourses.set(parsedUnlockedCourses);

			tabs.set(localStorage.getItem('tabs') as TABS || 'Routine');
			localStorage.setItem('tabs', $tabs);
	
			if (data satisfies SemesterDataType) {
				console.log("Data loaded from local storage");
				semesterClassRoutine.set(data);
				showLogin.set(false);
			} else {
				console.log("Invalid data");
				clearData();
			}
			loaded = true;
		} catch (e) {
			console.log("Error loading data");
			loaded = true;
			clearData();
		}
	});


	function handleNav(node: HTMLElement){
		node.onclick = (e: Event) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('navBtn')){
				const id = target.id;
				tabs.set(id.split('-')[1] as TABS);
				localStorage.setItem('tabs', $tabs);
			}
		}

		return {
			destroy(){
				node.onclick = null;
			}
		}
	}

	let showSettings = false;

	function handleSettings(node: HTMLElement){
		node.onclick = (e: Event) => {
			const target = e.target as HTMLElement;
			if (node == target){
				showSettings = !showSettings;
				return;
			}

			else if (target.classList.contains('clear')){
				clearData();
				showSettings = false;
			}
		}

		return {
			destroy(){
				node.onclick = null;
			}
		}
	
	}

</script>

<svelte:head>
	<title>AIUB Solution</title>
</svelte:head>

<div class="container">
	{#if loaded}
		{#if $showLogin}
		<Login />
		{:else}
			<ul class="menu" use:handleNav>
				<li class="navBtn" id="nav-Routine" class:shown="{$tabs == 'Routine'}">Class Routine</li>
				<li class="navBtn" id="nav-Completed" class:shown="{$tabs == 'Completed'}">Completed Course</li>
				<li class="navBtn" id="nav-Unlocked" class:shown="{$tabs == 'Unlocked'}">Unlocked Course</li>
				<button class="settings" on:click={()=>{showSettings = true;}}>
					<i class="fa-solid fa-gear"></i>
				</button>
			</ul>
			{#if $tabs == 'Routine'}
				{#if $semesterName}
					{#key $semesterName}
						<ClassRoutine />
					{/key}
				{/if}
			{:else if $tabs == 'Completed'}
				<CourseCompleted />
			{:else if $tabs == 'Unlocked'}
				<UnlockedCourses />
			{/if}
		{/if}
	{/if}

	{#if showSettings}
	<div class="wrapper" use:handleSettings transition:fly={{y:10, duration: 200}}>
		<div class="settings-options">
			<div class="title">Want to clear your data?</div>
			<div class="btn-grp">
				<button class="clear">Yes</button>
			</div>
		</div>
	</div>
	{/if}

</div>



<style lang="scss">

	.settings{
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.3rem;
		color: var(--accent);
		transition: 200ms ease-in-out;
		cursor: pointer;
		&:hover{
			transform: rotate(90deg);
			opacity: 0.8;
		}
	}

	.wrapper{
		height: 100%;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(2px) brightness(0.8);
	}

	.settings-options{
		background: var(--light-dark);
		padding: 10px;
		border-radius: 10px;
		height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 15px;

		.btn-grp{
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 15px;
		}

		button{
			border: none;
			outline: none;
			border-radius: 10px;
			padding: 10px 15px;
			color: ghostwhite;
			background: var(--accent);
			cursor: pointer;
			&:hover{
				filter: brightness(0.9);
			}

			&.clear{
				background: red;
			}
		}
	}

	.menu{
		display: flex;
		gap: 15px;
		list-style: none;
		color: var(--accent);
		padding: 10px;
		position: sticky;
		top: 0;
		background: var(--primary);
		justify-content: center;
		align-items: center;
		width: 100%;

		li{
			cursor: pointer;
			text-align: center;
			&::after{
				content: '';
				display: block;
				width: 100%;
				height: 2px;
				background: var(--accent);
				transition: 200ms ease-in-out;
				transform: scaleX(0);
				filter: brightness(1);
				transform-origin: center;
			}

			&:hover{
				filter: brightness(1.2);
			}
		}

		li.shown{
			&::after{
				transform: scaleX(1);
			}
		}
	}
</style>