<script lang="ts">
    import { goto } from '$app/navigation';
    import { unlockedCourses, parseCourseId, creditsPrerequisitesObj, completedCourses, preregisteredCourses, getIconColor, getIcon, allCourses, showLogin } from '$lib/store';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';

    let loaded = $state(false);

    let creditsCompleted = $derived(Object.values($completedCourses).reduce((acc, course) => acc + (course.credit || 0), 0));

    $effect(() => {
        Object.keys($unlockedCourses).forEach((courseId) => {
            if (creditsPrerequisitesObj[courseId]) {
                if ((creditsPrerequisitesObj[courseId] > creditsCompleted)){
                    delete $unlockedCourses[courseId];
                }
            }
        });
    });


    const filterOptions: string[] = ['All', 'Registered', 'Unregistered'];

    let selectedGroup = $state("All");

    let observeables = $derived.by(() => {
        if (selectedGroup) {
            if (selectedGroup === 'Registered') {
                return Object.entries($unlockedCourses).filter(([courseId, _]) => $preregisteredCourses[courseId]);
            } else if (selectedGroup === 'Unregistered') {
                return Object.entries($unlockedCourses).filter(([courseId, _]) => !$preregisteredCourses[courseId]);
            } else {
                return Object.entries($unlockedCourses);
            }
        } else {
            return Object.entries($unlockedCourses);
        }
    });

    let filteredCourses = $derived.by(() => {
        if (filterValue) {
            return observeables.filter(([_, courseInfo]) => {
                return courseInfo.course_name.toLowerCase().includes(filterValue.toLowerCase());
            });
        } else {
            return observeables;
        }
    })
    
    let filterValue = $state('');

    onMount(() => {
        if ($showLogin){
            goto("/login");
        }
        loaded = true;
    });

</script>

{#if loaded}
<div class="filter">
    <!-- radio button -->
    {#each filterOptions as option, i}
        <div class="form-field" in:fly|global={{y: 5, delay: (i+1) * 50}}>
            <input type="radio" name="filter" id="{option}" value="{option}" bind:group={selectedGroup} />
            <label for="{option}" class="tag">
                {option}
            </label>
        </div>
    {/each}
</div>
{#if observeables && observeables.length > 0} 
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys($unlockedCourses).length} Courses available</div>
    <div class="search" in:fly|global={{x: 10}}>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" autocomplete="off" placeholder="Search courses..." bind:value={filterValue} />
        <button aria-label="close" class="clear" onclick={() => filterValue = ''}>
            <i class="fa-solid fa-times"></i>
        </button>
    </div>
    <div class="note" in:fade|global>Note: You may have to complete certain credits to take some courses</div>
    <div class="courses">
        {#if filteredCourses.length == 0}
            <div class="empty">No courses found</div>
        {:else}
        {#each filteredCourses as [courseId, courseInfo], i (courseId)}
        <div animate:flip={{duration: 300}} class="course" in:fly|global={{y: 10, delay: 50*(i+1)}}>
            <div class="courseid tag bookmark" style:background={getIconColor(parseCourseId(courseId))}>
                {@html getIcon(parseCourseId(courseId))} {courseId}
            </div>
            <div class="name">
                {courseInfo.course_name} 
                {#if courseInfo.retake}
                <div class="retake">
                    (Retake)
                </div>
                {/if}
                {#if $preregisteredCourses[courseId]}
                    <span class="registered tag">
                        Registered <i class="fa-solid fa-circle-check"></i>
                    </span>
                {/if}
            </div>
            <div class="credit" title="{courseInfo.credit || '-'} credit{courseInfo.credit > 1 ? "s" : ""}">
                {courseInfo.credit || '-'}
            </div>
            <span class="prerequisites">
                Prerequisites
                {#if courseInfo.prerequisites && courseInfo.prerequisites.length > 0}
                    {#each courseInfo.prerequisites as prerequisite}
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
    <div class="info no-course">No courses available</div>
{/if}
{/if}

<style lang="scss">

    .registered{
        background: #09bc65;
    }
  
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
    }
</style>
