<script lang="ts">
    import { completedCourses, ICONS, parseCourseId } from '$lib/store';
    import { fly } from 'svelte/transition';
</script>

<div class="title" in:fly={{x: 10}}>Courses you have completed ({Object.keys($completedCourses).length})</div>
<div class="courses">
    {#if $completedCourses}
    {#each Object.entries($completedCourses) as [courseId, courseInfo], i}
        <div class="course" in:fly|global={{y: 10, delay: 50 * (i+1)}}>
            <div class="name"> {@html ICONS[parseCourseId(courseId)] || ''} {courseInfo.course_name}</div>
            <div class="metadata">
                <div class="credit">Course ID: {courseId}</div>
            </div>
        </div>
    {/each}
    {/if}
</div>