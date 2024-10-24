<script lang="ts">
    import { allCourses, completedCourses, getIcon, getIconColor, parseCourseId, showGrade, showLogin } from '$lib/store';
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let loaded = $state(false);

    let creditsCompleted = $derived(Object.values($completedCourses).reduce((acc, course) => acc + (course.credit || 0), 0));

    
    let filterValue = $state('');
    
    let filteredCourses = $derived.by(() => {
        if (filterValue) {
            return Object.entries($completedCourses).filter(([courseId, courseInfo]) => {
                return courseInfo.course_name.toLowerCase().includes(filterValue.toLowerCase());
            });
        } else {
            return Object.entries($completedCourses);
        }
    })

    onMount(() => {
        if ($showLogin){
            goto("/login");
        }
        loaded = true;
    });

</script>
{#if loaded}
{#if $completedCourses && Object.keys($completedCourses).length > 0}
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys($completedCourses).length} Courses {
        creditsCompleted > 0 && `(${creditsCompleted} Credits)`
    } </div>
    <div class="search" in:fly|global={{x: 10}}>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" autocomplete="off" placeholder="Search courses..." bind:value={filterValue}/>
        <button class="clear" aria-label="clear" onclick={() => filterValue = ''}>
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
                <span class="prerequisites">
                    Prerequisites
                    {#if $allCourses[courseId].prerequisites && $allCourses[courseId].prerequisites.length > 0}
                        {#each $allCourses[courseId].prerequisites as prerequisite}
                        <div class="prerequisite tag" data-prereq={prerequisite} style:background={getIconColor(parseCourseId(prerequisite))}>
                            {#if $allCourses[prerequisite]}
                                <div class="prerequisiteInfo">
                                    {$allCourses[prerequisite].course_name}
                                </div>
                            {/if}
                            {@html getIcon(parseCourseId(prerequisite))} {prerequisite}
                        </div>
                        {/each}
                    {:else}
                        <div class="prerequisite tag" style:background={"#398982"}>None</div>
                    {/if}
                </span>
            </div>
        {/each}
        {/if}
    </div>
</div>
{:else}
    <div class="info no-course">No courses completed yet</div>
{/if}
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