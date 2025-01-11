import { getColors } from "$lib/store.svelte";

export interface ClassData {
    [day: string]: {
        [timeslot: string]: {
            class_id: string,
            course_name: string,
            section: string,
            room: string
        }
    }
}

export function getLongestTime(classData: ClassData) {
    if (!classData) return 0;
    let longestTime = 0;
    for (const day in classData) {
        for (const time in classData[day]) {
            const timeEnd = timeParser(time)[1];
            if (timeEnd > longestTime) longestTime = timeEnd;
        }
    }
    return Math.ceil((longestTime - 480) / 90) + 1;
}

export function getDayNumber(day: string) {
    const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return daysOfWeek.indexOf(day);
}

export function timeParser(timeRange: string): [number, number] {
    const times = timeRange.split("-").map((time) => time.trim());
    const startTime = parseTime(times[0]);
    const endTime = parseTime(times[1]);
    const startMinutes = startTime[0] * 60 + startTime[1];
    const endMinutes = endTime[0] * 60 + endTime[1];
    return [startMinutes, endMinutes];
}

export function parseTime(timeStr: string): [number, number] {
    const match = RegExp(/(\d+):(\d+)\s+(AM|PM)/i).exec(timeStr);
    if (!match) throw new Error("Invalid time format");
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
const ColorsMap = new Map<string, string>();

export function resetColors() {
    // Clear the existing color mappings
    ColorsMap.clear();
    // Reset available colors to initial state
    AvailableColors = getColors();
}

export function getColorsMap() {
    return ColorsMap;
}

export function chooseColor(classId: string) {
    // If color already assigned, return it
    if (ColorsMap.has(classId)) {
        return ColorsMap.get(classId);
    }

    // If no colors left, reset the available colors
    if (AvailableColors.length === 0) {
        AvailableColors = getColors();
    }

    // Choose a random color from remaining available colors
    const randomIndex = Math.floor(Math.random() * AvailableColors.length);
    const color = AvailableColors[randomIndex];
    
    // Store the color mapping
    ColorsMap.set(classId, color);
    
    // Remove the chosen color from available colors
    AvailableColors = AvailableColors.filter((color, _) => color !== AvailableColors[randomIndex]);

    return color;
}

export function shorten(str: string) {
    if (str.length > 15) {
        str = str.replace(/\[.*?\]/g, '');
        return str.split(' ')
            .map((word) => word.toLowerCase() != 'lab' ? word.toLowerCase().replace('to', '')[0] : ` ${word}`)
            .join('')
            .toUpperCase();
    }
    return str;
}

export function calculateTextPositions(yPos: number, height: number) {
    const centerY = yPos + (height / 2);
    return {
        courseNameY: centerY - 15,  // Course name slightly above center
        roomY: centerY,         // Room in the middle
        timeY: centerY + 15         // Time slightly below center
    };
}