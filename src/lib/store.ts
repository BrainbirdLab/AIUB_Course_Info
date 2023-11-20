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

export const User = writable('');
export const semester = writable('');
export const semesterData: Writable<SemesterDataType> = writable({});
export const showLogin = writable(false);