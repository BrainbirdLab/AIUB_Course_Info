<script lang="ts">
    import { goto } from '$app/navigation';
    import { unlockedCourses, creditsPrerequisitesObj, completedCourses, preregisteredCourses, showLogin, allCourses } from '$lib/store.svelte';
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

    let registeredCourses = $derived(Object.entries(unlockedCourses.value).filter(([courseId, _]) => preregisteredCourses.value[courseId]));

    let registeredCoursesCount = $derived(Object.keys(registeredCourses).length);

    let registeredCoursesCredits = $derived(Object.values(registeredCourses).reduce((acc, [courseId, _]) => acc + (allCourses.value[courseId]?.credit || 0), 0));

    let totalCredits = $derived(Object.values(unlockedCourses.value).reduce((acc, course) => acc + (course.credit || 0), 0));

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
    <div class="title" in:fly|global={{x: -10}}>
        Unlocked: {Object.keys(unlockedCourses.value).length} Course{Object.keys(unlockedCourses.value).length > 1 ? 's' : ''} ({totalCredits} Credit{totalCredits > 1 ? 's' : ''})
    </div>
    <div class="extra" in:fly|global={{y: 3, delay: 100, duration: 500}}>
        {#if Object.keys(registeredCourses).length > 0}
            Registered: {Object.keys(registeredCourses).length} course{registeredCoursesCount > 1 ? 's' : ''} ({registeredCoursesCredits} credit{registeredCoursesCredits > 1 ? 's' : ''})
            <br>
            Remaining: {Object.keys(unlockedCourses.value).length - registeredCoursesCount} course{Object.keys(unlockedCourses.value).length - registeredCoursesCount > 1 ? 's' : ''} ({totalCredits - registeredCoursesCredits} credit{totalCredits - registeredCoursesCredits > 1 ? 's' : ''})
        {/if}
    </div>
    <Search bind:filterValue={filterValue}/>
    <div class="note" in:fade|global>Note: Courses shown below are based on course prerequisite criteria only</div>
    <div class="courses">
        {#if filteredCourses.length == 0}
            <div class="empty">No courses found</div>
        {:else}
        {#each filteredCourses as [courseId, courseInfo], i (courseId)}
        <div animate:flip={{duration: 300}} class="course" in:fly|global={{y: 10, delay: 50*(i+1)}}>
            <CourseCard courseId={courseId} cType="unlocked" retake={courseInfo.retake}/>
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

    .extra {
        margin-top: -20px;
        padding: 0 10px 10px;
        text-align: center;
        font-size: 0.8rem;
        color: var(--label-color);
    }
  
    .container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
    }
</style>
