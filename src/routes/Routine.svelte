<script lang="ts">
    import { parseCourseId, semesterClassRoutine, semesterName, CourseIconColors } from "$lib/store";
    import { onDestroy, onMount } from "svelte";
    import { fade, fly } from "svelte/transition";

    let mounted = false;

    $: classData = $semesterClassRoutine[$semesterName];

    function getDayNumber(day: string) {
		const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
		return daysOfWeek.indexOf(day);
	}

    function timeParser(timeRange: string): [number, number] {
        const times = timeRange.split("-").map((time) => time.trim());
        const startTime = times[0];
        const endTime = times[1];
        const start = new Date("1970-01-01 " + startTime);
        const end = new Date("1970-01-01 " + endTime);
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();
        return [startMinutes, endMinutes];
    }

    let AvailableColors =  [
        "#405b91",
        "#1d8ad3",
        "#123472",
        "#d3251d",
        "#009169",
        "#008a91",
        "#064491",
        "#7d12df",
        "#4caf50",
        "#4d6a59",
    ];

    let copyColors = new Array(...AvailableColors);

    let ColorsMap = new Map<string, string>();

    function chooseColor(classId: string) {

        if (ColorsMap.has(classId)) {
            return ColorsMap.get(classId);
        } else {
            const color = AvailableColors[Math.floor(Math.random() * AvailableColors.length)];
            ColorsMap.set(classId, color);
            //remove the color from the available colors
            AvailableColors = AvailableColors.filter((c) => c != color);
            return color;
        }
    }

    function shorten(str: string){
        if (str.length > 15) {
            return str.split(' ').map((word) => word.toLowerCase() != 'lab' ? word.toLowerCase().replace('to', '')[0] : ` ${word}`).join('').toUpperCase();
        }
        return str;
    }

    onMount(() => {
        mounted = true;
    });
</script>


{#if mounted}
<div class="wrapper" in:fly={{x: -10}}>
    {#if classData}
    <div class="title" in:fly|global={{x: 10, duration: 200, delay: 100}}>Your class routine</div>
    <div class="dropdownlist" in:fly|global={{y: 20, duration: 200}}>
        <select bind:value={$semesterName} on:change={()=>{
            localStorage.setItem('semester', $semesterName);
            console.log($semesterName);
            //reset the available colors
            AvailableColors = new Array(...copyColors);
        }}>
            <option value="" selected disabled>Select Semester</option>
            {#if $semesterClassRoutine}
                {#each Object.keys($semesterClassRoutine) as sem, i}
                    <option value={sem}>Semester: {i+1} - {sem}</option>
                {/each}
            {/if}
        </select>
    </div>
    <div class="classRoutine">
        <div class="timeline">
            {#each [0, 1, 2, 3, 4, 5, 6, 7, 8] as i}
                <div class="time">
                    <!-- Have am/pm -->
                    <div class="text" in:fly|global={{y: 50*i+1, delay: 100}}>
                        {i == 0 ? '8:00 am' : i == 1 ? '9:30 am' : i == 2 ? '11:00 am' : i == 3 ? '12:30 pm' : i == 4 ? '2:00 pm' : i == 5 ? '3:30 pm' : i == 6 ? '5:00 pm' : i == 7 ? '6:30 pm' : i == 8 ? '8:00 pm' : '9:30 pm'}
                    </div>
                </div>
            {/each}
        </div>
        <div class="routine">
            {#each Object.entries(classData).sort((a, b) => getDayNumber(a[0]) - getDayNumber(b[0])) as [day, classInfo], i}
                {#if classInfo != null}
                <div class="day" in:fly|global={{y: 10, delay: 50*(i+1)}}>
                    <div class="dayname">{day}</div>
                    {#each Object.entries(classInfo).sort((a, b) => timeParser(a[0])[0] - timeParser(b[0])[0]) as [time, Class], i}
                        <div class="class" in:fly|global={{y: 10, delay: 50*i+1}} style="background: {chooseColor(Class.class_id)}; height: {(timeParser(time)[1] - timeParser(time)[0])}px; top: {timeParser(time)[0] - 480}px;">
                            <div class="classContent">
                                <div class="coursename">{shorten(Class.course_name)} [{Class.section}]</div>
                                <div class="type">Type: {Class.type}</div>
                                <div class="room">Room: {Class.room}</div>
                                <div class="time">{time}</div>
                            </div>
                        </div>
                    {/each}
                </div>
                {/if}
            {/each}
        </div>
    </div>
    {/if}
</div>
{/if}

<style lang="scss">

    .wrapper{
        display: flex;
        gap: 10px;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 5px;
    }
    
    .classRoutine{
        display: flex;
        gap: 5px;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        padding-top: 30px;
        height: 100%;
        position: relative;

        .routine{
            display: flex;
            gap: 5px;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
            padding: 0px;
            height: 100%;
            overflow-x: scroll;
            width: 100%;
            position: relative;
            scrollbar-width: none;
            padding-bottom: 20px;
            padding-top: 30px;

            .day{
                position: relative;
                overflow: visible;
                width: 100px;
                z-index: 10;
                height: 810px;
                .dayname{
                    text-align: center;
                    width: 100%;
                    font-weight: bold;
                    padding: 1px;
                    position: absolute;
                    top: -28px;
                }
            }
        }
    }

    .timeline{
        padding-top: 30px;
        position: absolute;
        left: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .time{
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: flex-start;
            position: relative;
            width: 90%;
            height: 100%;
            height: 90px;
            overflow: visible;
            font-size: 0.5rem;
            border-top: 1px solid var(--label-color);
            .text{
                position: relative;
                left: -70px;
            }
        }
    }

    ::-webkit-scrollbar{
        display: none;
    }

    .class{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 10px;
        border-radius: 10px;
        width: 100px;
        font-size: 0.7rem;
        position: absolute;

        .classContent{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            overflow: scroll;
        }

        .time{
            font-size: 0.5rem;
        }
    }

	.dropdownlist{
		background: var(--light-dark);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 350px;
        gap: 20px;
	}

	
    select{
        width: 100%;
        height: 35px;
        background: var(--accent);
        outline: none;
        border: none;
        border-radius: 5px;
        color: aliceblue;
        text-align: center;
        cursor: pointer;
    }

</style>