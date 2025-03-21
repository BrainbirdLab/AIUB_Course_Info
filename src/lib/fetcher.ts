import { PUBLIC_API_SERVER_URL } from "$env/static/public";
import { readFromDB } from "$lib/db";
import { fetchNoticesFromServer } from "$lib/updater";
import { allCourses, allNotices, calendarData, calenderFetching, completedCourses, faculties, facultiesIsFetching, isSubUnsubRunning, preregisteredCourses, semesterClassRoutine, semesterName, showLogin, subCheckingDone, subPermissionDenied, unlockedCourses, updateLog, updateStatus, User } from "$lib/store.svelte";
import { showToastMessage } from "@itsfuad/domtoastmessage";

export async function subscribeToNotice(worker: ServiceWorker | null) {
    isSubUnsubRunning.value = true;
    if (!navigator.onLine) {
        console.log("You are offline");
        updateStatus.value = "error";
        updateLog.value = "You are offline";
        isSubUnsubRunning.value = false;
        showToastMessage("You are offline");
        return;
    }
    if (!worker) {
        console.log("Service worker not found");
        showToastMessage("Service worker not found");
        isSubUnsubRunning.value = false;
        return;
    }

    if (!window.Notification) {
        console.log("Notifications not supported");
        showToastMessage("Notifications not supported");
        isSubUnsubRunning.value = false;
        return;
    }

    console.log("Asking for notification permission");
    const permission = await window.Notification.requestPermission();
    if (permission === "granted") {
        console.log("Notification permission granted");
        subPermissionDenied.value = false;
        worker?.postMessage({ type: "SUBSCRIBE", api: PUBLIC_API_SERVER_URL });
    } else if (permission === "denied") {
        console.log("Notification permission denied");
        subPermissionDenied.value = true;
        isSubUnsubRunning.value = false;
    } else {
        console.log("Notification permission dismissed");
        subPermissionDenied.value = false;
        isSubUnsubRunning.value = false;
    }
}

export async function unsubscribeFromNotice(worker: ServiceWorker | null) {
    isSubUnsubRunning.value = true;
    if (!worker) {
        console.log("Service worker not found");
        showToastMessage("Service worker not found");
        isSubUnsubRunning.value = false;
        return;
    }
    console.log("Unsubscribing from notifications");
    worker?.postMessage({ type: "UNSUBSCRIBE", api: PUBLIC_API_SERVER_URL });
}

export async function checkSubscription(worker: ServiceWorker | null) {
    subCheckingDone.value = false;
    if (!worker) {
        console.log("Service worker not found");
        showToastMessage("Service worker not found");
        isSubUnsubRunning.value = false;
        return;
    }
    worker?.postMessage({ type: "CHECK_SUBSCRIPTION", api: PUBLIC_API_SERVER_URL });
}

export function parseNotices(notices: string[] | null) {
    if (notices !== null && notices instanceof Array) {
        allNotices.value = [];
        notices.forEach((notice) => {
            const parts = notice.split("::");
            const date = parts[0];
            const noticeText = parts[1];
            const link = parts[2];
            allNotices.value.push({ date, notice: noticeText, link });
            if (allNotices.value.length > 10) {
                allNotices.value.pop(); // remove the first element. first means oldest
            }
        });
    }
}

export async function updateNoticesLocally() {
    readFromDB("notices", "aiub").then((data) => {
        parseNotices(data || []);
    });
}

export async function initNotices() {
    updateNoticesLocally().then(() => {
        fetchNoticesFromServer().then((notices) => {
            parseNotices(notices);
        });
    });
}

export async function getCalendarData() {

    try {

        calenderFetching.value = true;

        const res = await fetch("/api/calendar", { cache: "no-cache" });
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const table = doc.querySelector("table");
        // title -> article h1 [ex: ACADEMIC CALENDAR  2024-2025]
        // article h2 -> article h2 [ex: Fall 2024-25]
        // table tbody tr -> each tr has 3 td [month, day, blank], [data, data, data], [data, data, data]

        const title = "ACADEMIC CALENDAR";
        const h2 = doc.querySelector("h2");

        if (!title || !h2 || !table) {
            calenderFetching.value = false;
            return;
        }

        let titleText = title + ", " + h2.textContent;

        localStorage.setItem("calendar", JSON.stringify({ title: titleText, table: table.innerHTML }));

        //update store
        calendarData.value = { title: titleText, table: table.innerHTML };

        calenderFetching.value = false;

    } catch (e) {
        if (window.navigator?.onLine === false) {
            throw new Error("offline");
        }
        calenderFetching.value = false;
        throw e;
    }
}

export async function getFaculties() {
    try {
        facultiesIsFetching.value = true;
        const response = await fetch('/api/faculties', { cache: "no-cache" });
        const json = await response.json() as {"EmployeeProfileLightList": any[]};
        const list = json?.EmployeeProfileLightList || [];
        faculties.value = list;
        //write to local storage
        localStorage.setItem("faculties", JSON.stringify(list));
    } catch (err) {
        console.error(err);
    } finally {
        facultiesIsFetching.value = false;
    }
}

export function GetData(UserName: string, Password: string, update: boolean, done: (error: boolean) => void) {
    try {
        		//if offline
		if (!navigator.onLine) {
			updateLog.value = "You are offline";
			updateStatus.value = "error";
            done(true);
			return null;
		}

        updateLog.value = "Accessing portal...";
		updateStatus.value = "loading";

        //https://course-visualizer-proxy.onrender.com
        const source = new EventSource(`${PUBLIC_API_SERVER_URL}/login?username=${encodeURIComponent(UserName)}&password=${encodeURIComponent(Password)}`, { withCredentials: true });

        source.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            if (data.status === "complete") {
                if (!update) {
                    initNotices();
                    getCalendarData();
                    getFaculties();
                }
                updateLog.value = '';
                updateStatus.value = '';
                User.value = data.result.user;
                semesterClassRoutine.value = data.result.semesterClassRoutine;
                unlockedCourses.value = data.result.unlockedCourses;
                preregisteredCourses.value = data.result.preregisteredCourses;
                completedCourses.value = data.result.completedCourses;
                semesterName.value = data.result.currentSemester;
                allCourses.value = data.result.curriculumncourses;
                localStorage.setItem('user', data.result.user);
                localStorage.setItem('semesterClassRoutine', JSON.stringify(data.result.semesterClassRoutine));
                localStorage.setItem('unlockedCourses', JSON.stringify(data.result.unlockedCourses));
                localStorage.setItem('preregisteredCourses', JSON.stringify(data.result.preregisteredCourses));
                localStorage.setItem('completedCourses', JSON.stringify(data.result.completedCourses));
                localStorage.setItem('semester', data.result.currentSemester);
                localStorage.setItem('UserName', UserName);
                localStorage.setItem('Password', Password);
                localStorage.setItem('allCourses', JSON.stringify(data.result.curriculumncourses));
                source.close();
                showLogin.value = false;
                done(false);
            } else if (data.status == "running") {
                updateLog.value = data.message;
                updateStatus.value = 'loading';
            } else if (data.status === "error") {
                updateLog.value = data.message;
                updateStatus.value = 'error';
                source.close();
                done(true);
            }
        }

        source.onerror = (evt) => {
            source.close();
            updateLog.value = 'Something went wrong.';
            updateStatus.value = 'error';
            done(true);
        }

        
        return source;
    } catch (err) {
        console.log(err);
        updateLog.value = 'Something went wrong.';
        updateStatus.value = 'error';
        done(true);
        return null;
    }
}