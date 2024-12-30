<script lang="ts">
    import { goto } from '$app/navigation';
    import { unlockedCourses, preregisteredCourses, showLogin, allCourses, parseCourseId } from '$lib/store.svelte';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade, fly } from 'svelte/transition';
    import CourseCard from '../CourseCard.svelte';
    import Search from '../Search.svelte';

    let loaded = $state(false);

    let selectedDepartment = $state("All");

    let observeables = $derived.by(() => {
        if (selectedDepartment) {
            if (selectedDepartment === 'All') {
                return Object.entries(allCourses.value);
            } else {
                return Object.entries(allCourses.value).filter(([courseId, _]) => parseCourseId(courseId) === selectedDepartment);
            }
        } else {
            return Object.entries(allCourses.value);
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
    });
    
    let filterValue = $state('');

    onMount(() => {
        if (showLogin.value){
            goto("/login");
        }
        loaded = true;
    });

    let totalCredits = $derived(Object.values(allCourses.value).reduce((acc, course) => acc + (course.credit || 0), 0));
    
    let departments = $derived(["All", ...Object.keys(allCourses.value).reduce((acc, courseId) => {
        let parsedDepartment = parseCourseId(courseId);

        if (!acc.includes(parsedDepartment)) {
            acc.push(parsedDepartment);
        }

        return acc;

    }, Array<string>())]);

    let deptCreditAndCountMap = $derived(departments.reduce((acc, dept) => {
        // let deptCourses = Object.entries(allCourses.value).filter(([courseId, _]) => parseCourseId(courseId) === dept);
        // let deptCredits = deptCourses.reduce((acc, [_, course]) => acc + (course.credit || 0), 0);
        // return [dept, {count: deptCourses.length, credits: deptCredits}];

        if (dept === 'All') {
            //add all courses
            return new Map<string, {count: number, credits: number}> ([
                ['All', {count: Object.keys(allCourses.value).length, credits: totalCredits}]
            ]);
        }

        let deptCourses = Object.entries(allCourses.value).filter(([courseId, _]) => parseCourseId(courseId) === dept);
        let deptCredits = deptCourses.reduce((acc, [_, course]) => acc + (course.credit || 0), 0);
        

        if (!acc) {
            acc = new Map<string, {count: number, credits: number}>();
        }

        acc.set(dept, {count: deptCourses.length, credits: deptCredits});

        return acc;

    }, new Map<string, {count: number, credits: number}>()));

</script>

{#if loaded}
<div class="filter">
    <!-- radio button -->
    {#each departments as dept, i}
        <div class="form-field" in:fly|global={{y: 5, delay: (i+1) * 50}}>
            <input type="radio" name="filter" id="{dept}" value="{dept}" bind:group={selectedDepartment} />
            <label for="{dept}" class="tag">
                {dept} 
                ({deptCreditAndCountMap.get(dept)?.count} course{deptCreditAndCountMap.get(dept)?.count || 0 > 1 ? "s" : ""}, {deptCreditAndCountMap.get(dept)?.credits || 0} Credit{deptCreditAndCountMap.get(dept)?.credits || 0 > 1 ? "s" : ""})
            </label>
        </div>
    {/each}
</div>
{#if observeables && observeables.length > 0}
<div class="container">
    <Search bind:filterValue={filterValue}/>
    <div class="note" in:fade|global>Note: Courses shown below are based on course prerequisite criteria only</div>
    <div class="courses">
        {#if filteredCourses.length == 0}
            <div class="empty">No courses found</div>
        {:else}
        {#each filteredCourses as [courseId, _], i (courseId)}
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