<script lang="ts">
    import { fly } from "svelte/transition";
    import { calculateTextPositions, chooseColor, getDayNumber, getLongestTime, shorten, timeParser, type ClassData } from "./classData.svelte";

    interface Props {
        classData: ClassData;
    }

    let { classData }: Props = $props();

    // SVG Constants
    const PADDING = 60;
    const DAY_WIDTH = 120;
    const TIME_HEIGHT = 90;

    let longestTimeEnd = $derived(getLongestTime(classData));
    let range: number[] = $derived(Array.from(Array(getLongestTime(classData)).keys()));

    // Calculate SVG dimensions
    let svgWidth = $derived(PADDING + (Object.keys(classData || {}).length * DAY_WIDTH));
    let svgHeight = $derived(PADDING + (longestTimeEnd * TIME_HEIGHT));

    // Inline styles
    const styles = {
        timeLabel: 'fill: var(--label-color); font-size: 8px;',
        dayLabel: 'fill: var(--label-color); font-weight: bold; font-size: 1rem;',
        classText: 'fill: white; font-size: 0.7rem; dominant-baseline: middle;',
        roomText: 'fill: white; font-size: 0.7rem; dominant-baseline: middle;',
        timeText: 'fill: white; font-size: 0.6rem; dominant-baseline: middle;',
    };

</script>

<svg 
    id="schedule-svg"
    width={svgWidth} 
    height={svgHeight}
    viewBox="0 0 {svgWidth} {svgHeight}"
    style="background: white;"
>
    <!-- Time grid lines and labels remain the same -->
    {#each range as i}
        <line 
            x1={PADDING} 
            y1={PADDING + (i * TIME_HEIGHT)} 
            x2={svgWidth} 
            y2={PADDING + (i * TIME_HEIGHT)}
            stroke="#5b72892e"
            stroke-width="2"
            in:fly|global={{y: 10, delay: 50*(i+1)}}
        />
        <text 
            x={PADDING - 5} 
            y={PADDING + (i * TIME_HEIGHT) - 5}
            text-anchor="end"
            style={styles.timeLabel}
            in:fly|global={{y: 10, delay: 50*(i+1)}}
        >
            {i == 0 ? '8:00 am' : i == 1 ? '9:30 am' : i == 2 ? '11:00 am' : 
                i == 3 ? '12:30 pm' : i == 4 ? '2:00 pm' : i == 5 ? '3:30 pm' : 
                i == 6 ? '5:00 pm' : i == 7 ? '6:30 pm' : i == 8 ? '8:00 pm' : '9:30 pm'}
        </text>
    {/each}

    <!-- Days and Classes -->
    {#each Object.entries(classData).sort((a, b) => getDayNumber(a[0]) - getDayNumber(b[0])) as [day, classInfo], dayIndex}
        {#if classInfo != null}
            <!-- Day column background -->
            <rect 
                x={PADDING + (dayIndex * DAY_WIDTH)}
                y={PADDING}
                width={DAY_WIDTH}
                height={svgHeight - PADDING}
                fill="transparent"
                rx="5"
                in:fly|global={{y: 10, delay: 50*(dayIndex+1)}}
            />
            
            <!-- Day label -->
            <text 
                x={PADDING + (dayIndex * DAY_WIDTH) + (DAY_WIDTH / 2)}
                y={PADDING - 10}
                text-anchor="middle"
                style={styles.dayLabel}
                in:fly|global={{y: 10, delay: 50*(dayIndex+1)}}
            >
                {day}
            </text>

            <!-- Classes -->
            {#each Object.entries(classInfo) as [time, Class], classIndex}
                {@const [startTime, endTime] = timeParser(time)}
                {@const yPos = PADDING + ((startTime - 480) / 90 * TIME_HEIGHT)}
                {@const height = ((endTime - startTime) / 90 * TIME_HEIGHT) - 1}
                {@const textPositions = calculateTextPositions(yPos, height)}
                <g 
                    in:fly|global={{y: 10, delay: 10*classIndex+1}}
                    class="class-group"
                >
                    <rect 
                        x={PADDING + (dayIndex * DAY_WIDTH) + 5}
                        y={yPos}
                        width={DAY_WIDTH - 10}
                        height={height}
                        fill={chooseColor(Class.class_id)}
                        rx="10"
                        class="class-box"
                    />
                    
                    <text 
                        x={PADDING + (dayIndex * DAY_WIDTH) + (DAY_WIDTH / 2)}
                        y={textPositions.courseNameY}
                        text-anchor="middle"
                        style={styles.classText}
                    >
                        {shorten(Class.course_name)} [{Class.section}]
                    </text>
                    
                    <text 
                        x={PADDING + (dayIndex * DAY_WIDTH) + (DAY_WIDTH / 2)}
                        y={textPositions.roomY}
                        text-anchor="middle"
                        style={styles.roomText}
                    >
                        Room: {Class.room}
                    </text>
                    
                    <text 
                        x={PADDING + (dayIndex * DAY_WIDTH) + (DAY_WIDTH / 2)}
                        y={textPositions.timeY}
                        text-anchor="middle"
                        style={styles.timeText}
                    >
                        {time}
                    </text>
                </g>
            {/each}
        {/if}
    {/each}
</svg>
