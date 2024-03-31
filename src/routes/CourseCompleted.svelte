<script lang="ts">
    import { completedCourses, CourseIconColors, parseCourseId, showGrade } from '$lib/store';
    import { fly } from 'svelte/transition';

    $: creditsCompleted = Object.values($completedCourses).reduce((acc, course) => acc + (course.credit || 0), 0) + 100;

</script>

{#if $completedCourses && Object.keys($completedCourses).length > 0}
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys($completedCourses).length} Courses {
        creditsCompleted > 0 && `(${creditsCompleted} Credits)`
    } </div>
    <div class="courses">
        {#each Object.entries($completedCourses) as [courseId, courseInfo], i}
            <div class="course" in:fly|global={{y: 10, delay: 50 * (i+1)}}>
                <div class="courseid tag bookmark" style:background={CourseIconColors[parseCourseId(courseId)].COLOR}>
                    {@html CourseIconColors[parseCourseId(courseId)].ICON || ''} {courseId}
                </div>
                <div class="name">{courseInfo.course_name}</div>
                <div class="credit" title="{courseInfo.credit || '-'} credits">
                    {courseInfo.credit || '-'}
                </div>
                <div class="grade">Grade: {$showGrade ? courseInfo.grade : '🙈'}</div>
            </div>
        {/each}
    </div>
</div>
{:else}
    <div class="info no-course">No courses available</div>
{/if}

<style lang="scss">

    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>