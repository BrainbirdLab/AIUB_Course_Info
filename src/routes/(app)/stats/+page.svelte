<script lang="ts">
    import { goto } from "$app/navigation";
    import { completedCourses, parseCourseId, semesterClassRoutine, showLogin, type CompletedCoursesType } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import { Chart, LineController, LineElement, PointElement, RadarController, RadialLinearScale, CategoryScale, LinearScale, Title, Tooltip, ArcElement, DoughnutController, BarController, BarElement, ScatterController, Filler } from 'chart.js';
    import { loadData } from "$lib/loader";
    import { fly } from "svelte/transition";

    Chart.register(LineController, LineElement, PointElement, RadarController, RadialLinearScale, CategoryScale, LinearScale, Title, Tooltip, ArcElement, DoughnutController, BarController, BarElement, ScatterController, Filler);

    let loaded = false;
    let lineChart: Chart | null = null;
    let doughnutChart: Chart | null = null;
    let scatterChart: Chart | null = null;
    let barChart: Chart | null = null;

    const gradeMap = new Map<string, number>([
        ['A+', 4.00],
        ['A', 3.75],
        ['B+', 3.50],
        ['B', 3.25],
        ['C+', 3.00],
        ['C', 2.75],
        ['D+', 2.50],
        ['D', 2.25],
        ['F', 0.00]
    ]);

    const gradeColorMap = new Map<string, { bg: string; border: string }>([
        ['A+', { bg: 'hsl(120, 50%, 35%)', border: 'hsl(120, 70%, 50%)' }], // Rich green
        ['A', { bg: 'hsl(120, 45%, 40%)', border: 'hsl(120, 65%, 55%)' }],
        ['B+', { bg: 'hsl(30, 50%, 45%)', border: 'hsl(30, 70%, 60%)' }], // Warm orange
        ['B', { bg: 'hsl(30, 45%, 50%)', border: 'hsl(30, 65%, 65%)' }],
        ['C+', { bg: 'hsl(60, 50%, 40%)', border: 'hsl(60, 70%, 55%)' }], // Bright yellow
        ['C', { bg: 'hsl(60, 45%, 45%)', border: 'hsl(60, 65%, 60%)' }],
        ['D+', { bg: 'hsl(0, 50%, 40%)', border: 'hsl(0, 70%, 55%)' }], // Deep red
        ['D', { bg: 'hsl(0, 45%, 45%)', border: 'hsl(0, 65%, 60%)' }],
        ['F', { bg: 'hsl(210, 30%, 40%)', border: 'hsl(210, 50%, 50%)' }]  // Cool grey-blue
    ]);

    function pointToGrade(point: number): string {
        switch (true) {
            case point >= 4.00:
                return 'A+';
            case point >= 3.75:
                return 'A';
            case point >= 3.50:
                return 'B+';
            case point >= 3.25:
                return 'B';
            case point >= 3.00:
                return 'C+';
            case point >= 2.75:
                return 'C';
            case point >= 2.50:
                return 'D+';
            case point >= 2.25:
                return 'D';
            default:
                return 'F';
        }
    }

    const titleColor = "#bfd1de";
    const gridColor = "#344754";

    type Performance = {
        Stats: {
            [key: string]: {
                totalCourses: number;
                totalCredits: number;
                totalGradePoints: number;
                averageGrade: number;
            }
        },
        SemesterStats: {
            [semester: string]: {
                totalCourses: number;
                totalCredits: number;
                totalGradePoints: number;
                GPA: number;
                CGPA: number;
            }
        },
        CGPA: number,
        gradeDistribution: { [key: string]: number },
    };

    let performance: Performance = {
        Stats: {},
        SemesterStats: {},
        CGPA: 0,
        gradeDistribution: {},
    };

    onMount(() => {
        if (showLogin.value) {
            goto("/login");
            return;
        }

        loadData();

        loaded = true;
        createData(completedCourses.value);

        completedCourses.onChange((courses) => {
            createData(courses);
        });
    });

    function createData(courses: CompletedCoursesType) {
        let totalCredits = 0;
        let totalGradePoints = 0;

        //reset performance data
        performance = {
            Stats: {},
            SemesterStats: {},
            CGPA: 0,
            gradeDistribution: {},
        };

        Object.entries(courses).forEach(([courseId, course]) => {

            if (!course.semester) {
                return;
            }

            let department = parseCourseId(courseId);
            if (!performance.Stats[department]) {
                performance.Stats[department] = {
                    totalCourses: 0,
                    totalCredits: 0,
                    totalGradePoints: 0,
                    averageGrade: 0
                };
            }

            if (!performance.SemesterStats[course.semester]) {
                performance.SemesterStats[course.semester] = {
                    totalCourses: 0,
                    totalCredits: 0,
                    totalGradePoints: 0,
                    GPA: 0,
                    CGPA: 0
                };
            }

            let gp = (gradeMap.get(course.grade || 'F') || 0) * (course.credit || 0);
            performance.Stats[department].totalCourses++;
            performance.Stats[department].totalCredits += course.credit || 0;
            performance.Stats[department].totalGradePoints += gp;

            totalCredits += course.credit || 0;
            totalGradePoints += gp;
            performance.SemesterStats[course.semester].totalCourses++;
            performance.SemesterStats[course.semester].totalCredits += course.credit || 0;
            performance.SemesterStats[course.semester].totalGradePoints += gp;
            if (!performance.gradeDistribution[course.grade]) {
                performance.gradeDistribution[course.grade] = 0;
            }
            performance.gradeDistribution[course.grade]++;
        });

        //sort semesters
        const sems = sortSemesters(Object.keys(performance.SemesterStats));
        
        performance.CGPA = totalGradePoints / totalCredits;

        let totalCreditsSoFar = 0;
        let totalGradePointsSoFar = 0;

        sems.forEach((semesterName) => {
            const stats = performance.SemesterStats[semesterName];
            stats.GPA = stats.totalGradePoints / stats.totalCredits;
            totalCreditsSoFar += stats.totalCredits;
            totalGradePointsSoFar += stats.totalGradePoints;
            stats.CGPA = totalGradePointsSoFar / totalCreditsSoFar;
        });

        // Compute department average grades
        Object.entries(performance.Stats).forEach(([department, stats]) => {
            stats.averageGrade = stats.totalGradePoints / stats.totalCredits;
        });

        setTimeout(() => {
            createCharts();
        }, 100);
    }

    //sort semesters
    function sortSemesters(semesters: string[]): string[] {
        const sems = Object.keys(semesterClassRoutine.value);
        //sort based on the sems array order
        return semesters.sort((a, b) => sems.indexOf(a) - sems.indexOf(b));
    }

    function createCharts() {
        const lineElem = document.getElementById('performanceLineChart') as HTMLCanvasElement;
        const doughnutElem = document.getElementById('gpaGaugeChart') as HTMLCanvasElement;
        const scatterElem = document.getElementById('gradeHeatmapChart') as HTMLCanvasElement;
        const barElem = document.getElementById('departmentalPerformanceChart') as HTMLCanvasElement;

        if (!lineElem || !doughnutElem || !scatterElem || !barElem) {
            console.log('Canvas elements not found');
            return;
        }

        const lineCtx = lineElem.getContext('2d');
        const doughnutCtx = doughnutElem.getContext('2d');
        const scatterCtx = scatterElem.getContext('2d');
        const barCtx = barElem.getContext('2d');

        if (!lineCtx || !doughnutCtx || !scatterCtx || !barCtx) {
            console.log('Canvas contexts not found');
            return;
        }

        if (lineChart) {
            lineChart.destroy();
        }

        if (doughnutChart) {
            doughnutChart.destroy();
        }

        if (scatterChart) {
            scatterChart.destroy();
        }

        if (barChart) {
            barChart.destroy();
        }

        function minScale(): number {
            let min = 4;
            //minimum of both GPA and CGPA
            Object.values(performance.SemesterStats).forEach(stats => {
                min = Math.min(min, stats.GPA, stats.CGPA);
            });
            return min - 0.5;
        }

        const semesters = sortSemesters(Object.keys(performance.SemesterStats));

        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: semesters,
                datasets: [
                {
                    label: 'CGPA',
                    data: semesters.map(semester => performance.SemesterStats[semester].CGPA),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'GPA',
                    data: semesters.map(semester => performance.SemesterStats[semester].GPA),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.3
                }, 
            ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Semester-wise CGPA Progression',
                        color: titleColor,
                    },
                    legend: {
                        display: true,
                        labels: {
                            color: titleColor
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4.5,
                        min: minScale(),
                        position: 'left',
                        ticks: {
                            stepSize: 10,
                            color: titleColor,
                        },
                        grid: {
                            color: gridColor,
                        },
                    },
                    x: {
                        ticks: {
                            color: titleColor,
                        },
                        grid: {
                            color: gridColor,
                        }
                    }
                },
                transitions: {
                    show: {
                        animations: {
                            x: {
                                from: 'label',
                            },
                            y: {
                                from: 'bottom',
                            }
                        }
                    }
                },
            }
        });

        doughnutChart = new Chart(doughnutCtx, {
            type: 'doughnut',
            data: {
                labels: ['CGPA', 'Remaining'],
                datasets: [
                    {
                        label: 'CGPA Gauge',
                        data: [performance.CGPA, 4 - performance.CGPA],
                        // remaining color is teal, the cg will be the color of the grade
                        backgroundColor: [gradeColorMap.get(pointToGrade(performance.CGPA))?.bg || 'rgba(255, 99, 132, 0.6)', 'rgba(0, 150, 136, 0.6)'],
                        borderColor: [gradeColorMap.get(pointToGrade(performance.CGPA))?.border || 'rgba(255, 99, 132, 1)', 'rgba(0, 150, 136, 1)'],
                        borderWidth: 2
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'CGPA Gauge',
                        color: titleColor,
                    }
                },
                cutout: '35%'
            }
        });

        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(performance.Stats),
                datasets: [{
                    label: 'Average Grade',
                    data: Object.values(performance.Stats).map(dept => dept.averageGrade),
                    backgroundColor: Object.values(performance.Stats).map(dept => {
                        let grade = pointToGrade(dept.averageGrade);
                        return gradeColorMap.get(grade)?.bg || 'rgba(255, 99, 132, 0.6)';
                    }),
                    borderColor: Object.values(performance.Stats).map(dept => {
                        let grade = pointToGrade(dept.averageGrade);
                        return gradeColorMap.get(grade)?.border || 'rgba(255, 99, 132, 1)';
                    }),
                    borderWidth: 2,
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Departmental Performance',
                        color: titleColor,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4,
                        grid: {
                            color: gridColor,
                            z: -1,
                        },
                        ticks: {
                            color: titleColor,
                        },
                    },
                    x: {
                        grid: {
                            color: gridColor,
                            z: -1,
                        },
                        ticks: {
                            color: titleColor,
                        },
                    }
                }
            }
        });

        const scatterData = Object.entries(completedCourses.value).map(([_, course]) => {
            return {
                x: course.course_name,
                y: course.grade,
                label: course.course_name
            };
        });

        scatterChart = new Chart(scatterCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Course Grades',
                    data: scatterData,
                    backgroundColor: scatterData.map(data => {
                        return gradeColorMap.get(data.y)?.bg || 'rgba(255, 99, 132, 0.6)';
                    }),
                    borderColor: scatterData.map(data => {
                        return gradeColorMap.get(data.y)?.border || 'rgba(255, 99, 132, 1)';
                    }),
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Course Grades',
                        color: titleColor,
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: { raw: { x: string, y: string, label: string } }) {
                                const raw = context.raw;
                                return `${raw.label}: ${raw.y}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Courses',
                            color: titleColor,
                        },
                        labels: scatterData.map(data => data.x),
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 30,
                            display: false,
                            color: titleColor,
                        },
                        grid: {
                            color: gridColor,
                        },
                    },
                    y: {
                        type: 'category',
                        title: {
                            display: true,
                            text: 'Grade',
                            color: titleColor,
                        },
                        labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
                        ticks: {
                            display: true,
                            color: titleColor,
                        },
                        grid: {
                            color: gridColor,
                        }
                    }
                }
            }
        } as any);
    }
</script>

{#if loaded}
{#if Object.keys(performance.Stats).length > 0}
<div class="container">
    <div class="charts">
        <div class="semesterWizeGradeSheet" in:fly|global={{x: 5, duration: 200, delay: 100}}>
            <table>
                <thead>
                    <tr>
                        <th>Semester</th>
                        <th>Total Courses</th>
                        <th>Total Credits</th>
                        <th>Total Grade Points</th>
                        <th>GPA</th>
                        <th>CGPA</th>
                    </tr>
                </thead>
                <tbody>
                    {#each Object.entries(performance.SemesterStats).sort((a, b) => a[0].localeCompare(b[0])) as [semester, stats], i (semester)}
                    <tr>
                        <td>{semester}</td>
                        <td>{stats.totalCourses}</td>
                        <td>{stats.totalCredits}</td>
                        <td>{stats.totalGradePoints.toFixed(2)}</td>
                        <td>{stats.GPA.toFixed(2)}</td>
                        <td>{stats.CGPA.toFixed(2)}</td>
                    </tr>
                    {/each}
                </tbody>
                <caption>
                    Semester-wise Grade Sheet
                </caption>
            </table>
        </div>
        <div class="wrapper">
            <canvas id="performanceLineChart"></canvas>
        </div>
        <div class="wrapper">
            <canvas id="gpaGaugeChart"></canvas>
        </div>
        <div class="wrapper">
            <canvas id="gradeHeatmapChart"></canvas>
        </div>
        <div class="wrapper">
            <canvas id="departmentalPerformanceChart"></canvas>
        </div>
    </div>
</div>
{:else}
    <div class="info no-course">No data available</div>
{/if}
{/if}

<style lang="scss">
    .charts {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        gap: 20px;
        align-items: center;
    }

    caption {
        font-size: 0.8rem;
        color: var(--title-color);
        font-weight: bold;
        padding: 5px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        padding: 10px;
    }

    tr, th, td {
        border: 1px solid #344754;
        padding: 4px;
        font-size: 0.8rem;
    }

    th {
        background: #2cbac04a;
        color: var(--background-color);
    }

    td {
        background: var(--background-color);
        color: var(--title-color);
    }

    //last bottom right cell is the cgpa, hightlight it
    tr:last-child td:last-child {
        background: #2cbac04a;
    }

    .wrapper {
        width: 100%;
        max-width: 500px;
    }

    canvas {
        margin: 20px;
    }
</style>