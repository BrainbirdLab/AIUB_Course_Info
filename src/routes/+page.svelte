

<script lang="ts">
	import Login from "./Login.svelte";
	import { showGrade, clearData, showLogin, User, semesterClassRoutine, semesterName, completedCourses, type SemesterDataType, unlockedCourses, tabs, type TABS } from "$lib/store";
    import { onMount, tick } from "svelte";
	import { fly } from "svelte/transition";
    import CourseCompleted from "./CourseCompleted.svelte";
	import UnlockedCourses from "./UnlockedCourses.svelte";
    import Routine from "./Routine.svelte";
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

			const gradeshow = localStorage.getItem('showGrade') as string;
			if (gradeshow == 'true'){
				showGrade.set(true);
			} else {
				showGrade.set(false);
			}
	
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

	let showOptions = false;

	function handleOptions(node: HTMLElement){
		node.onclick = (e: Event) => {
			const target = e.target as HTMLElement;
			if (node == target){
				showOptions = !showOptions;
				return;
			}

			else if (target.id == 'clearData'){
				clearData();
				showOptions = false;
			}

			else if (target.id == 'reloadData'){
				reloadData();
				showOptions = false;
			}

			else if (target.id == 'showGrade'){
				const value = (target as HTMLInputElement).checked;
				localStorage.setItem('showGrade', value.toString());
			}
		}

		return {
			destroy(){
				node.onclick = null;
			}
		}
	
	}

	let log = '';
	let reloadStatus = '';

	async function reloadData(){
		const UserName = localStorage.getItem('UserName');
		const Password = localStorage.getItem('Password');
		if (!UserName || !Password){
			console.log("No user name or password");
			log = "Credentials not found. Please login again";
			reloadStatus = 'error';
			return;
		}

		log = "Reloading data";
		reloadStatus = 'loading';

		try{
			//https://aiubproxyserver.onrender.com/
			const res = await fetch('https://aiubproxyserver.onrender.com', {
					method: 'POST',
					body: new URLSearchParams({
						'UserName': UserName,
						'Password': Password
					}),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			
			const data = await res.json();

			if (res.ok){
				reloadStatus = '';
				//console.log(data);
				//logText = data.message;
				User.set(data.result.user);
				semesterClassRoutine.set(data.result.semesterClassRoutine);
				unlockedCourses.set(data.result.unlockedCourses);
				completedCourses.set(data.result.completedCourses);
				semesterName.set(data.result.currentSemester);
				localStorage.setItem('user', data.result.user);
				localStorage.setItem('semesterClassRoutine', JSON.stringify(data.result.semesterClassRoutine));
				localStorage.setItem('unlockedCourses', JSON.stringify(data.result.unlockedCourses));
				localStorage.setItem('completedCourses', JSON.stringify(data.result.completedCourses));
				localStorage.setItem('semester', data.result.currentSemester);
				showLogin.set(false);
				log = "Updated successfully";
				setTimeout(() => {
					log = '';
				}, 2000);
			} else {
				reloadStatus = 'error';
				//console.log(data);
				log = data.message;
			}

		} catch(e){
			console.log(e);
			log = "Something went wrong. Resolve issues on you portal.";
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
				<li class="navBtn" id="nav-Routine" class:shown="{$tabs == 'Routine'}">
					<div class="content">
						Routine <i class="fa-regular fa-calendar-days"></i>
					</div>
				</li>
				<li class="navBtn" id="nav-Completed" class:shown="{$tabs == 'Completed'}">
					<div class="content">
						Completed <i class="fa-solid fa-circle-check"></i>
					</div>
				</li>
				<li class="navBtn" id="nav-Unlocked" class:shown="{$tabs == 'Unlocked'}">
					<div class="content">
						Unlocked <i class="fa-solid fa-unlock"></i>
					</div>
				</li>
				<button class="options" on:click={()=>{showOptions = true;}}>
					<div class="content">
						Options
						<i class="fa-solid fa-wrench"></i>
					</div>
				</button>
			</ul>

			{#if log}
			<div class="log" transition:fly={{y: 10}} class:error={reloadStatus == 'error'}>{log}
				{#if reloadStatus == 'loading'}
				<i class="fa-solid fa-rotate fa-spin"></i>
				{:else if reloadStatus == 'error'}
				<i class="fa-solid fa-triangle-exclamation"></i>
				{/if}
			</div>
			{/if}

			{#if $tabs == 'Routine'}
				{#if $semesterName}
					<Routine/>
				{/if}
			{:else if $tabs == 'Completed'}
				<CourseCompleted />
			{:else if $tabs == 'Unlocked'}
				<UnlockedCourses />
			{/if}
		{/if}
		
		{#if showOptions}
		<div class="wrapper" use:handleOptions transition:fly={{y:10, duration: 200}}>
			<div class="settings-options">
				<div class="title-text">
					Options <i class="fa-solid fa-gear"></i>
				</div>
                <div class="subsettings">
                    <!-- Enable/disable button sounds -->
                    <div class="field-checkers"  transition:fly|global={{y: 20, delay: 20}}>
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
				<div class="subsettings btn-grp" transition:fly|global={{y: 20, delay: 100}}>
					<button id="reloadData">Reload Data</button>
					<button id="clearData">Clear Data</button>
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

	.log{
		font-size: 0.8rem;
		color: var(--accent);
		i{
			font-size: inherit;
		}

		&.error{
			color: red;
		}
	}

	.fa-triangle-exclamation {
		color: orange !important;
	}

	.title-text{
		font-size: 1rem;
		font-weight: bold;
		padding: 10px 0 5px 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		justify-content: center;
		gap: 10px;
		color: var(--accent);
		border-bottom: 2px solid;
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

	#clearData{
		background: red;
	}

	.user{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		padding: 50px 10px 10px 10px;
		gap: 10px;
	}

	.container{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 30px;
		width: 100%;

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

	i{
		font-size: 1.5rem;
		pointer-events: none;
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
		i{
			font-size: 0.7rem;
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

	.options{
		color: tomato;
	}

	.wrapper{
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


	.subsettings{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.btn-grp{
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
		label{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			gap: 5px;
			width: 100%;
			cursor: pointer;
			padding: 10px;
			border-radius: 10px;

			&:hover{
				background: var(--hover-light-dark);
			}
		}
	}

	.settings-options{
		background: var(--light-dark);
		padding: 25px;
		border-radius: 10px;
		//height: 200px;
		width: max-content;
		padding-bottom: 20px;
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
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 15px;
		list-style: none;
		color: var(--accent);
		position: sticky;
		top: 0;
		padding: 10px;
		background: var(--primary);
		justify-content: center;
		align-items: center;
		width: 100%;
		z-index: 20;
		li{
			cursor: pointer;
			text-align: center;
			font-size: 0.7rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 5px;

			.content{
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				justify-content: center;
				gap: 5px;
				pointer-events: none;
			}

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
