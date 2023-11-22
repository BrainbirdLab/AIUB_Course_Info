
<script lang="ts">
    import { unlockedCourses, ICONS, parseCourseId } from '$lib/store';
    import { fly } from 'svelte/transition';
</script>


<div class="title" in:fly={{x: 10}}>{Object.keys($unlockedCourses).length} Courses are ready to take</div>
<div class="courses">
    {#if $unlockedCourses}
    {#each Object.entries($unlockedCourses) as [courseId, courseInfo], i}
        <div class="course" in:fly|global={{y: 10, delay: 50*(i+1)}}>
            <div class="name"> {@html ICONS[parseCourseId(courseId)] || ''} {courseInfo.course_name} <div class="retake">{#if courseInfo.retake}(Retake){/if}</div></div>
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