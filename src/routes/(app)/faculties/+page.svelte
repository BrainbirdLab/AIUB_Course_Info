<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        type FacultyType,
        faculties,
        showLogin,
        facultiesIsFetching,
    } from "$lib/store";
    import { onMount } from "svelte";
    //import { flip } from "svelte/animate";
    import { fly, slide } from "svelte/transition";

    let loaded = false;

    $: filterOptions = $faculties
        .map((faculty: FacultyType) => faculty.Faculty)
        .filter((value, index, self) => self.indexOf(value) === index && value);

    let selectedGroup = "All";

    let filterValue = "";

    let filteredFaculties: FacultyType[] = [];

    $: {
        filteredFaculties = $faculties.filter((faculty: FacultyType) => {
            if (selectedGroup === "All") {
                return true;
            }
            return faculty.Faculty === selectedGroup;
        });

        if (filterValue) {
            filteredFaculties = filteredFaculties.filter(
                (faculty: FacultyType) => {
                    return faculty.CvPersonal.Name.toLowerCase().includes(
                        filterValue.toLowerCase(),
                    );
                },
            );
        }
    }

    onMount(() => {
        if ($showLogin) {
            goto("/login");
        }
        loaded = true;
    });
</script>

{#if loaded}
    {#if $facultiesIsFetching}
        <div class="content" transition:slide={{ axis: "y" }}>
            <div class="mid">Getting data...</div>
        </div>
    {/if}
    <div class="search" in:fly|global={{ x: 10 }}>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
            type="text"
            autocomplete="off"
            placeholder="Search..."
            bind:value={filterValue}
        />
        <button class="clear" on:click={() => (filterValue = "")}>
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
    <ul>
        {#if filteredFaculties.length == 0}
            <div class="empty" in:fly|global={{y: 10}}>No data avaliable</div>
        {:else}
            {#each filteredFaculties as faculty, i (i)}
                <li class="faculty-info" in:fly|global={{y: 10, delay: 1+i * 10}}>
                    <img
                        src={faculty.PersonalOtherInfo.SecondProfilePhoto.startsWith(
                            "https://",
                        )
                            ? faculty.PersonalOtherInfo.SecondProfilePhoto
                            : "https://www.aiub.edu/" +
                              faculty.PersonalOtherInfo.SecondProfilePhoto}
                        alt={faculty.CvPersonal.Name}
                    />
                    <div class="about">
                        <div
                            class="faculty-name"
                            >{faculty.CvPersonal.Name}</div
                        >
                        <div class="proffesion">
                            {faculty.Position}, {faculty.Designation}
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
                        <div class="faculty">{faculty.Faculty}</div>
                    </div>
                </li>
            {/each}
        {/if}
    </ul>
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
        img {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            object-position: top;
        }

        .about {
            padding: 10px;
            width: 100%;
        }

        .faculty-name {
            font-size: 1rem;
            color: var(--accent);
        }

        .proffesion {
            font-size: 0.8rem;
        }

        .faculty {
            font-size: 0.6rem;
            color: var(--label-color);
        }

        .room,
        .email {
            font-size: 0.8rem;
            color: var(--label-color);
        }
    }
</style>
