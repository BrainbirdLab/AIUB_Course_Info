<script lang="ts">
    import { goto } from '$app/navigation';
    import { unlockedCourses, preregisteredCourses, showLogin, allCourses } from '$lib/store.svelte';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';
    import CourseCard from '../CourseCard.svelte';
    import Search from '../Search.svelte';

    let loaded = $state(false);

    let filteredCourses = $derived.by(() => {
        if (filterValue) {
            return Object.entries(allCourses.value).filter(([courseId, courseInfo]) => {
                return courseInfo.course_name.toLowerCase().includes(filterValue.toLowerCase());
            });
        } else {
            return Object.entries(allCourses.value);
        }
    })
    
    let filterValue = $state('');

    onMount(() => {
        if (showLogin.value){
            goto("/login");
        }
        loaded = true;
    });

</script>

{#if loaded}
{#if Object.keys(allCourses.value).length > 0}
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys(allCourses.value).length} Courses</div>
    <Search bind:filterValue={filterValue}/>
    <div class="note" in:fade|global>Note: Courses shown below are based on course prerequisite criteria only</div>
    <div class="courses">
        {#if filteredCourses.length == 0}
            <div class="empty">No courses found</div>
        {:else}
        {#each filteredCourses as [courseId, courseInfo], i (courseId)}
        <div animate:flip={{duration: 300}} class="course" in:fly|global={{y: 10, delay: 50*(i+1)}}>
            <CourseCard courseId={courseId} cType="unlocked"/>
        </div>
        {/each}
        {/if}
    </div>
</div>
{:else}
    <div class="info no-course">No courses available</div>
{/if}
{/if}

<style lang="scss">

  .container{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
  }
</style>