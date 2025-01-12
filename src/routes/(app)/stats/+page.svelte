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

    const gradeColorMap = new Map<string, { bg: string; border: string }>([
        ['A+', { bg: 'rgba(76, 175, 80, 0.4)', border: 'rgba(76, 175, 80, 1)' }], // Green shades
        ['A', { bg: 'rgba(102, 187, 106, 0.4)', border: 'rgba(102, 187, 106, 1)' }], // Lighter green
        ['B+', { bg: 'rgba(255, 167, 38, 0.4)', border: 'rgba(255, 167, 38, 1)' }], // Orange shades
        ['B', { bg: 'rgba(255, 183, 77, 0.4)', border: 'rgba(255, 183, 77, 1)' }], // Lighter orange
        ['C+', { bg: 'rgba(255, 235, 59, 0.4)', border: 'rgba(255, 235, 59, 1)' }], // Yellow shades
        ['C', { bg: 'rgba(255, 241, 118, 0.4)', border: 'rgba(255, 241, 118, 1)' }], // Lighter yellow
        ['D+', { bg: 'rgba(244, 67, 54, 0.4)', border: 'rgba(244, 67, 54, 1)' }], // Red shades
        ['D', { bg: 'rgba(239, 83, 80, 0.4)', border: 'rgba(239, 83, 80, 1)' }], // Lighter red
        ['F', { bg: 'rgba(176, 190, 197, 0.4)', border: 'rgba(176, 190, 197, 1)' }] // Grey shades
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
                    tension: 0.3
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
                            stepSize: 10
                        }
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
                    borderWidth: 2
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

        const ng = Object.entries(performance.gradeDistribution).sort((a, b) => {
            return gradeMap.get(b[0])! - gradeMap.get(a[0])!;
        }).map(([grade, count]) => {
            return { grade, count };
        });

        console.log(ng);

        heatmapChart = new Chart(heatmapCtx, {
            type: 'bar',
            data: {
                labels: ng.map(ng => ng.grade),
                datasets: [{
                    label: 'Grade Distribution',
                    data: ng.map(ng => ng.count),
                    backgroundColor: ng.map(ng => {
                        return gradeColorMap.get(ng.grade)?.bg || 'rgba(255, 99, 132, 0.6)';
                    }),
                    borderColor: ng.map(ng => {
                        return gradeColorMap.get(ng.grade)?.border || 'rgba(255, 99, 132, 1)';
                    }),
                    borderWidth: 2
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
