import { semesterName, User, completedCourses, preregisteredCourses, unlockedCourses, allCourses, calendarData, faculties, showGrade, type SemesterDataType, semesterClassRoutine } from "./store.svelte";

export function loadData(): boolean {
    try {
        const raw = localStorage.getItem("semesterClassRoutine");

        if (raw == null || raw == undefined || raw == "" || raw == "{}") {
            return false;
        }

        const sem = localStorage.getItem("semester") as string;

        semesterName.value = sem;

        User.value = localStorage.getItem("user") ?? "";

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
            
        const parsedFaculties = JSON.parse(rawFaculties ?? "[]");
            
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
            semesterClassRoutine.value = data;
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}