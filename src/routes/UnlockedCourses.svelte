<script lang="ts">
    import { unlockedCourses, parseCourseId, creditsPrerequisitesObj, completedCourses, preregisteredCourses, getIconColor, getIcon } from '$lib/store';
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

    let unlockedCoursesArray = Object.entries($unlockedCourses);

    $: {
        if (selectedGroup) {
            if (selectedGroup === 'Registered') {
                unlockedCoursesArray = Object.entries($unlockedCourses).filter(([courseId, courseInfo]) => $preregisteredCourses[courseId]);
            } else if (selectedGroup === 'Unregistered') {
                unlockedCoursesArray = Object.entries($unlockedCourses).filter(([courseId, courseInfo]) => !$preregisteredCourses[courseId]);
            } else {
                unlockedCoursesArray = Object.entries($unlockedCourses);
            }
        }
    }

</script>

<div class="filter">
    <!-- radio button -->
    {#each filterOptions as option}
        <div class="form-field">
            <input type="radio" name="filter" id="{option}" value="{option}" bind:group={selectedGroup} />
            <label for="{option}" class="tag">
                {option}
            </label>
        </div>
    {/each}
</div>

{#if unlockedCoursesArray && unlockedCoursesArray.length > 0}
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys($unlockedCourses).length} Courses available</div>
    <div class="note" in:fade|global>Note: You may have to complete certain credits to take some courses</div>
    <div class="courses">
        {#each unlockedCoursesArray as [courseId, courseInfo], i (courseId)}
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
                <div class="credit" title="{courseInfo.credit || '-'} credits">
                    {courseInfo.credit || '-'}
                </div>
                <span class="prerequisites">
                    Prerequisites
                    {#if courseInfo.prerequisites && courseInfo.prerequisites.length > 0}
                        {#each courseInfo.prerequisites as prerequisite}
                            <div class="prerequisite tag" style:background={getIconColor(parseCourseId(prerequisite))}>{@html getIcon(parseCourseId(prerequisite))} {prerequisite}</div>
                        {/each}
                    {:else}
                        <div class="prerequisite tag" style:background={"#398982"}>None</div>
                    {/if}
                </span>
            </div>
        {/each}
    </div>
</div>
{:else}
    <div class="info no-course">No courses available</div>
{/if}

<style lang="scss">

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
        justify-content: center;
    }

    .note{
        font-size: 0.7rem;
        text-align: center;
        padding: 10px;
        color: tomato;
    }
</style>
