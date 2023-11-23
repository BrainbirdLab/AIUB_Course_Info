import { writable, type Writable } from 'svelte/store';


export type Class = {
    course_id: string;
    course_name: string;
    room: string;
    section: string;
    type: string;
};

export type SemesterDataType = {
    [academicYear: string]: {
      [dayOfWeek: string]: {
        [timeSlot: string]: Class;
      };
    };
};

export type UnlockedCoursesType = {
  [courseId: string]: {
    course_name: string;
    credit: number;
    prerequisites: string[];
    retake: boolean;
  };
};

export type CompletedCoursesType = {
  [courseId: string]: {
    course_name: string;
    grade: string;
    credit: number;
  };
};

export type TABS = 'Completed' | 'Unlocked' | 'Routine';

export const tabs: Writable<TABS> = writable('Routine');

export const User = writable('');
export const semesterName = writable('');
export const semesterClassRoutine: Writable<SemesterDataType> = writable({});
export const completedCourses: Writable<CompletedCoursesType> = writable({});
export const unlockedCourses: Writable<UnlockedCoursesType> = writable({});
export const showLogin = writable(false);

export const ICONS = {
  'CSC' : '<i class="fa-solid fa-laptop-code"></i>',
  'MAT' : '<i class="fa-solid fa-calculator"></i>',
  'ENG' : '<i class="fa-solid fa-book"></i>',
  'PHY' : '<i class="fa-solid fa-atom"></i>',
  'CHEM' : '<i class="fa-solid fa-flask"></i>',
  'BIO' : '<i class="fa-solid fa-microscope"></i>',
  'ECO' : '<i class="fa-solid fa-money-bill"></i>',
  'EEE' : '<i class="fa-solid fa-bolt"></i>',
  'COE' : '<i class="fa-solid fa-microchip"></i>',
  'BBA' : '<i class="fa-solid fa-chart-bar"></i>',
  'BAE' : '<i class="fa-solid fa-gears"></i>',
  'BAS' : '<i class="fa-solid fa-earth-asia"></i>'
}

export function parseCourseId(courseId: string) {
  return courseId.match(/[A-Z]+/)![0] as keyof typeof ICONS;
}

export function clearData(){
  localStorage.removeItem('semesterClassRoutine');
  localStorage.removeItem('semester');
  localStorage.removeItem('user');
  localStorage.removeItem('completedCourses');
  localStorage.removeItem('unlockedCourses');
  completedCourses.set({});
  unlockedCourses.set({});
  semesterClassRoutine.set({});
  semesterName.set('');
  User.set('');
  showLogin.set(true);
}