
<script lang="ts">
    import { unlockedCourses, CourseIconColors, parseCourseId } from '$lib/store';
    import { fade, fly } from 'svelte/transition';
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
                <div class="name"> {@html CourseIconColors[parseCourseId(courseId)].ICON || ''} {courseInfo.course_name} <div class="retake">{#if courseInfo.retake}(Retake){/if}</div></div>
                <div class="metadata">
                    <div class="credit">Credit: {courseInfo.credit}</div>
                    <div class="prerequisites">
                        Prerequisites
                        {#if courseInfo.prerequisites && courseInfo.prerequisites.length > 0}
                            {#each courseInfo.prerequisites as prerequisite}
                                <div class="prerequisite tag" style:background={CourseIconColors[parseCourseId(courseId)].COLOR}>{prerequisite}</div>
                            {/each}
                        {:else}
                            <div class="prerequisite tag" style:background={"#398982"}>None</div>
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

<style>
  
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