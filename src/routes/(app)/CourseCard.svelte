<script lang="ts">

    import { parseCourseId, getIconColor, getIcon, allCourses, preregisteredCourses, showGrade, type CompletedCoursesType } from '$lib/store.svelte';

    interface Props {
        courseId: string;
        courseInfo: {
            course_name: string;
            credit: number;
            prerequisites: string[];
            retake?: boolean;
            grade?: string;
        };
        cType: 'unlocked' | 'completed' | 'all';
    }

    let { courseId, courseInfo, cType }: Props = $props();

</script>

<div class="courseid tag bookmark" style:background={getIconColor(parseCourseId(courseId))}>
    {@html getIcon(parseCourseId(courseId))} {courseId}
</div>
<div class="name">
    {courseInfo.course_name} 
    {#if cType == 'unlocked' && courseInfo.retake}
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
<div class="credit" title="{courseInfo.credit || '-'} credit{courseInfo.credit > 1 ? "s" : ""}">
    {courseInfo.credit || '-'}
</div>
{#if cType == 'completed'}
    <div class="grade">Grade: {showGrade.value ? courseInfo.grade : '🙈'}</div>
{/if}
<span class="prerequisites">
    Prerequisites: 
    {#if allCourses.value[courseId].prerequisites && allCourses.value[courseId].prerequisites.length > 0}
        {#each allCourses.value[courseId].prerequisites as prerequisite}
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