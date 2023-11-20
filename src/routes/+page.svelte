

<script lang="ts">
	import Login from "./Login.svelte";
	import { showLogin, User, semesterData, semester, type SemesterDataType } from "$lib/store";
    import { onMount } from "svelte";
	import { fly } from "svelte/transition";
    import Chart from "./Chart.svelte";

	$: classData = $semesterData[$semester];
	//localStorage.setItem('classData', JSON.stringify(data));

	let showSelectionPanel = true;
	let loaded = false;

	onMount(() => {

		try{
			const raw = localStorage.getItem('classData');

			if (raw == null || raw == undefined || raw == '' || raw == '{}'){
				localStorage.removeItem('classData');
				console.log("No data");
				showLogin.set(true);
				loaded = true;
				return;
			}

			const sem = localStorage.getItem('semester');
			if (sem == null || sem == undefined || sem == '' || sem == '{}'){
				localStorage.removeItem('semester');
				console.log("No semester");
				showLogin.set(true);
				loaded = true;
				return;
			}

			semester.set(sem);
			
			User.set(localStorage.getItem('user') || '');
	
			const data = JSON.parse(raw);
	
			if (data satisfies SemesterDataType) {
				console.log("Data loaded from local storage");
				semesterData.set(data);
				showLogin.set(false);
				showClasses();
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

	function getDayNumber(day: string) {
		const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
		return daysOfWeek.indexOf(day);
	}


	function handleSelection(node: HTMLElement){
		node.onclick = (e) => {
			if (e.target == node){
				showSelectionPanel = false;
			}
		}

		return {
			destroy(){
				node.onclick = null;
			}
		}
	}

	function clearData(){
		localStorage.removeItem('classData');
		localStorage.removeItem('semester');
		localStorage.removeItem('user');
		semesterData.set({});
		semester.set('');
		User.set('');
		showLogin.set(true);
	}

	function showClasses(){
		showSelectionPanel = false;
	}

</script>


{#if loaded}
{#if !$showLogin && showSelectionPanel}
<div class="selectionPanel" transition:fly={{y: 20, duration: 200}} use:handleSelection>
	<div class="dropdownlist">
		<div class="name">
			<i class="fa-solid fa-user"></i> {$User}
		</div>
		<select bind:value={$semester} on:change={()=>{
			localStorage.setItem('semester', $semester);
			showSelectionPanel = false;
		}}>
			<option value="" selected disabled>Select Semester</option>
			{#each Object.keys($semesterData) as sem, i}
				<option value={sem}>{sem}</option>
			{/each}
		</select>
		<div class="btn-grp">
			<button on:click={clearData} class="clear-data">Clear</button>
		</div>
	</div>
</div>
{/if}
{#if $showLogin}
<Login />
{:else}
<div class="charts">
	{#if $semester}
	<div class="header">
		<div class="sem">
		  <i class="fa-solid fa-tree"></i> {$semester} <button on:click={()=>{
			showSelectionPanel = true;
		  }}><i class="fa-solid fa-caret-down"></i></button>
		</div>
		<div class="user">
		  <i class="fa-solid fa-user"></i> {$User}
		</div>
	</div>
	{#key $semester}
	{#each Object.entries(classData).sort((a, b) => getDayNumber(a[0]) - getDayNumber(b[0])) as [day, classInfo]}
	  {#if classInfo != null}
		<Chart {classInfo} {day} />
	  {/if}
	{/each}
	{/key}
	{/if}
  </div>
{/if}

{/if}

<style>
	.charts {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		padding: 30px;
		padding-top: 0;
		gap: 40px;
	}

	.selectionPanel{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(2px) brightness(0.8);
		filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.492));
	}

	.dropdownlist{
		background: var(--light-dark);
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 30px;
		padding: 20px 60px;
	}

	.btn-grp{
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	
select{
    width: 100%;
    height: 35px;
    background: rgb(26, 121, 209);
    outline: none;
    border: none;
    border-radius: 5px;
    color: aliceblue;
    text-align: center;
	cursor: pointer;
  }

  button{
    padding: 10px 15px;
    font-size: 0.7rem;
    border: none;
    border-radius: 5px;
    background: rgb(26, 121, 209);
    color: aliceblue;
    cursor: pointer;
  }
  button:hover{
      filter: brightness(0.95);
  }

  .clear-data{
    background: rgb(226, 6, 6);
  }

  .dropdown-list {
    width: 100%;
    padding: 5px;
    background: rgb(26, 121, 209);
    color: white;
    outline: none;
    border: none;
    border-radius: 5px;
    text-align: center;
  }

  .button-group{
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  .header{
    position: sticky;
    top: 0;
    width: 100%;
    padding: 10px;
    z-index: 10;
    display: flex;
    flex-direction: column;
	background: var(--primary);
    align-items: center;
    justify-content: center;
	font-size: 0.9rem;
  }

  .sem{
    color: #10ffbd;
  }

  .sem button{
    margin: 0;
    padding: 2px 5px;
    background: rgb(33 75 104);
  }

  .selection-container{
    position: fixed;
    top: 0;
    left: 0;
    background: #0d283ac7;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }

  .title.after-login{
    color: #bdcddf;
    font-size: 0.9rem;
  }
</style>