<script lang="ts">
    import { completedCourses, CourseIconColors, parseCourseId, showGrade } from '$lib/store';
    import { fly } from 'svelte/transition';

    $: totalCredit = Object.values($completedCourses).reduce((acc, course) => acc + (course.credit || 0), 0);
</script>

{#if $completedCourses && Object.keys($completedCourses).length > 0}
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys($completedCourses).length} Courses {
        totalCredit > 0 && `(${totalCredit} Credits)`
    } </div>
    <div class="courses">
        {#each Object.entries($completedCourses) as [courseId, courseInfo], i}
            <div class="course" in:fly|global={{y: 10, delay: 50 * (i+1)}} style="background: {CourseIconColors[parseCourseId(courseId)].COLOR || 'var(--light-dark)'};">
                <div class="name"> {@html CourseIconColors[parseCourseId(courseId)].ICON || ''} {courseInfo.course_name}</div>
                <div class="metadata">
                    <div class="credit">Credit: {courseInfo.credit || '-'}</div>
                    <div class="grade">Grade:
                        {#if $showGrade} 
                        {courseInfo.grade}
                        {:else}
                        🙈
                        {/if}
                    </div>
                </div>
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