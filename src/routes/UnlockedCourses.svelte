<script lang="ts">
    import { unlockedCourses, parseCourseId, creditsPrerequisitesObj, completedCourses, preregisteredCourses, getIconColor, getIcon, allCourses } from '$lib/store';
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';

    $: creditsCompleted = Object.values($completedCourses).reduce((acc, course) => acc + (course.credit || 0), 0);

    $: {
        Object.keys($unlockedCourses).forEach((courseId) => {
            if (creditsPrerequisitesObj[courseId]) {
                if ((creditsPrerequisitesObj[courseId] > creditsCompleted)){
                    delete $unlockedCourses[courseId];
                }
            }
        });
    }


    const filterOptions: string[] = ['All', 'Registered', 'Unregistered'];

    let selectedGroup = "All";

    $: observeables = Object.entries($unlockedCourses);

    $: filteredCourses = observeables;

    let filterValue = '';

    $: {
        if (selectedGroup) {
            if (selectedGroup === 'Registered') {
                observeables = Object.entries($unlockedCourses).filter(([courseId, courseInfo]) => $preregisteredCourses[courseId]);
            } else if (selectedGroup === 'Unregistered') {
                observeables = Object.entries($unlockedCourses).filter(([courseId, courseInfo]) => !$preregisteredCourses[courseId]);
            } else {
                observeables = Object.entries($unlockedCourses);
            }
        }
    }


    $: {
        if (filterValue) {
            filteredCourses = observeables.filter(([courseId, courseInfo]) => {
                return courseInfo.course_name.toLowerCase().includes(filterValue.toLowerCase());
            });
        } else {
            filteredCourses = observeables;
        }
    }

</script>

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
        <input type="text" autocomplete="off" placeholder="Search courses" bind:value={filterValue} />
        <button class="clear" on:click={() => filterValue = ''}>
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

<style lang="scss">

    .prerequisite:hover .prerequisiteInfo{
        visibility: visible;
        opacity: 1;
        bottom: 24px;
    }
    
    .prerequisiteInfo {
        position: absolute;
        padding: 10px;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 8px;
        bottom: 23px;
        width: min-content;
        visibility: hidden;
        opacity: 0;
        transition: 200ms ease-in-out;
        bottom: 20px;
        left: 0;

        &::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 15px;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.7803921569) transparent transparent transparent;
        }
    }

    .registered{
        background: #09bc65;
    }

    .filter{
        display: flex;
        justify-content: center;
        gap: 10px;
        margin: 10px;

        .form-field{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            cursor: pointer;
        }

        .tag{
            background: var(--light-dark);
            color: #ffffff5a;
            cursor: pointer; 
        }

        input{
            display: none;
        }

        input:checked + label{
            background: var(--accent-dim);
            color: var(--accent);
        }

        input:not(:checked) + label:hover{
            background: var(--hover-light-dark);
        }
    }
  
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
    }

    .note{
        font-size: 0.7rem;
        text-align: center;
        padding: 10px;
        color: var(--label-color);
    }
</style>
