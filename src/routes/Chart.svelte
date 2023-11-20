<script lang="ts">
    import { type Class, Colors, ColorsMap } from "$lib/store";
    import { onMount } from "svelte";

    export let classInfo: Record<string, Class>;

    export let day: string;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    const currentTime = new Date();
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const today = currentTime.toLocaleDateString('en-US', { weekday: 'long' });

    let size = 0;

    onMount(() => {
        canvas.height = canvas.offsetHeight * 2;
        canvas.width = canvas.offsetWidth * 2;

        size = canvas.height * 0.35;

        if (today == day) {
            canvas.style.border = "3px solid var(--accent)";
        }


        ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        //make a circle in the middle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, size, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(15 38 54)";
        ctx.fill();
        ctx.closePath();

        fillCircleText(day + ' ' + day + ' ' + day + ' ' + day + ' ' + day + ' ' + day + ' ', canvas.width / 2, canvas.height / 2, size + size*0.2, 0);
        
        Object.entries(classInfo).forEach(([time, cls]) => {
            drawPart(time, cls);
        });

    });

    function fillCircleText(text: string, x: number, y: number, radius: number, startAngle: number){
        const numRadsPerLetter = 2*Math.PI / text.length;
        ctx.font = `${size / 8}px Arial`;
        ctx.fillStyle = "white";
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(startAngle);

        for (let i = 0; i < text.length; i++){
        ctx.save();
        ctx.rotate(i*numRadsPerLetter);
        ctx.fillText(text[i], 0, -radius);
        ctx.restore();
        }
        ctx.restore();
    }

    function chooseColor() {
        const index = Math.floor(Math.random() * ($Colors.length - 1));
        const color = $Colors[index];
        //AvailableColors.splice(index, 1);
        Colors.update((colors) => {
            colors.splice(index, 1);
            return colors;
        });
        return color;
    }

    function drawPart(time: string, classInfo: Class) {
        //console.log(time, classInfo);
        //make an arc from 8:00 to 9:30
        const [start, end] = timeParser(time);

        //console.log(classInfo.course_name);

        if (!$ColorsMap.has(classInfo.course_name)) {
            //ColorsMap.set(classInfo.course_name, chooseColor());
            ColorsMap.update((colors) => {
                colors.set(classInfo.course_name, chooseColor());
                return colors;
            });
        }

        const color = $ColorsMap.get(classInfo.course_name) as string;

        //draw an arc from 0deg to 90deg from the center of the circle to make a slice of the pie
        const startAngle = ((start / 2) * Math.PI) / 180 - Math.PI / 2;
        const endAngle = ((end / 2) * Math.PI) / 180 - Math.PI / 2;

        const xCord = canvas.width / 2;
        const yCord = canvas.height / 2;

        //const radius = size + size * 0.1;

        //if time is within time now, set the radius to be size + size * 0.1, else set it to be size
        const radius = today == day && (start <= currentMinutes && currentMinutes <= end) ? size + size * 0.1 : size;

        const course = shorten(titleCase(classInfo.course_name));
        const section = classInfo.section;
        const type = classInfo.type;
        //draw the filled arc on a layer and then draw the text on top of it. This is to avoid the text being cut off by other arcs
        ctx.globalCompositeOperation = "lighten";
        fillTimeClock(startAngle, endAngle, color, xCord, yCord, radius);
        ctx.globalCompositeOperation = "source-over";

        const RANGE = 0.7;
        //draw text in the middle of the arc
        const textX = xCord + (radius*RANGE * Math.cos((startAngle + endAngle) * 0.5));
        const textY = yCord + (radius*RANGE * Math.sin((startAngle + endAngle) * 0.5));

        drawText(`${course} [${section}]`, textX, textY - size/10, "white");
        drawText(type, textX, textY, "white");
        drawText(time, textX, textY + size/10, "white");
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

    function titleCase(str: string) {
        const temp = str.toLowerCase().split(" ");
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
        }
        return temp.join(' ');
    }

    function shorten(str: string){
        if (str.length > 15) {
            return str.split(' ').map((word) => word.toLowerCase() != 'lab' ? word.toLowerCase().replace('to', '')[0] : ` ${word}`).join('').toUpperCase();
        }
        return str;
    }

    function fillTimeClock(startAngle: number, endAngle: number, color: string, xCord: number, yCord: number, radius: number) {
        ctx.beginPath();
        ctx.arc(xCord, yCord, radius, startAngle, endAngle);
        ctx.lineTo(xCord, yCord);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawText(text: string, xCord: number, yCord: number, color: string) {
        ctx.font = `${size / 13}px Arial`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(text, xCord, yCord);
    }

</script>

<canvas bind:this={canvas} />

<style lang="scss">
    canvas {
        background: rgb(21, 49, 68);
        border-radius: 20px;
        box-shadow: 3px 3px 5px #00000030;
        max-width: 90vw;
        width: 500px;
        aspect-ratio: 1/0.7;
    }
</style>
