<script lang="ts">
    import { unlockedCourses, CourseIconColors, parseCourseId, creditsPrerequisitesObj, completedCourses, preregisteredCourses } from '$lib/store';
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

</script>

{#if $unlockedCourses && Object.keys($unlockedCourses).length > 0}
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys($unlockedCourses).length} Courses available</div>
    <div class="note" in:fade|global>Note: You may have to complete certain credits to take some courses</div>
    <div class="courses">
        {#each Object.entries($unlockedCourses) as [courseId, courseInfo], i}
            <div class="course" in:fly|global={{y: 10, delay: 50*(i+1)}}>
                <div class="courseid tag bookmark" style:background={CourseIconColors[parseCourseId(courseId)].COLOR}>
                    {@html CourseIconColors[parseCourseId(courseId)].ICON || ''} {courseId}
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
                            <div class="prerequisite tag" style:background={CourseIconColors[parseCourseId(prerequisite)].COLOR}>{@html CourseIconColors[parseCourseId(courseId)].ICON || ''} {prerequisite}</div>
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
