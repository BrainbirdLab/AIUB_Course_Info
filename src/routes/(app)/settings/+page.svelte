<script lang="ts">

    import { fly } from "svelte/transition";
    import { showGrade, updateStatus, isOffline, updateLog, clearData, calenderFetching, facultiesIsFetching, showLogin } from "$lib/store.svelte";
    import { getCalendarData, GetData, getFaculties } from "$lib/fetcher";
    import Footer from "$lib/components/Footer.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    let src: EventSource | null = null;

    let loaded = $state(false);

    const version = __VERSION__;

    onMount(() => {
        if (showLogin.value){
            goto("/login");
        }
        loaded = true;
    });

	async function updateData() {
		const UserName = localStorage.getItem("UserName");
		const Password = localStorage.getItem("Password");
		if (!UserName || !Password) {
			console.log("No user name or password");
			updateLog.value = "Credentials not found. Please login again";
			updateStatus.value = "error";
			return;
		}

		src = GetData(UserName, Password, true, (error: boolean) => {
			if (error) {
				return;
			}
			updateStatus.value = "success";
			updateLog.value = "Data updated";
			setTimeout(() => {
				updateStatus.value = "";
				updateLog.value = "";
			}, 1200);
		});
	}
</script>

{#if loaded}
<div class="settingsWrapper">
    <div
        class="settings box-shadow back-blur"
    >

        <div class="subsectionsContainer">

            <div class="subsection" in:fly|global={{x: 10, delay: 100}}>
                <div class="subtitle">
                    Preferences <i class="fa-solid fa-cog"></i>
                </div>
                <button class="field-checkers hoverShadow"
                aria-label="Toggle grades"
                    onclick={(e) => {
                        showGrade.value = !showGrade.value;
                        console.log(showGrade.value);
                        if (!showGrade.value) {
                            localStorage.setItem("showGrade", "false");
                        } else {
                            localStorage.setItem("showGrade", "true");
                        }
                    }}
                >
                    <input
                        type="checkbox"
                        bind:checked={showGrade.value}
                    />
                    <label for="buttonSound">
                        <div class="textContainer">
                            Grades
                            <div class="moreInfo">
                                Show grades in completed courses
                            </div>
                        </div>
                        <span class="toggleButton"></span>
                    </label>
                </button>
            </div>

            <div class="subsection" in:fly|global={{x: 10, delay: 150}}>
                <div class="subtitle">
                    Data <i class="fa-solid fa-database"></i>
                </div>
                <button class="field-checkers hoverShadow" id="updateData" disabled={updateStatus.value == "loading" || isOffline.value}
                onclick={updateData}
                >
                    <div class="textContainer">
                        Update data from the server
                        <div class="moreInfo">
                            This will update your data from the server
                        </div>
                    </div>
                    <div class="icon">
                        <i class="fa-solid fa-sync"></i>
                    </div>
                </button>
                <button class="field-checkers hoverShadow" id="updateCalendar"disabled={calenderFetching.value || isOffline.value}
                onclick={getCalendarData}
                >
                    <div class="textContainer">
                        Update calendar data
                        <div class="moreInfo">
                            This will update the calendar data
                        </div>
                    </div>
                    <div class="icon">
                        <i class="fa-solid fa-calendar"></i>
                    </div>
                </button>
                <button class="field-checkers hoverShadow" id="updateFaculties" disabled={facultiesIsFetching.value || isOffline.value}
                onclick={getFaculties}
                >
                    <div class="textContainer">
                        Update faculties data
                        <div class="moreInfo">
                            This will update the faculties data
                        </div>
                    </div>
                    <div class="icon">
                        <i class="fa-solid fa-chalkboard-user"></i>
                    </div>
                </button>
            </div>

            <div class="subsection" in:fly|global={{x: 10, delay: 200}}>
                <div class="subtitle">
                    Support & Terms <i class="fa-solid fa-question"></i>
                </div>
                <a class="field-checkers hide-underline hoverShadow" href="https://discord.gg/yQKcHhKzyn">
                    <div class="textContainer">
                        <span>
                            Join our Discord <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </span>
                        <div class="moreInfo">
                            Get support and help
                        </div>
                    </div>
                    <div class="icon">
                        <i class="fa-brands fa-discord"></i>
                    </div>
                </a>
                <a class="field-checkers hide-underline hoverShadow" href="/terms">
                    <div class="textContainer">
                        <span>
                            Terms & Conditions <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </span>
                        <div class="moreInfo">
                            Read the terms and conditions
                        </div>
                    </div>
                    <div class="icon">
                        <i class="fa-solid fa-file-alt"></i>
                    </div>
                </a>
            </div>

            <div class="subsection danger-zone" in:fly|global={{x: 10, delay: 250}}>
                <div class="subtitle sectionHeadTitle red">
                    Clear & Reset <i class="fa-solid fa-skull"></i>
                </div>
                <ul class="moreInfo">
                    <li>
                        Your data will be removed from the device
                    </li>
                    <li>
                        You have to re login to access your data again
                    </li>
                </ul>
                <div class="btn-grp">
                    <button class="btn-red"
                    onclick={() => {
                        clearData();
                        if (src) {
                            src.close();
                        }
                        goto("/login");
                    }}
                    >
                        Clear Data <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="subsection">
               <div class="footer">
                    <a class="src" href="https://github.com/BrainbirdLab/AIUB_Course_Info">
                        Source code <i class="fa-solid fa-code"></i>
                    </a>
                    <div class="attr">
                        &copy; Brainbird Lab {new Date().getFullYear()} • v{version}
                    </div>
               </div>
            </div>
        </div>
    </div>
</div>
{/if}

<style lang="scss">

    .footer{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 10px;
        gap: 5px;
        font-size: 0.6rem;
        position: relative;
        margin: auto 0 0;
        color: var(--label-color);

        a {
            text-decoration: underline;
            color: inherit;
        }

        i {
            font-size: inherit;
        }
    }

    .btn-red {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        cursor: pointer !important;
        gap: 5px;
        border-radius: 10px;
        padding: 8px 10px;
        text-decoration: none !important;
        background: red;
        color: white;

        &:hover {
            filter: brightness(0.95);
        }
    }

    .icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 5px;

        i {
            font-size: 1.2rem;
            color: var(--label-color);
        }
    }

    .hoverShadow{
        transition: 100ms ease-in-out;
    }

    .hoverShadow:hover{
        background: rgba(255, 255, 255, 0.0392156863) !important;
    }

    .settingsWrapper {
        width: 100%;
        height: 100%;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: 200ms;
    }

    .danger-zone {
        border-left: 3px solid red;
        .btn-grp {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding-left: 8px;

            & > button {
                min-width: fit-content;
                flex: 1;
            }
        }
    }

    .red {
        color: red !important;
        * {
            color: red !important;
        }
    }

    input {
        display: none;
    }

    .moreInfo {
        font-size: 0.7rem;
        color: var(--label-color);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        text-align: left;
        gap: 5px;

        * {
            color: inherit;
            font-size: inherit;
        }

        li {
            margin-left: 25px;
            list-style: disc;
        }
    }

    .hide-underline {
        text-decoration: none;
    }

    .field-checkers {
        display: flex;
        position: relative;
        cursor: pointer;
        user-select: none;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        padding: 5px 10px;
        width: 100%;
        border-radius: 10px;
        font-size: 0.8rem;

        //disabled
        &[disabled] {
            cursor: not-allowed;
            opacity: 0.5;
        }

        input {
            cursor: pointer;
            &:checked ~ label .toggleButton {
                background: var(--accent);
                &::after {
                    transform: translateX(20px);
                }
            }
        }

        label {
            width: max-content;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            text-align: right;
            width: 100%;
            gap: 5px;
            cursor: pointer;
        
            .toggleButton {
                position: relative;
                width: 40px;
                height: 20px;
                background: #fdfdfd1f;
                display: flex;
                border-radius: 25px;
                transition: 300ms ease-in-out;
                &::after {
                    content: "";
                    position: absolute;
                    height: 20px;
                    width: 20px;
                    border-radius: 50px;
                    background: white;
                    inset: 0;
                    transition: 300ms ease-in-out;
                    transform: translateX(0px);
                }
            }
        }
    }

    .textContainer {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: flex-start;
        color: var(--title-color);
        font-size: 0.8rem;
        text-align: left;
    }


    .settings {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 10px 10px 0 10px;
        gap: 10px;
        height: 100%;
        width: min(100%, 600px);
        max-width: 100%;
        position: relative;
        font-size: 0.7rem;
        transition: 100ms ease-in-out;

        .subsectionsContainer {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            gap: 15px;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            .subsection {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                gap: 10px;
                width: 100%;
            }
        }
    }

    .subtitle {
        font-size: 0.9rem;
        color: var(--accent);
        padding-bottom: 5px;

        i {
            font-size: inherit;
            color: inherit;
        }

        &.sectionHeadTitle {
            width: 100%;
            margin-top: 10px;
            text-align: center;
        }
    }
</style>
