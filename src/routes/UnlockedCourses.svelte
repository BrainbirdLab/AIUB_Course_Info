
<script lang="ts">
    import { unlockedCourses, ICONS, parseCourseId } from '$lib/store';
    import { fly } from 'svelte/transition';
</script>


<div class="title" in:fly={{x: 10}}>Courses you can take next Semester ({Object.keys($unlockedCourses).length})</div>
<div class="courses">
    {#if $unlockedCourses}
    {#each Object.entries($unlockedCourses) as [courseId, courseInfo], i}
        <div class="course" in:fly|global={{y: 10, delay: 50*(i+1)}}>
            <div class="name"> {@html ICONS[parseCourseId(courseId)] || ''} {courseInfo.course_name} <div class="retake">{#if courseInfo.retake}(Retake){/if}</div></div>
            <div class="metadata">
                <div class="credit">Credit: {courseInfo.credit}</div>
                <div class="prerequisites">
                    Prerequisite: 
                    {#each courseInfo.prerequisites as prerequisite}
                        <div class="prerequisite">{prerequisite}</div>
                    {/each}
                </div>
            </div>
        </div>
    {/each}
    {/if}
</div>