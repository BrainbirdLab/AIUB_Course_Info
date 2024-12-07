<script lang="ts">
    import { goto } from '$app/navigation';
    import { unlockedCourses, creditsPrerequisitesObj, completedCourses, preregisteredCourses, showLogin } from '$lib/store.svelte';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';
    import CourseCard from '../CourseCard.svelte';
    import Search from '../Search.svelte';

    let loaded = $state(false);

    let creditsCompleted = $derived(Object.values(completedCourses.value).reduce((acc, course) => acc + (course.credit || 0), 0));

    $effect(() => {
        Object.keys(unlockedCourses.value).forEach((courseId) => {
            if (creditsPrerequisitesObj[courseId]) {
                if ((creditsPrerequisitesObj[courseId] > creditsCompleted)){
                    delete unlockedCourses.value[courseId];
                }
            }
        });
    });


    const filterOptions: string[] = ['All', 'Registered', 'Unregistered'];

    let selectedGroup = $state("All");

    let observeables = $derived.by(() => {
        if (selectedGroup) {
            if (selectedGroup === 'Registered') {
                return Object.entries(unlockedCourses.value).filter(([courseId, _]) => preregisteredCourses.value[courseId]);
            } else if (selectedGroup === 'Unregistered') {
                return Object.entries(unlockedCourses.value).filter(([courseId, _]) => !preregisteredCourses.value[courseId]);
            } else {
                return Object.entries(unlockedCourses.value);
            }
        } else {
            return Object.entries(unlockedCourses.value);
        }
    });

    let filteredCourses = $derived.by(() => {
        if (filterValue) {
            return observeables.filter(([_, courseInfo]) => {
                return courseInfo.course_name.toLowerCase().includes(filterValue.toLowerCase());
            });
        } else {
            return observeables;
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
<div class="filter">
    <!-- radio button -->
    {#each filterOptions as option, i}
        <div class="form-field" in:fly|global={{y: 5, delay: (i+1) * 50}}>
            <input type="radio" name="filter" id="{option}" value="{option}" bind:group={selectedGroup} />
            <label for="{option}" class="tag">
                {option}
            </label>
        </div>
    {/each}
</div>
{#if observeables && observeables.length > 0} 
<div class="container">
    <div class="title" in:fly|global={{x: -10}}>{Object.keys(unlockedCourses.value).length} Courses available</div>
    <Search bind:filterValue={filterValue}/>
    <div class="note" in:fade|global>Note: You may have to complete certain credits to take some courses</div>
    <div class="courses">
        {#if filteredCourses.length == 0}
            <div class="empty">No courses found</div>
        {:else}
        {#each filteredCourses as [courseId, courseInfo], i (courseId)}
        <div animate:flip={{duration: 300}} class="course" in:fly|global={{y: 10, delay: 50*(i+1)}}>
            <CourseCard courseId={courseId} courseInfo={courseInfo} cType="unlocked"/>
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
