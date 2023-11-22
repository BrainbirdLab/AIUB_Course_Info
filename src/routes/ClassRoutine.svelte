<script lang="ts">

    import { clearData, showLogin, semesterClassRoutine, semesterName, User} from '$lib/store';
    import { fly } from 'svelte/transition';

    import Chart from './Chart.svelte';

    $: classData = $semesterClassRoutine[$semesterName];

    let AvailableColors =  [
        "#405b91",
        "#1d8ad3",
        "#123472",
        "#d3251d",
        "#009169",
        "#008a91",
        "#064491",
        "#7d12df",
        "#df1241",
        "#4d6a59",
    ];

    let ColorsMap = new Map<string, string>();

    let showSelectionPanel = false;

    ColorsMap.set('Free', '#000800aa');
    ColorsMap.set('Break', '#077518');

    function getDayNumber(day: string) {
		const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
		return daysOfWeek.indexOf(day);
	}

    function handleSelection(node: HTMLElement){
		node.onclick = (e) => {
			console.log($semesterName);
			if (e.target == node && $semesterName != ''){
				showSelectionPanel = false;
			}
		}

		return {
			destroy(){
				node.onclick = null;
			}
		}
	}

</script>

{#if !$showLogin && showSelectionPanel}
<div class="selectionPanel" transition:fly={{y: 20, duration: 200}} use:handleSelection>
    <div class="dropdownlist">
        <div class="title">
            Choose semester
        </div>
        <select bind:value={$semesterName} on:change={()=>{
            localStorage.setItem('semester', $semesterName);
            showSelectionPanel = false;
        }}>
            <option value="" selected disabled>Select Semester</option>
            {#each Object.keys($semesterClassRoutine) as sem, i}
                <option value={sem}>Semester: {i+1} - {sem}</option>
            {/each}
        </select>
    </div>
</div>
{/if}

<div class="header">
    <div class="sem">
    <i class="fa-solid fa-tree"></i> {$semesterName} <button on:click={()=>{
        showSelectionPanel = true;
    }}><i class="fa-solid fa-caret-down"></i></button>
    </div>
    <div class="user">
    <i class="fa-solid fa-user"></i> {$User}
    </div>
</div>

<div class="wrapper">
    {#each Object.entries(classData).sort((a, b) => getDayNumber(a[0]) - getDayNumber(b[0])) as [day, classInfo], i}
    {#if classInfo != null}
    <div class="container" in:fly|global={{y: 10, delay: 50*(i+1)}}>
        <Chart {classInfo} {day} bind:AvailableColors={AvailableColors} bind:ColorsMap={ColorsMap}/>
    </div>
    {/if}
    {/each}
</div>

<style>



    .wrapper{
        display: flex;
        gap: 20px;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 20px;
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
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 350px;
		padding: 30px 60px;
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
        border-radius: 10px;
        background: rgb(26, 121, 209);
        color: aliceblue;
        cursor: pointer;
    }
    button:hover{
        filter: brightness(0.95);
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
        height: 30px;
        width: 30px;
        margin: 0;
        padding: 2px 5px;
        background: rgb(33 75 104);
    }

</style>