<script lang="ts">
    import { goto } from "$app/navigation";
    import { completedCourses, parseCourseId, showLogin } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import { Chart, LineController, LineElement, PointElement, RadarController, RadialLinearScale, CategoryScale, LinearScale, Title, Tooltip, PieController, ArcElement, DoughnutController, BarController, BarElement } from 'chart.js';

    Chart.register(LineController, LineElement, PointElement, RadarController, RadialLinearScale, CategoryScale, LinearScale, Title, Tooltip, PieController, ArcElement, DoughnutController, BarController, BarElement);

    let loaded = false;
    let lineChart: Chart | null = null;
    let pieChart: Chart | null = null;
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
                CGPA: number;
            }
        },
        CGPA: number,
        gradeDistribution: { [key: string]: string[] },
    };

    let performance: Performance = {
        Stats: {},
        SemesterStats: {},
        CGPA: 0,
        gradeDistribution: {},
    };

    function calculatePerformance() {
        let totalCredits = 0;
        let totalGradePoints = 0;

        Object.entries(completedCourses.value).forEach(([courseId, course]) => {

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
                performance.gradeDistribution[course.grade] = [course.course_name];
            } else {
                performance.gradeDistribution[course.grade].push(course.course_name);
            }

        });

        performance.CGPA = totalGradePoints / totalCredits;

        // Compute semester CGPA
        Object.entries(performance.SemesterStats).forEach(([semester, stats]) => {
            stats.CGPA = stats.totalGradePoints / stats.totalCredits;
        });

        // Compute department average grades
        Object.entries(performance.Stats).forEach(([department, stats]) => {
            stats.averageGrade = stats.totalGradePoints / stats.totalCredits;
        });
    }

    function createCharts() {
        const lineElem = document.getElementById('performanceLineChart') as HTMLCanvasElement;
        const pieElem = document.getElementById('gradeDistributionChart') as HTMLCanvasElement;
        const doughnutElem = document.getElementById('gpaGaugeChart') as HTMLCanvasElement;
        const heatmapElem = document.getElementById('gradeHeatmapChart') as HTMLCanvasElement;
        const barElem = document.getElementById('departmentalPerformanceChart') as HTMLCanvasElement;

        if (!lineElem || !pieElem || !doughnutElem || !heatmapElem || !barElem) {
            console.log('Canvas elements not found');
            return;
        }

        const lineCtx = lineElem.getContext('2d');
        const pieCtx = pieElem.getContext('2d');
        const doughnutCtx = doughnutElem.getContext('2d');
        const heatmapCtx = heatmapElem.getContext('2d');
        const barCtx = barElem.getContext('2d');

        if (!lineCtx || !pieCtx || !doughnutCtx || !heatmapCtx || !barCtx) {
            console.log('Canvas contexts not found');
            return;
        }

        if (lineChart) {
            lineChart.destroy();
        }

        if (pieChart) {
            pieChart.destroy();
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

        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: Object.keys(performance.SemesterStats),
                datasets: [{
                    label: 'GPA',
                    data: Object.values(performance.SemesterStats).map(sem => sem.CGPA),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Semester-wise GPA Progression'
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

        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(performance.gradeDistribution),
                datasets: [
                    {
                        label: 'Grade Distribution',
                        data: Object.values(performance.gradeDistribution).map(arr => arr.length),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Grade Distribution'
                    }
                }
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
                        text: 'CGPA Gauge'
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
                        text: 'Departmental Performance'
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
    }

    onMount(() => {
        if (showLogin.value) {
            goto("/login");
            return;
        }

        loaded = true;

        calculatePerformance();

        setTimeout(() => {
            createCharts();
        }, 100);
    });
</script>

{#if loaded}
{#if Object.keys(performance.Stats).length > 0}
<div class="container">
    <h1>Academic performance</h1>
    <div class="charts">
        <div class="wrapper">
            <canvas id="performanceLineChart"></canvas>
        </div>
        <div class="wrapper">
            <canvas id="gradeDistributionChart"></canvas>
        </div>
        <div class="wrapper">
            <canvas id="gpaGaugeChart"></canvas>
        </div>
        <div class="wrapper">
            <canvas id="departmentalPerformanceChart"></canvas>
        </div>
        <div class="wrapper">
            <canvas id="gradeHeatmapChart"></canvas>
        </div>
    </div>
</div>
{:else}
<div class="container">
    <h1>No data available</h1>
</div>
{/if}
{/if}

<style lang="scss">
.container {
    padding: 20px;
}

h1 {
    text-align: center;
    font-size: 1rem;
    color: var(--title-color);
    margin-bottom: 20px;
}

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
