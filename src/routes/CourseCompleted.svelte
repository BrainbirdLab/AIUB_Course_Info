<script lang="ts">
    import { completedCourses, CourseIconColors, parseCourseId, showGrade } from '$lib/store';
    import { fly } from 'svelte/transition';
</script>

<div class="title" in:fly={{x: 10}}>{Object.keys($completedCourses).length} Courses complete</div>
<div class="courses">
    {#if $completedCourses}
    {#each Object.entries($completedCourses) as [courseId, courseInfo], i}
        <div class="course" in:fly|global={{y: 10, delay: 50 * (i+1)}} style="background: {CourseIconColors[parseCourseId(courseId)].COLOR || 'var(--light-dark)'};">
            <div class="name"> {@html CourseIconColors[parseCourseId(courseId)].ICON || ''} {courseInfo.course_name}</div>
            <div class="metadata">
                <div class="credit">Credit: {courseInfo.credit || '-'}</div>
                <div class="grade">Grade:
                    {#if $showGrade} 
                    {courseInfo.grade}
                    {:else}
                    😭
                    {/if}
                </div>
                <div class="courseid">Course ID: {courseId}</div>
            </div>
        </div>
    {/each}
    {/if}
</div>