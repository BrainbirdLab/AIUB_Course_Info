

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

		<div class="moto" in:fly|global={{y: -10}}>
			AIUB Solution
			<div class="sub" in:fly|global={{x: 10}}>
				- A simple solution for your AIUB portal
			</div>
		</div>

		<Login />

		<!-- Say concent before loging in with their password -->
		<div class="concent" in:fly|global={{y: -10}}>
			<div class="t">
				Please read the following carefully!
			</div>
			<ul in:fly|global={{x: -10, delay: 200}}>
				<li>We use your User Id and Password only for getting your data from the portal.</li>
				<li>We do not store your User Id and Password anywhere.</li>
				<li>After completing the session all data is stored on your device.</li>
				<li>Use this site with your concent</li>
			</ul>
		</div>

		{:else}

			<div class="user">
				<i class="fa-solid fa-user"></i> Hello, {$User}!
			</div>

			<ul class="menu" use:handleNav>
				<li class="navBtn" id="nav-Routine" class:shown="{$tabs == 'Routine'}">Class Routine</li>
				<li class="navBtn" id="nav-Completed" class:shown="{$tabs == 'Completed'}">Completed Course</li>
				<li class="navBtn" id="nav-Unlocked" class:shown="{$tabs == 'Unlocked'}">Unlocked Course</li>
				<button class="settings" on:click={()=>{showSettings = true;}}>
					<i class="fa-solid fa-trash"></i>
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

		<footer class="footer">
			<div class="dev">Developed by <a href="https://itsfuad.vercel.app">Fuad</a></div>
			<div> - </div>
			<div class="source"><a href="https://github.com/itsfuad/AIUB_Solution">Source code <i class="fa-solid fa-code"></i></a></div>
		</footer>
	{/if}
</div>


<style lang="scss">

	.user{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		padding: 50px 0 0 0;
		gap: 10px;
	}

	.container{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 30px;

		.moto{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 1.2rem;
			padding: 50px 0 0 0;
			.sub{
				font-size: 0.7rem;
				color: var(--label-color)
			}
		}
	}

	.footer{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 10px;
		gap: 5px;
		font-size: 0.6rem;
		*{
			padding: 0;
			color: ghostwhite;
		}

		a{
			text-decoration: underline;
		}
	}

	.concent{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--label-color);
		padding: 20px;
		.t{
			color: ghostwhite;
                        font-size: 0.8rem;
		}
		ul{
                        
                        padding: 15px;
                        font-size: 0.7rem;
			li{
				margin: 5px 0;
				font-size: 0.7rem;
			}
		
		}
	}

	.settings{
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.3rem;
		color: var(--accent);
		transition: 200ms ease-in-out;
		cursor: pointer;
		&:hover{
			opacity: 0.8;
		}

		.fa-trash{
			color: red;
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
		filter: drop-shadow(2px 5px 10px black);

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
