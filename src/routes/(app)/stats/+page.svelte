<script lang="ts">
    import { goto } from "$app/navigation";
    import { completedCourses, parseCourseId, semesterClassRoutine, showLogin, type CompletedCoursesType } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import { Chart, LineController, LineElement, PointElement, RadarController, RadialLinearScale, CategoryScale, LinearScale, Title, Tooltip, ArcElement, DoughnutController, BarController, BarElement } from 'chart.js';

    Chart.register(LineController, LineElement, PointElement, RadarController, RadialLinearScale, CategoryScale, LinearScale, Title, Tooltip, ArcElement, DoughnutController, BarController, BarElement);

    let loaded = false;
    let lineChart: Chart | null = null;
    let doughnutChart: Chart | null = null;
    let heatmapChart: Chart | null = null;
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

    const titleColor = "#bfd1de";

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

        // Compute semester GPAs and incrementally compute CGPA
        // Object.entries(performance.SemesterStats).forEach(([semester, stats]) => {
        //     stats.GPA = stats.totalGradePoints / stats.totalCredits;

        // });

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
        const heatmapElem = document.getElementById('gradeHeatmapChart') as HTMLCanvasElement;
        const barElem = document.getElementById('departmentalPerformanceChart') as HTMLCanvasElement;

        if (!lineElem || !doughnutElem || !heatmapElem || !barElem) {
            console.log('Canvas elements not found');
            return;
        }

        const lineCtx = lineElem.getContext('2d');
        const doughnutCtx = doughnutElem.getContext('2d');
        const heatmapCtx = heatmapElem.getContext('2d');
        const barCtx = barElem.getContext('2d');

        if (!lineCtx || !doughnutCtx || !heatmapCtx || !barCtx) {
            console.log('Canvas contexts not found');
            return;
        }

        if (lineChart) {
            lineChart.destroy();
        }

        if (doughnutChart) {
            doughnutChart.destroy();
        }

        if (heatmapChart) {
            heatmapChart.destroy();
        }

        if (barChart) {
            barChart.destroy();
        }

        const semesters = sortSemesters(Object.keys(performance.SemesterStats));

        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: semesters,
                datasets: [{
                    label: 'GPA',
                    data: semesters.map(semester => performance.SemesterStats[semester].GPA),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.3
                }, {
                    label: 'CGPA',
                    data: semesters.map(semester => performance.SemesterStats[semester].CGPA),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
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
                        position: 'left',
                    },
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
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 99, 132, 0.2)',
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
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
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
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
                        max: 4
                    }
                }
            }
        });

        heatmapChart = new Chart(heatmapCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(performance.gradeDistribution),
                datasets: [{
                    data: Object.values(performance.gradeDistribution).map(count => count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Grade Heatmap',
                        color: titleColor,
                    }
                }
            }
        });
    }

</script>

{#if loaded}
{#if Object.keys(performance.Stats).length > 0}
<div class="container">
    <div class="charts">
        <div class="wrapper">
            <canvas id="gpaGaugeChart"></canvas>
        </div>
        <div class="wrapper">
            <canvas id="performanceLineChart"></canvas>
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

.wrapper {
    width: 100%;
    max-width: 500px;
}

canvas {
    margin: 20px;
}
</style>
