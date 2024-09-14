import { PUBLIC_API_SERVER_URL } from "$env/static/public";

import { allNotices, completedCourses, preregisteredCourses, semesterClassRoutine, semesterName, showLogin, unlockedCourses, updateLog, updateStatus, User, type NoticeOBJECT } from "$lib/store";
import { get } from "svelte/store";

export async function subscribeToNotice(worker: ServiceWorker | null) {
    if (!worker) {
        console.error("Service worker not found");
        return;
    }
    console.log("Asking for notification permission");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        console.log("Notification permission granted");
        worker?.postMessage({ type: "SUBSCRIBE", api: PUBLIC_API_SERVER_URL });
    } else {
        console.log("Notification permission denied");
    }
}

export async function unsubscribeFromNotice(worker: ServiceWorker | null) {
    if (!worker) {
        console.error("Service worker not found");
        return;
    }
    console.log("Unsubscribing from notifications");
    worker?.postMessage({ type: "UNSUBSCRIBE", api: PUBLIC_API_SERVER_URL });
}

export function parseNotices(notices: string[]) {
    allNotices.set([]);
    notices.map((notice) => {
        const parts = notice.split("::");
        const date = parts[0];
        const noticeText = parts[1];
        get(allNotices).push({ date, notice: noticeText });
        if (get(allNotices).length > 10) {
            get(allNotices).shift(); // remove the first element. first means oldest
        }
    });
}

export async function fetchNoticesFromDB() {
    const data = await fetch(`${PUBLIC_API_SERVER_URL}/notices`);
    const json = await data.json();
    const notices = json.notices;
    localStorage.setItem("notices", JSON.stringify(notices));
    parseNotices(notices);
}

export function GetData(UserName: string, Password: string, done: (error: boolean) => void) {

    try {
        		//if offline
		if (!navigator.onLine) {
			updateLog.set("You are offline");
			updateStatus.set("error");
            done(true);
			return;
		}

        updateLog.set("Accessing portal...");
		updateStatus.set("loading");

        //https://course-visualizer-proxy.onrender.com
        const source = new EventSource(`${PUBLIC_API_SERVER_URL}/login?username=${encodeURIComponent(UserName)}&password=${encodeURIComponent(Password)}`, { withCredentials: true });

        source.onmessage = (evt) => {
            const data = JSON.parse(evt.data);
            if (data.status === "complete") {
                updateLog.set('');
                updateStatus.set('');
                showLogin.set(false);
                User.set(data.result.user);
                semesterClassRoutine.set(data.result.semesterClassRoutine);
                unlockedCourses.set(data.result.unlockedCourses);
                preregisteredCourses.set(data.result.preregisteredCourses);
                completedCourses.set(data.result.completedCourses);
                semesterName.set(data.result.currentSemester);
                localStorage.setItem('user', data.result.user);
                localStorage.setItem('semesterClassRoutine', JSON.stringify(data.result.semesterClassRoutine));
                localStorage.setItem('unlockedCourses', JSON.stringify(data.result.unlockedCourses));
                localStorage.setItem('preregisteredCourses', JSON.stringify(data.result.preregisteredCourses));
                localStorage.setItem('completedCourses', JSON.stringify(data.result.completedCourses));
                localStorage.setItem('semester', data.result.currentSemester);
                localStorage.setItem('UserName', UserName);
                localStorage.setItem('Password', Password);
                source.close();
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
    } catch (err) {
        console.log(err);
        updateLog.set('Something went wrong.');
        updateStatus.set('error');
        done(true);
    }
}