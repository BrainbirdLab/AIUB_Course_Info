<script lang="ts">
    import { completedCourses, getIcon, getIconColor, parseCourseId, showGrade, type CourseType } from '$lib/store';
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    $: creditsCompleted = Object.values($completedCourses).reduce((acc, course) => acc + (course.credit || 0), 0);

    let filteredCourses = Object.entries($completedCourses);

    let filterValue = '';

    $: {
        if (filterValue) {
            filteredCourses = Object.entries($completedCourses).filter(([courseId, courseInfo]) => {
                return courseInfo.course_name.toLowerCase().includes(filterValue.toLowerCase());
            });
        } else {
            filteredCourses = Object.entries($completedCourses);
        }
    }

</script>

{#if $completedCourses && Object.keys($completedCourses).length > 0}
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys($completedCourses).length} Courses {
        creditsCompleted > 0 && `(${creditsCompleted} Credits)`
    } </div>
    <div class="search" in:fly|global={{x: 10}}>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" autocomplete="off" placeholder="Search courses" bind:value={filterValue}/>
        <button class="clear" on:click={() => filterValue = ''}>
            <i class="fa-solid fa-times"></i>
        </button>
    </div>
    <div class="courses">
        {#if filteredCourses.length == 0}
            <div class="empty">No courses found</div>
        {:else}
        {#each filteredCourses as [courseId, courseInfo], i (courseId)}
            <div class="course" animate:flip={{duration: 300}} in:fly|global={{y: 10, delay: 50 * (i+1)}}>
                <div class="courseid tag bookmark" style:background={getIconColor(parseCourseId(courseId))}>
                    {@html getIcon(parseCourseId(courseId))} {courseId}
                </div>
                <div class="name">{courseInfo.course_name}</div>
                <div class="credit" title="{courseInfo.credit || '-'} credit{courseInfo.credit > 1 ? "s" : ""}">
                    {courseInfo.credit || '-'}
                </div>
                <div class="grade">Grade: {$showGrade ? courseInfo.grade : '🙈'}</div>
            </div>
        {/each}
        {/if}
    </div>
</div>
{:else}
    <div class="info no-course">No courses completed yet</div>
{/if}

<style lang="scss">

    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        width: 100%;
    }

</style>