<script lang="ts">
    import { completedCourses, showLogin } from '$lib/store.svelte';
    import { fly } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import CourseCard from '../CourseCard.svelte';
    import Search from '../Search.svelte';

    let loaded = $state(false);

    let creditsCompleted = $derived(Object.values(completedCourses.value).reduce((acc, course) => acc + (course.credit || 0), 0));
    
    let filterValue = $state('');
    
    let filteredCourses = $derived.by(() => {
        if (filterValue) {
            return Object.entries(completedCourses.value).filter(([courseId, courseInfo]) => {
                return courseInfo.course_name.toLowerCase().includes(filterValue.toLowerCase());
            });
        } else {
            return Object.entries(completedCourses.value);
        }
    })

    onMount(() => {
        if (showLogin.value){
            goto("/login");
        }
        loaded = true;
    });

</script>
{#if loaded}
{#if completedCourses.value && Object.keys(completedCourses.value).length > 0}
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys(completedCourses.value).length} course{Object.keys(completedCourses.value).length > 1 ? "s" : ""}
        ({creditsCompleted} Credit{creditsCompleted > 1 ? "s" : ""})
    </div>
    <Search bind:filterValue={filterValue}/>
    <div class="courses">
        {#if filteredCourses.length == 0}
            <div class="empty">No courses found</div>
        {:else}
        {#each filteredCourses as [courseId, courseInfo], i (courseId)}
            <div class="course" animate:flip={{duration: 300}} in:fly|global={{y: 10, delay: 50 * (i+1)}}>
                <CourseCard courseId={courseId} cType="completed" grade={courseInfo.grade}/>
            </div>
        {/each}
        {/if}
    </div>
</div>
{:else}
    <div class="info no-course">No courses completed yet</div>
{/if}
{/if}

<style lang="scss">

    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        width: 100%;
    }

</style>