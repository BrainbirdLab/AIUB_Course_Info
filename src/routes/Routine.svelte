<script lang="ts">
    import { semesterClassRoutine, semesterName, getColors } from "$lib/store";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";

    let mounted = false;

    let classData: {[day: string]: {
        [timeslot: string]: {
            class_id: string,
            course_name: string,
            section: string,
            room: string
        }
    }} = $semesterClassRoutine[$semesterName];

    let range: number[] = [];

    //Day name today. Eg: Saturday
    const today = new Date().toLocaleString('en-us', {  weekday: 'long' });

    let longestTimeEnd = 0;

    $: {
        classData = $semesterClassRoutine[$semesterName];
        //find the longest time end and make the range accordingly
        if (classData) {
            longestTimeEnd = 0;
            for (const day in classData) {
                for (const time in classData[day]) {
                    const timeEnd = timeParser(time)[1];
                    if (timeEnd > longestTimeEnd) {
                        longestTimeEnd = timeEnd;
                    }
                }
            }
            longestTimeEnd = Math.ceil((longestTimeEnd - 480) / 90) + 1;
            range = Array.from(Array(longestTimeEnd).keys());
            //console.log(longestTimeEnd);
        }
    }


    function getDayNumber(day: string) {
		const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
		return daysOfWeek.indexOf(day);
	}

    function timeParser(timeRange: string): [number, number] {
        const times = timeRange.split("-").map((time) => time.trim());
        const startTime = parseTime(times[0]);
        const endTime = parseTime(times[1]);
        const startMinutes = startTime[0] * 60 + startTime[1];
        const endMinutes = endTime[0] * 60 + endTime[1];
        return [startMinutes, endMinutes];
    }

    function parseTime(timeStr: string): [number, number] {
        const match = timeStr.match(/(\d+):(\d+)\s+(AM|PM)/i);
        if (!match) {
            throw new Error("Invalid time format");
        }
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        if (hours === 12) {
            hours = period === "AM" ? 0 : 12;
        } else {
            hours += period === "PM" ? 12 : 0;
        }
        return [hours, minutes];
    }

    let AvailableColors = getColors();

    let ColorsMap = new Map<string, string>();

    function chooseColor(classId: string) {
        if (ColorsMap.has(classId)) {
            return ColorsMap.get(classId);
        } else {
            const color = AvailableColors[Math.floor(Math.random() * AvailableColors.length)];
            ColorsMap.set(classId, color);
            //remove the color from the available colors
            AvailableColors.splice(AvailableColors.indexOf(color), 1);
            return color;
        }
    }

    function shorten(str: string){
        if (str.length > 15) {
            //ignore words inside brackets like [lab] [Fst/Fe] [FASS] 
            str = str.replace(/\[.*?\]/g, '');
            return str.split(' ').map((word) => word.toLowerCase() != 'lab' ? word.toLowerCase().replace('to', '')[0] : ` ${word}`).join('').toUpperCase();
        }
        return str;
    }

    onMount(() => {
        mounted = true;
    });


    function handleSelect(node: HTMLSelectElement){
        node.onchange = () => {
            localStorage.setItem('semester', node.value);
            //reset the available colors
            AvailableColors = getColors();
            ColorsMap = new Map<string, string>();
            semesterName.set(node.value);
        }
    }

</script>


{#if mounted}
<div class="wrapper" in:fade>
    {#if classData}
    <div class="title" in:fly|global={{y: -10, duration: 200, delay: 100}}>Your class routine</div>
    <div class="dropdownlist" in:fly|global={{y: 10, duration: 200, delay: 150}}>
        <select use:handleSelect value={$semesterName}>
            <option value="" selected disabled>Select Semester</option>
            {#if $semesterClassRoutine}
                {#each Object.keys($semesterClassRoutine) as sem, i (sem)}
                    <option value={sem}>Semester: {i+1} - {sem}</option>
                {/each}
            {/if}
        </select>
    </div>
    <div class="classRoutine" out:fade={{duration: 50, delay: 0}}>
        {#key $semesterName}
        <div class="timeline">
            {#each range as i (i)}
            <div class="time">
                <!-- Have am/pm -->
                    <div class="text" in:fly|global={{y: 10, delay: 50*(i+1)}}>
                        {i == 0 ? '8:00 am' : i == 1 ? '9:30 am' : i == 2 ? '11:00 am' : i == 3 ? '12:30 pm' : i == 4 ? '2:00 pm' : i == 5 ? '3:30 pm' : i == 6 ? '5:00 pm' : i == 7 ? '6:30 pm' : i == 8 ? '8:00 pm' : '9:30 pm'}
                    </div>
                </div>
                {/each}
            </div>
            <div class="routine">
            {#each Object.entries(classData).sort((a, b) => getDayNumber(a[0]) - getDayNumber(b[0])) as [day, classInfo], i (day)}
                {#if classInfo != null}
                <div class="day" style="height: {(longestTimeEnd * 90) - 90}px;" class:focused={day == today} in:fly|global={{y: 10, delay: 50*(i+1)}}>
                    <div class="dayname">{day}</div>
                    {#each Object.entries(classInfo) as [time, Class], i}
                    <div class="class" in:fly|global={{y: 10, delay: 10*i+1}} style="background: {chooseColor(Class.class_id)}; height: {(timeParser(time)[1] - timeParser(time)[0] - 1)}px; top: {timeParser(time)[0] - 479}px;">
                        <div class="toolTip">
                            {Class.course_name}
                        </div>
                        <div class="classContent">
                            <div class="coursename">{shorten(Class.course_name)} [{Class.section}]</div>
                            <div class="room">Room: {Class.room}</div>
                            <div class="time">{time}</div>
                        </div>
                    </div>
                    {/each}
                </div>
                {/if}
            {/each}
        </div>
        {/key}
    </div>
    {/if}
</div>
{/if}

<style lang="scss">
    .wrapper{
        display: flex;
        gap: 10px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 15px;
        max-width: 100vw;
    }
    
    .classRoutine{
        display: flex;
        gap: 5px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 60px 0px 20px 60px;
        height: 100%;
        position: relative;
        width: 100%;

        .routine{
            display: flex;
            gap: 5px;
            flex-direction: row;
            justify-content: flex-start;
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
                width: 120px;
                z-index: 10;

                &.focused{
                    background: #ffffff14;
                    border-radius: 5px;
                }
                .dayname{
                    text-align: center;
                    width: 120px;
                    font-weight: bold;
                    padding: 1px;
                    position: relative;
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
            width: 100%;
            height: 100%;
            height: 90px;
            overflow: visible;
            font-size: 0.5rem;
            border-top: 2px solid #5b72892e;
            .text{
                position: relative;
                left: 0;
                margin-top: -15px;
                background: var(--primary);
                padding: 5px;
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
        width: 100%;
        font-size: 0.7rem;
        position: absolute;
        cursor: pointer;

        .classContent{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            overflow: scroll;
            word-wrap: break-word;
        }

        .time{
            font-size: 0.6rem;
        }

        &:hover{
            .toolTip{
                visibility: visible;
                opacity: 1;
                top: -20px;
            }
        }
    }

	.dropdownlist{
		background: var(--light-dark);
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
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