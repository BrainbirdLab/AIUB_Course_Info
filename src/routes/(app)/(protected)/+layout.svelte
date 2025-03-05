<script lang="ts">

    import { clearData, isOffline, isSubscribed, isSubUnsubRunning, pageLoaded, showLogin, subCheckingDone, subPermissionDenied, currentPage, User } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { showToastMessage } from "@itsfuad/domtoastmessage";
    import Logo from "$lib/components/Logo.svelte";
    import { checkSubscription, initNotices, parseNotices, updateNoticesLocally } from "$lib/fetcher";
    import { deleteFromDB } from "$lib/db";
    import DataUpdateLog from "$lib/components/dataUpdateLog.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import PopupModal from "$lib/components/popupModal.svelte";
    import { goto, onNavigate } from "$app/navigation";
    import NavigationIndicator from "$lib/components/NavigationIndicator.svelte";
    import CalenderUpdateLog from "$lib/components/calenderUpdateLog.svelte";
    import FacultiesUpdateLog from "$lib/components/facultiesUpdateLog.svelte";
    import { loadData } from "$lib/loader";

    let { children } = $props();

    onMount(() => {

        $effect(() => {
            if (showLogin.value) {
                goto("/login");
            } else {

                currentPage.value = (window.location.pathname.at(-1) === '/' && window.location.pathname != '/') ? window.location.pathname.slice(0, -1) : window.location.pathname;

                console.log("Mounted")

                window.addEventListener("offline", () => {
                    isOffline.value = true;
                });

                window.addEventListener("online", () => {
                    isOffline.value = false;
                    checkSubscription(navigator.serviceWorker.controller);
                });

                window.addEventListener("storage", (e) => {
                    showToastMessage("You are logged out for modifying data", 2000);
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

                console.log("Page loaded");
                pageLoaded.value = true;
            }
        });
    })

</script>

<svelte:body oncontextmenu={(e) => e.preventDefault()}  />

{#if pageLoaded.value}
    <NavigationIndicator />
    <div class="container">
        {#if !showLogin.value}
        <PopupModal />
        <div class="top">
            <div class="user" in:fade>
                <i class="fa-solid fa-user"></i> Hello, {User.value}!
            </div>

            <Navbar />

            <DataUpdateLog />
            <CalenderUpdateLog />
            <FacultiesUpdateLog />
        </div>
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

    .container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		min-height: 100%;
	}

    .top {
        width: 100%;
    }
    
</style>
