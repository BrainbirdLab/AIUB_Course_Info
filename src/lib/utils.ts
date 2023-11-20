
export function timeParser(timeRange: string): [number, number] {
    const times = timeRange.split("-").map((time) => time.trim());
    const startTime = times[0];
    const endTime = times[1];
    const start = new Date("1970-01-01 " + startTime);
    const end = new Date("1970-01-01 " + endTime);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    return [startMinutes, endMinutes];
}

export function titleCase(str: string) {
    const temp = str.toLowerCase().split(' ');
    for (var i = 0; i < temp.length; i++) {
        temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
    }
    return temp.join(' ');
}


/**
 * @param {string} day
 * @param {string} time
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} xCord
 * @param {number} yCord
 * @param {number} radius
 */
function drawPie(data, day, time, ctx, xCord, yCord, radius) {
    const courseInfo = data[day][time];
    const courseName = courseInfo['course_name'];

    if (!UnusedColors[courseName]) {
        const color = chooseColor();
        UnusedColors[courseName] = color;
    }

    let [startMinutes, endMinutes] = timeParser(time);

    // fill area between start and end time
    const startAngle = ((startMinutes / 2) * Math.PI) / 180 - Math.PI / 2;
    const endAngle = ((endMinutes / 2) * Math.PI) / 180 - Math.PI / 2;

    fillTimeClock(
        startAngle,
        endAngle,
        UnusedColors[courseName],
        ctx,
        xCord,
        yCord,
        radius
    );
}

function drawLabel(data, day, time, ctx, xCord, yCord, radius) {
    const courseInfo = data[day][time];
    const courseName = courseInfo['course_name'];

    if (!UnusedColors[courseName]) {
        const color = chooseColor();
        UnusedColors[courseName] = color;
    }

    let [startMinutes, endMinutes] = timeParser(time);

    // fill area between start and end time
    const startAngle = ((startMinutes / 2) * Math.PI) / 180 - Math.PI / 2;
    const endAngle = ((endMinutes / 2) * Math.PI) / 180 - Math.PI / 2;

    writeLabel(
        courseInfo,
        time,
        startAngle,
        endAngle,
        ctx,
        xCord,
        yCord,
        radius
    );
}


function fillTimeClock(
    startAngle: number,
    endAngle: number,
    color: any,
    ctx: CanvasRenderingContext2D,
    xCord: number,
    yCord: number,
    radius: number
) {
    ctx.beginPath();
    ctx.arc(xCord, yCord, radius, startAngle, endAngle);
    ctx.lineTo(xCord, yCord);
    ctx.fillStyle = color;
    ctx.fill();
}

CanvasRenderingContext2D.prototype.fillTextCircle = function (text: string, x: number, y: number, radius: number, startAngle: number) {
    const numRadsPerLetter = 2 * Math.PI / text.length;
    this.save();
    this.translate(x, y);
    this.rotate(startAngle);

    for (let i = 0; i < text.length; i++) {
        this.save();
        this.rotate(i * numRadsPerLetter);
        this.fillText(text[i], 0, -radius);
        this.restore();
    }
}

let errorText = "",
    errorClass = "";

let charts: any;

let __DATA__ = {};

const AvailableColors =  [
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

const UnusedColors = {
    Free: "#000800aa",
    Break: "#077518",
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday"];

let colorsArray = Array.from(Object.values(UnusedColors));

let canvasResolution = 1080;

let font_size = 30;

function init() {
    console.log("%cInitializing Charts", "color: deepskyblue;");
    localStorage.setItem("sm", btoa(selectedSemester));
    //sort data by day sunday - wednesday
    const data = {};
    charts.innerHTML = '';
    colorsArray = [...AvailableColors];
    for (let i = 0; i < DAYS.length; i++) {
        if (__DATA__[selectedSemester][DAYS[i]]) {
            data[DAYS[i]] = __DATA__[selectedSemester][DAYS[i]];
        }
    }

    const today = new Date().toLocaleString("en-us", { weekday: "long" });

    Object.keys(data).forEach((day) => {

        const canvas = document.createElement("canvas");
        canvas.id = day;
        if (day == today) {
            canvas.style.border = "3px solid deepskyblue";
        } else {
            canvas.style.border = "3px solid #00000000";
        }
        charts.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        ctx.globalCompositeOperation = "source-over";

        canvas.height = canvasResolution;
        canvas.width = canvasResolution * 1.3;

        canvas.style.height = `${canvasSize}px`;
        canvas.style.width = `${canvasSize * 1.3}px`;

        const xCord = canvas.width / 2;
        const yCord = canvas.height / 2;

        const radius = canvasResolution / 3;

        ctx.beginPath();
        ctx.arc(xCord, yCord, radius, 0, (360 * Math.PI) / 180);
        ctx.lineTo(xCord, yCord);
        ctx.fillStyle = "#0f2636";
        ctx.fill();

        Object.keys(data[day]).forEach(async (time) => {
            drawPie(data, day, time, ctx, xCord, yCord, radius);
        });

        Object.keys(data[day]).forEach((time) => {
            drawLabel(data, day, time, ctx, xCord, yCord, radius);
        });

        //write the day name
        ctx.fillStyle = "#bdf";
        ctx.font = `${font_size}px Arial`;
        ctx.textAlign = "center";

        ctx.fillText(day, xCord, canvas.height - font_size);
    });
}

function chooseColor() {
    const index = Math.floor(Math.random() * (colorsArray.length - 1));
    const color = colorsArray[index];
    colorsArray.splice(index, 1);
    return color;
}


function writeLabel(
    courseInfo: any[],
    Time: string,
    startAngle: number,
    endAngle: number,
    ctx: CanvasRenderingContext2D,
    xCord: number,
    yCord: number,
    radius: number
) {
    ctx.fillStyle = "#bdf";
    ctx.font = `${font_size / 2.5}px Arial`;
    ctx.textAlign = "center";

    let courseName = courseInfo['course_name'];
    if (courseName.length > 15) {
        //short each word
        courseName = courseName.split(' ').map((word => {
            if (word.includes('-') || word.includes('(') || word.includes(')') || word.includes('[') || word.includes(']')) {
                return word;
            } else {
                if (word.toUpperCase() != 'TO') {
                    if (word.toUpperCase() != 'LAB') {
                        return word[0];
                    } else {
                        return ` ${word}`;
                    }
                }
            }
        })).join('');
    }
    courseName = `${courseName} [${courseInfo['section']}]`;

    ctx.fillText(
        courseName,
        xCord + radius * Math.cos((startAngle + endAngle) / 2),
        yCord + radius * Math.sin((startAngle + endAngle) / 2)
    );
    if (courseInfo) {
        ctx.fillText(
            `Room: ${courseInfo['room']} [${courseInfo['type']}]`,
            xCord + radius * Math.cos((startAngle + endAngle) / 2),
            yCord + radius * Math.sin((startAngle + endAngle) / 2) + font_size / 2
        );
        ctx.fillText(
            Time,
            xCord + radius * Math.cos((startAngle + endAngle) / 2),
            yCord + radius * Math.sin((startAngle + endAngle) / 2) + font_size
        );
    } else {
        ctx.fillText(
            Time,
            xCord + radius * Math.cos((startAngle + endAngle) / 2),
            yCord + radius * Math.sin((startAngle + endAngle) / 2) + font_size * 2
        );
    }

}