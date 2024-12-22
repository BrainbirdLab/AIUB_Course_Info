<script lang="ts">
    
    import "$lib/styles/global.scss";

    import { allCourses, clearData, completedCourses, isOffline, isSubscribed, isSubUnsubRunning, pageLoaded, preregisteredCourses, semesterClassRoutine, semesterName, showGrade, showLogin, subCheckingDone, subPermissionDenied, unlockedCourses, currentPage, User, type SemesterDataType, calendarData, faculties } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { showToastMessage } from "@itsfuad/domtoastmessage";
    import Logo from "$lib/components/Logo.svelte";
    import { checkSubscription, initNotices, parseNotices, updateNoticesLocally } from "$lib/fetcher";
    import { deleteFromDB } from "$lib/db";
    import DataUpdateLog from "$lib/components/dataUpdateLog.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import Options from "$lib/components/options.svelte";
    import PopupModal from "$lib/components/popupModal.svelte";
    import { goto, onNavigate, pushState } from "$app/navigation";
    import NavigationIndicator from "$lib/components/NavigationIndicator.svelte";
    import CalenderUpdateLog from "$lib/components/calenderUpdateLog.svelte";
    import FacultiesUpdateLog from "$lib/components/facultiesUpdateLog.svelte";

    let { children } = $props();

    onNavigate(() => {
        currentPage.value = (window.location.pathname.at(-1) === '/' && window.location.pathname != '/') ? window.location.pathname.slice(0, -1) : window.location.pathname;
    });

    
	function showOptions() {
		pushState("", { options: true });
	}


    async function detectSWUpdate(){

        const registration = await navigator.serviceWorker.ready;

        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    console.log("New update available");
                    showToastMessage("App Updated. Re-launch to see changes.", 1500);
                }
            });
        });

        // Listen for messages from the service worker
        if (registration.active) {
            navigator.serviceWorker.addEventListener("message", (event: any) => {
                if (event.data.type == "subscribed") {
                    isSubUnsubRunning.value = false;
                    subCheckingDone.value = true;
                    if (!event.data.data) {
                        return;
                    }
                    updateNoticesLocally();
                    isSubscribed.value = true;
                    localStorage.setItem("isSubscribed", "true");
                    console.log("Subscribed to push notifications");
                } else if (event.data.type == "unsubscribed") {
                    isSubUnsubRunning.value = false;
                    subCheckingDone.value = true;
                    if (!event.data.data) {
                        return;
                    }
                    isSubscribed.value = false;
                    localStorage.setItem("isSubscribed", "false");
                    console.log("Unsubscribed from push notifications");
                } else if (event.data.type == "notice-update") {
                    updateNoticesLocally();
                }
            });
        } else {
            console.log("No active service worker to listen to messages from.");
        }
    }

    onMount(async () => {

        currentPage.value = (window.location.pathname.at(-1) === '/' && window.location.pathname != '/') ? window.location.pathname.slice(0, -1) : window.location.pathname;

        console.log("Mounted")

        $effect(() => {
            if (showLogin.value) {
                goto("/login");
            }
        });

        window.addEventListener("offline", () => {
            isOffline.value = true;
        });

        window.addEventListener("online", () => {
            isOffline.value = false;
            checkSubscription(navigator.serviceWorker.controller);
        });

        window.addEventListener("storage", (e) => {
            showToastMessage("You are logged out for deleting data", 2000);
            clearData();
        });

        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'notifications' }).then(function (notificationPerm) {
                notificationPerm.onchange = function () {
                    console.log("User decided to change his seettings. New permission: " + notificationPerm.state);
                    subPermissionDenied.value = notificationPerm.state === "denied";
                    if (subPermissionDenied.value) {
                        isSubscribed.value = false;
                        localStorage.setItem("isSubscribed", "false");
                    }
                };
            });
        }

        try {
            detectSWUpdate();
            validateUser();

            if (!window.Notification) {
                console.log("Notification not supported");
                isSubscribed.value = false;
                localStorage.setItem("isSubscribed", "false");
                pageLoaded.value = true;
                return;
            }

            const permAllowed = window.Notification.permission === "granted";
            const sub = localStorage.getItem("isSubscribed") === "true";
            isSubscribed.value = permAllowed && sub;
            localStorage.setItem("isSubscribed", isSubscribed.value ? "true" : "false");
            checkSubscription(navigator.serviceWorker.controller);
            try {
                initNotices();
            } catch (error) {
                console.log("Error updating notices", error);
                parseNotices([]);
                deleteFromDB("notices", "aiub");
            }
        } catch (error) {
            console.error(error);
        }

        pageLoaded.value = true;
    })

    function validateUser() {
        try {
			const raw = localStorage.getItem("semesterClassRoutine");

			if (raw == null || raw == undefined || raw == "" || raw == "{}") {
				console.log("No data");
                showLogin.value = true;
                clearData();
				return;
			}

			const sem = localStorage.getItem("semester") as string;

			semesterName.value = sem;

			User.value = localStorage.getItem("user") || "";

			const data = JSON.parse(raw);

			const rawCompletedCourses =
				localStorage.getItem("completedCourses");
			const rawPreregisteredCourses = localStorage.getItem(
				"preregisteredCourses",
			);
			const rawUnlockedCourses = localStorage.getItem("unlockedCourses");

            const rawAllCourses = localStorage.getItem("allCourses");

            const rawCalendar = localStorage.getItem("calendar");

            const rawFaculties = localStorage.getItem("faculties");

			const parsedCompletedCourses = rawCompletedCourses
				? JSON.parse(rawCompletedCourses)
				: {};

			const parsedPreregisteredCourses = rawPreregisteredCourses
				? JSON.parse(rawPreregisteredCourses)
				: {};

			const parsedUnlockedCourses = rawUnlockedCourses
				? JSON.parse(rawUnlockedCourses)
				: {};

            const parsedAllCourses = rawAllCourses
                ? JSON.parse(rawAllCourses)
                : {};

            const parsedCalendar = rawCalendar
                ? JSON.parse(rawCalendar)
                : {title: "", table: ""};
                
            const parsedFaculties = JSON.parse(rawFaculties || "[]");
                
            completedCourses.value = parsedCompletedCourses;
            preregisteredCourses.value = parsedPreregisteredCourses;
            unlockedCourses.value = parsedUnlockedCourses;
            allCourses.value = parsedAllCourses;
            calendarData.value = parsedCalendar;
            faculties.value = parsedFaculties;

			const gradeshow = localStorage.getItem("showGrade") as string;
			if (gradeshow == "true") {
				showGrade.value = true;
			} else {
				showGrade.value = false;
			}

			if (data satisfies SemesterDataType) {
				//console.log("Data loaded from local storage");
				semesterClassRoutine.value = data;
				//console.log("Semester set");
				showLogin.value = false;
				//console.log("Login shown");
			} else {
				console.log("Invalid data");
                showLogin.value = true;
				clearData();
			}
			//console.log("Loaded set to true");
		} catch (e) {
			console.log("Error loading data");
            showLogin.value = true;
			clearData();
		}
    }

</script>

<svelte:body oncontextmenu={(e) => e.preventDefault()}  />

{#if !pageLoaded.value}
	<div class="preload" in:fade out:fly={{ y: 10 }}>
		<Logo />
	</div>
{:else}
    <NavigationIndicator />
    <div class="container">
        {#if !showLogin.value}
        <Options />
        <PopupModal />

        <div class="user" in:fade>
            <i class="fa-solid fa-user"></i> Hello, {User.value}! <button class="option" aria-label="Options" onclick={showOptions}>
                <i class="fa-solid fa-gear"></i>
            </button>
        </div>

        <Navbar />

        <DataUpdateLog />
        <CalenderUpdateLog />
        <FacultiesUpdateLog />
        
        {/if}
        
        {@render children()}

    </div>
{/if}

<style lang="scss">
    .user {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		padding: 30px 10px 10px 10px;
        i {
            font-size: 1rem;
            pointer-events: none;
            padding-right: 10px;
        }
	}

    .option{
		color: var(--accent);
		width: 40px;
    	height: 40px;
		i {
			font-size: 1.2rem;
			color: inherit;
		}
	}

	.preload {
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		inset: 0;
		font-size: 0.8rem;
		color: var(--accent);
		gap: 10px;
		z-index: 100;
	}

    .container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		min-height: 100%;
	}
</style>
