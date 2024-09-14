<script lang="ts">
    import { clearData, completedCourses, isOffline, isSubscribed, isSubUnsubRunning, pageLoaded, preregisteredCourses, semesterClassRoutine, semesterName, showGrade, showLogin, unlockedCourses, User, type SemesterDataType } from "$lib/store";
    import "$lib/styles/global.scss";

    import { onDestroy, onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import type { Unsubscriber } from "svelte/store";
    import { fetchNoticesFromDB } from "./fetcher";
    import Logo from "./Logo.svelte";

    async function detectSWUpdate(){

        const registration = await navigator.serviceWorker.ready;

        registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    console.log("New update available");
                }
            });
        });

        // Listen for messages from the service worker
        if (registration.active) {
            navigator.serviceWorker.addEventListener("message", (event: any) => {
                if (event.data.type == "subscribed") {
                    isSubUnsubRunning.set(false);
                    if (!event.data.data) {
                        console.log("Error subscribing to push notifications");
                        return;
                    }
                    console.log("Subscribed to push notifications");
                    isSubscribed.set(true);
                    localStorage.setItem("isSubscribed", "true");
                } else if (event.data.type == "unsubscribed") {
                    isSubUnsubRunning.set(false);
                    if (!event.data.data) {
                        console.log("Error unsubscribing from push notifications");
                        return;
                    }
                    console.log("Unsubscribed from push notifications");
                    isSubscribed.set(false);
                    localStorage.setItem("isSubscribed", "false");
                } else if (event.data.type == "notice") {
                    console.log("New notice available");
                    fetchNoticesFromDB().catch((e) => {
                        console.log("Error fetching notices", e);
                    });
                }
            });
        } else {
            console.error("No active service worker to listen to messages from.");
        }
    }

    let unsub: Unsubscriber;

    onMount(async () => {
        try {
            detectSWUpdate();
            const permAllowed = Notification.permission === "granted";
            localStorage.setItem("isSubscribed", permAllowed ? "true" : "false");
            isSubscribed.set(false);
            window.addEventListener("offline", () => {
                isOffline.set(true);
            });

            window.addEventListener("online", () => {
                isOffline.set(false);
            });
            
            validateUser();
        } catch (error) {
            console.error(error);
        }

        pageLoaded.set(true);
    })

    onDestroy(() => {
        unsub?.();
    });

    function validateUser() {
        try {
			const raw = localStorage.getItem("semesterClassRoutine");

			if (raw == null || raw == undefined || raw == "" || raw == "{}") {
				localStorage.removeItem("semesterClassRoutine");
				console.log("No data");
                showLogin.set(true);
				return;
			}

			const sem = localStorage.getItem("semester") as string;

			semesterName.set(sem);

			User.set(localStorage.getItem("user") || "");

			const data = JSON.parse(raw);

			const rawCompletedCourses =
				localStorage.getItem("completedCourses");
			const rawPreregisteredCourses = localStorage.getItem(
				"preregisteredCourses",
			);
			const rawUnlockedCourses = localStorage.getItem("unlockedCourses");

			const parsedCompletedCourses = rawCompletedCourses
				? JSON.parse(rawCompletedCourses)
				: {};

			const parsedPreregisteredCourses = rawPreregisteredCourses
				? JSON.parse(rawPreregisteredCourses)
				: {};

			const parsedUnlockedCourses = rawUnlockedCourses
				? JSON.parse(rawUnlockedCourses)
				: {};

			completedCourses.set(parsedCompletedCourses);
			preregisteredCourses.set(parsedPreregisteredCourses);
			unlockedCourses.set(parsedUnlockedCourses);

			const gradeshow = localStorage.getItem("showGrade") as string;
			if (gradeshow == "true") {
				showGrade.set(true);
			} else {
				showGrade.set(false);
			}

			if (data satisfies SemesterDataType) {
				//console.log("Data loaded from local storage");
				semesterClassRoutine.set(data);
				//console.log("Semester set");
				showLogin.set(false);
				//console.log("Login shown");
			} else {
				console.log("Invalid data");
				clearData();
			}
			//console.log("Loaded set to true");
		} catch (e) {
			console.log("Error loading data");
			clearData();
		}
    }

</script>

<svelte:body on:contextmenu|preventDefault />

{#if !$pageLoaded}
	<div class="preload" in:fade out:fly={{ y: 10 }}>
		<Logo />
	</div>
{:else}
	<div class="container">
        <div class="main">
            <slot></slot>
            <footer class="footer">
                <div class="source">
                    <a href="https://github.com/BrainbirdLab/AIUB_Course_Info"
                        >Source code <i class="fa-solid fa-code"></i></a
                    >
                </div>
                ・
                <div class="support">
                    <a href="https://github.com/BrainbirdLab/AIUB_Course_Info/issues">
                        Submit issues <i class="fa-solid fa-circle-exclamation"></i>
                    </a>
                </div>
            </footer>
        </div>
	</div>
{/if}

<style lang="scss">

    .main{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
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
        height: 100%;
	}

    .footer {
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
</style>
