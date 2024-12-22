<script lang="ts">

    import { parseCourseId, getIconColor, getIcon, allCourses, preregisteredCourses, showGrade, type CompletedCoursesType, type CourseType } from '$lib/store.svelte';

    interface Props {
        courseId: string;
        cType: 'unlocked' | 'completed' | 'all';
        grade?: string;
        retake?: boolean;
    }

    let { courseId, cType, grade, retake }: Props = $props();

    let course = $derived(allCourses.value[courseId]);

</script>

<div class="courseid tag bookmark" style:background={getIconColor(parseCourseId(courseId))}>
    {@html getIcon(parseCourseId(courseId))} {courseId}
</div>
<div class="name">
    {course.course_name} 
    {#if retake}
    <div class="retake">
        (Retake)
    </div>
    {/if}
    {#if cType == 'unlocked' && preregisteredCourses.value[courseId]}
        <span class="registered tag">
            Registered <i class="fa-solid fa-circle-check"></i>
        </span>
    {/if}
</div>
<div class="credit" title="{course.credit || '-'} credit{course.credit > 1 ? "s" : ""}">
    {course.credit || '-'}
</div>
{#if cType == 'completed'}
    <div class="grade">Grade: {showGrade.value ? grade : '🙈'}</div>
{/if}
<span class="prerequisites">
    Prerequisites:
    {#if course.prerequisites && course.prerequisites.length > 0}
        {#each course.prerequisites as prerequisite}
        <div class="prerequisite tag" data-prereq={prerequisite} style:background={getIconColor(parseCourseId(prerequisite))}>
            {#if allCourses.value[prerequisite]}
                <div class="prerequisiteInfo">
                    {allCourses.value[prerequisite].course_name}
                </div>
            {/if}
            {@html getIcon(parseCourseId(prerequisite))} {prerequisite}
        </div>
        {/each}
    {:else}
        <div class="prerequisite tag" style:background={"#398982"}>N/A</div>
    {/if}
</span>

<style lang="scss">
    .registered{
        background: #09bc65;
    }
</style>