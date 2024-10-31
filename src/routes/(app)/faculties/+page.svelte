<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        type FacultyType,
        faculties,
        showLogin,
        facultyColorsMap,
    } from "$lib/store.svelte";
    import { onMount } from "svelte";
    //import { flip } from "svelte/animate";
    import { fly, slide } from "svelte/transition";

    let loaded = $state(false);

    let filterOptions = $derived(faculties.value
        .map((faculty: FacultyType) => faculty.Faculty)
        .filter((value, index, self) => self.indexOf(value) === index && value));

    let selectedGroup = $state("All");

    let filterValue = $state("");

    
    //pagination
    let currentPage = $state(1);
    const facultiesPerPage = 9;
    let result: FacultyType[] = $state([]);
    let filteredFaculties: FacultyType[] = $state([]);
    
    $effect(() => {

        let filtered = faculties.value.filter((faculty: FacultyType) => {
            if (selectedGroup === "All") {
                return true;
            }
            return faculty.Faculty === selectedGroup;
        });

        if (filterValue) {
            filtered = filtered.filter(
                (faculty: FacultyType) => {
                    return faculty.CvPersonal.Name.split(" ").join("").toLowerCase().includes(
                        filterValue.split(" ").join("").toLowerCase(),
                    );
                },
            );
        } 
        
        filteredFaculties = filtered;
    });
    
    let totalPage = $derived(Math.ceil(filteredFaculties.length / facultiesPerPage));

    $effect(() => {
        currentPage = totalPage > 0 ? 1 : 0;
    })

    $effect(() => {
        result = filteredFaculties.slice(0, facultiesPerPage);
    })

    function paginate(page: number) {
        currentPage = page;
        let start = (page - 1) * facultiesPerPage;
        let end = start + facultiesPerPage;
        result = filteredFaculties.slice(start, end);
    }

    onMount(() => {
        if (showLogin.value) {
            goto("/login");
        }
        loaded = true;
    });
</script>

{#if loaded}
    {#if faculties.value.length > 0}
    <div class="search" in:fly|global={{ x: 10 }}>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
            type="text"
            autocomplete="off"
            placeholder="Search..."
            bind:value={filterValue}
        />
        <button class="clear" aria-label="clear" onclick={() => (filterValue = "")}>
            <i class="fa-solid fa-times"></i>
        </button>
    </div>
    <div class="filter">
        <!-- radio button -->
        <div class="form-field">
            <input
                type="radio"
                name="filter"
                id="All"
                value="All"
                bind:group={selectedGroup}
            />
            <label for="All" class="tag"> All </label>
        </div>
        {#each filterOptions as option, i}
            <div
                class="form-field"
                in:fly|global={{ y: 5, delay: (i + 1) * 50 }}
            >
                <input
                    type="radio"
                    name="filter"
                    id={option}
                    value={option}
                    bind:group={selectedGroup}
                />
                <label for={option} class="tag">
                    {option}
                </label>
            </div>
        {/each}
    </div>
    {/if}
    <ul>
        {#if result.length == 0}
            <div class="empty" in:fly|global={{y: 10}}>No data avaliable</div>
        {:else}
            {#each result as faculty, i (i)}
                <li class="faculty-info" in:fly|global={{y: 10, delay: 1+i * 10}}>
                    <object title="Faculty photo" data={faculty.PersonalOtherInfo.SecondProfilePhoto.startsWith(
                        "https://",
                    )
                        ? faculty.PersonalOtherInfo.SecondProfilePhoto
                        : "https://www.aiub.edu/" +
                          faculty.PersonalOtherInfo.SecondProfilePhoto} type="image/jpeg">
                        <img src="/fallback-image.png" alt="{faculty.CvPersonal.Name}" />
                    </object>
                    <div class="about">
                        <a
                            href="https://www.aiub.edu/faculty-list/faculty-profile#{faculty.CvPersonal.Email}"
                            target="_blank"
                            class="faculty-name"
                            >{faculty.CvPersonal.Name}</a
                        >
                        <div class="proffesion">
                            {faculty.Position}, {faculty.Designation}
                        </div>
                        <div class="hr">
                            {faculty.HrDepartment}
                        </div>
                        {#if faculty.PersonalOtherInfo.RoomNo}
                            <div class="room">
                                Room: {faculty.PersonalOtherInfo.RoomNo}
                            </div>
                        {/if}
                        {#if faculty.CvPersonal.Email}
                            <div class="email">
                                Email: {faculty.CvPersonal.Email}
                            </div>
                        {/if}
                        <div class="faculty" style="color:{facultyColorsMap[faculty.Faculty]}">{faculty.Faculty}</div>
                    </div>
                </li>
            {/each}
        {/if}
    </ul>
    <div class="pagination">
        <button class="pagination-button" onclick={() => {
            if (currentPage > 1) {
                paginate(currentPage - 1);
            }
        }}>Prev</button> 
            <div class="number">
                Page {currentPage} of {totalPage} 
            </div>
        <button class="pagination-button" onclick={() => {
            if (currentPage < totalPage) {
                paginate(currentPage + 1);
            }
        }}>Next</button>
    </div>
{/if}

<style lang="scss">
    ul {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        list-style: none;
        max-width: min(100%, 900px);
        padding: 8px;
    }

    .pagination {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 10px;
        padding: 10px;
        align-items: center;
        .number {
            width: 75px;
            text-align: center;
        }
        button {
            padding: 5px 10px;
            border-radius: 5px;
            background: var(--light-dark);
            color: var(--accent);
            border: 2px solid var(--accent);
            cursor: pointer;
            &:hover {
                filter: brightness(0.9);
            }
        }
    }

    .faculty-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 5px;
        border-radius: 5px;
        background: var(--light-dark);
        width: min(100%, 250px);
        overflow: hidden;
        height: auto;
        img, object {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            object-position: top;
        }

        .about {
            padding: 10px;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
        }

        .faculty-name {
            font-size: 1rem;
            color: var(--accent);
        }

        .proffesion, .hr {
            font-size: 0.8rem;
        }

        .faculty {
            font-size: 0.6rem;
            color: var(--label-color);
            margin-top: auto;
        }

        .room,
        .email {
            font-size: 0.8rem;
            color: var(--label-color);
        }
    }
</style>
