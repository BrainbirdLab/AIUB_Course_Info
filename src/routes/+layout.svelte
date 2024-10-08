<script lang="ts">
    
    import "$lib/styles/global.scss";

    import { allCourses, clearData, completedCourses, isOffline, isSubscribed, isSubUnsubRunning, pageLoaded, preregisteredCourses, semesterClassRoutine, semesterName, showGrade, showLogin, subCheckingDone, subPermissionDenied, unlockedCourses, User, type SemesterDataType } from "$lib/store";
    import { onDestroy, onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import type { Unsubscriber } from "svelte/store";
    import { showToastMessage } from "@itsfuad/domtoastmessage";
    import Logo from "./Logo.svelte";
    import { checkSubscription, initNotices, parseNotices, updateNoticesLocally } from "$lib/fetcher";
    import { deleteFromDB } from "$lib/db";

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
                    isSubUnsubRunning.set(false);
                    subCheckingDone.set(true);
                    if (!event.data.data) {
                        return;
                    }
                    updateNoticesLocally();
                    isSubscribed.set(true);
                    localStorage.setItem("isSubscribed", "true");
                    console.log("Subscribed to push notifications");
                } else if (event.data.type == "unsubscribed") {
                    isSubUnsubRunning.set(false);
                    subCheckingDone.set(true);
                    if (!event.data.data) {
                        return;
                    }
                    isSubscribed.set(false);
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

    let unsub: Unsubscriber;

    onMount(async () => {
        window.addEventListener("offline", () => {
            isOffline.set(true);
        });

        window.addEventListener("online", () => {
            isOffline.set(false);
            checkSubscription(navigator.serviceWorker.controller);
        });

        window.addEventListener("storage", (e) => {
            clearData();
        });

        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'notifications' }).then(function (notificationPerm) {
                notificationPerm.onchange = function () {
                    console.log("User decided to change his seettings. New permission: " + notificationPerm.state);
                    subPermissionDenied.set(notificationPerm.state === "denied");
                    if ($subPermissionDenied) {
                        isSubscribed.set(false);
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
                isSubscribed.set(false);
                localStorage.setItem("isSubscribed", "false");
                pageLoaded.set(true);
                return;
            }

            const permAllowed = window.Notification.permission === "granted";
            const sub = localStorage.getItem("isSubscribed") === "true";
            isSubscribed.set(permAllowed && sub);
            localStorage.setItem("isSubscribed", $isSubscribed ? "true" : "false");
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

        pageLoaded.set(true);
    })

    onDestroy(() => {
        unsub?.();
    });

    function validateUser() {
        try {
			const raw = localStorage.getItem("semesterClassRoutine");

			if (raw == null || raw == undefined || raw == "" || raw == "{}") {
				console.log("No data");
                showLogin.set(true);
                clearData();
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

            const rawAllCourses = localStorage.getItem("allCourses");

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

                
                
            completedCourses.set(parsedCompletedCourses);
            preregisteredCourses.set(parsedPreregisteredCourses);
            unlockedCourses.set(parsedUnlockedCourses);
            allCourses.set(parsedAllCourses);

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
                showLogin.set(true);
				clearData();
			}
			//console.log("Loaded set to true");
		} catch (e) {
			console.log("Error loading data");
            showLogin.set(true);
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
    <slot></slot>
{/if}

<style lang="scss">
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
</style>
