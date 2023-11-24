
<script lang="ts">
    import { unlockedCourses, CourseIconColors, parseCourseId } from '$lib/store';
    import { fly } from 'svelte/transition';
</script>


<div class="title" in:fly={{x: 10}}>{Object.keys($unlockedCourses).length} Courses are ready to take</div>
<div class="note">Note: You may have to complete certain credits to take some courses</div>
<div class="courses">
    {#if $unlockedCourses}
    {#each Object.entries($unlockedCourses) as [courseId, courseInfo], i}
        <div class="course" in:fly|global={{y: 10, delay: 50*(i+1)}} style="background: {CourseIconColors[parseCourseId(courseId)].COLOR || 'var(--light-dark)'};">
            <div class="name"> {@html CourseIconColors[parseCourseId(courseId)].ICON || ''} {courseInfo.course_name} <div class="retake">{#if courseInfo.retake}(Retake){/if}</div></div>
            <div class="metadata">
                <div class="credit">Credit: {courseInfo.credit}</div>
                <div class="prerequisites">
                    {#if courseInfo.prerequisites && courseInfo.prerequisites.length > 0}
                    Prerequisite: &#91;
                    {#each courseInfo.prerequisites as prerequisite, i}
                        <div class="prerequisite">{prerequisite} {i < courseInfo.prerequisites.length - 1 ? ',' : ''}</div>
                    {/each}
                    &#93;
                    {:else}
                    Prerequisite: None
                    {/if}
                </div>
            </div>
        </div>
    {/each}
    {/if}
</div>

<style>
    .note{
        font-size: 0.7rem;
    }
</style>