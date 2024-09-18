import { PUBLIC_API_SERVER_URL } from "$env/static/public";
import { readFromDB, writeToDB } from "$lib/db";

import { allCourses, allNotices, completedCourses, isSubUnsubRunning, preregisteredCourses, semesterClassRoutine, semesterName, showLogin, subCheckingDone, subPermissionDenied, unlockedCourses, updateLog, updateStatus, User } from "$lib/store";
import { showToastMessage } from "@itsfuad/domtoastmessage";

export async function subscribeToNotice(worker: ServiceWorker | null) {
    isSubUnsubRunning.set(true);
    if (!navigator.onLine) {
        console.log("You are offline");
        updateStatus.set("error");
        updateLog.set("You are offline");
        isSubUnsubRunning.set(false);
        showToastMessage("You are offline");
        return;
    }
    if (!worker) {
        console.log("Service worker not found");
        showToastMessage("Service worker not found");
        isSubUnsubRunning.set(false);
        return;
    }
    console.log("Asking for notification permission");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        console.log("Notification permission granted");
        subPermissionDenied.set(false);
        worker?.postMessage({ type: "SUBSCRIBE", api: PUBLIC_API_SERVER_URL });
    } else if (permission === "denied") {
        console.log("Notification permission denied");
        subPermissionDenied.set(true);
        isSubUnsubRunning.set(false);
    } else {
        console.log("Notification permission dismissed");
        subPermissionDenied.set(false);
        isSubUnsubRunning.set(false);
    }
}

export async function unsubscribeFromNotice(worker: ServiceWorker | null) {
    isSubUnsubRunning.set(true);
    if (!worker) {
        console.log("Service worker not found");
        showToastMessage("Service worker not found");
        isSubUnsubRunning.set(false);
        return;
    }
    console.log("Unsubscribing from notifications");
    worker?.postMessage({ type: "UNSUBSCRIBE", api: PUBLIC_API_SERVER_URL });
}

export async function checkSubscription(worker: ServiceWorker | null) {
    subCheckingDone.set(false);
    if (!worker) {
        console.log("Service worker not found");
        showToastMessage("Service worker not found");
        isSubUnsubRunning.set(false);
        return;
    }
    worker?.postMessage({ type: "CHECK_SUBSCRIPTION", api: PUBLIC_API_SERVER_URL });
}

export function parseNotices(notices: string[] | null) {
    if (notices !== null && notices instanceof Array) {
        allNotices.set([]);
        notices.forEach((notice) => {
            const parts = notice.split("::");
            const date = parts[0];
            const noticeText = parts[1];
            const link = parts[2];
            allNotices.update((notices) => {
                notices.push({ date, notice: noticeText, link });
                if (notices.length > 8) {
                    notices.pop(); // remove the first element. first means oldest
                }
                return notices;
            });
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

export async function fetchNoticesFromServer() {
    try {
        const response = await fetch(`${PUBLIC_API_SERVER_URL}/notices`);
        const json = await response.json();
        const notices = json.notices;
        if (!notices || notices instanceof Array === false || notices.length === 0) {
            return null;
        }
        await writeToDB("notices", "aiub", notices);
        return notices;
    } catch (err) {
        console.error(err);
        return null;
    }   
}

export function GetData(UserName: string, Password: string, done: (error: boolean) => void) {
    try {
        		//if offline
		if (!navigator.onLine) {
			updateLog.set("You are offline");
			updateStatus.set("error");
            done(true);
			return null;
		}

        updateLog.set("Accessing portal...");
		updateStatus.set("loading");

        //https://course-visualizer-proxy.onrender.com
        const source = new EventSource(`${PUBLIC_API_SERVER_URL}/login?username=${encodeURIComponent(UserName)}&password=${encodeURIComponent(Password)}`, { withCredentials: true });

        source.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            if (data.status === "complete") {
                initNotices();
                updateLog.set('');
                updateStatus.set('');
                User.set(data.result.user);
                semesterClassRoutine.set(data.result.semesterClassRoutine);
                unlockedCourses.set(data.result.unlockedCourses);
                preregisteredCourses.set(data.result.preregisteredCourses);
                completedCourses.set(data.result.completedCourses);
                semesterName.set(data.result.currentSemester);
                allCourses.set(data.result.curriculumncourses);
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
                showLogin.set(false);
                done(false);
            } else if (data.status == "running") {
                updateLog.set(data.message);
                updateStatus.set('loading');
            } else if (data.status === "error") {
                updateLog.set(data.message);
                updateStatus.set('error');
                source.close();
                done(true);
            }
        }

        source.onerror = (evt) => {
            source.close();
            updateLog.set('Something went wrong.');
            updateStatus.set('error');
            done(true);
        }

        
        return source;
    } catch (err) {
        console.log(err);
        updateLog.set('Something went wrong.');
        updateStatus.set('error');
        done(true);
        return null;
    }
}