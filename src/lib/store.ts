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

const AvailableColors =  [
  "#405b91",
  "#1d8ad3",
  "#123472",
  "#d3251d",
  "#009169",
  "#008a91",
  "#064491",
  "#7d12df",
  "#df1241",
  "#4d6a59",
];

export const Colors = writable(AvailableColors);

export const ColorsMap = writable(new Map<string, string>());
//ColorsMap.set('Free', '#000800aa');
//ColorsMap.set('Break', '#077518');
ColorsMap.update((map) => {
  map.set('Free', '#000800aa');
  map.set('Break', '#077518');
  return map;
});

export const User = writable('');
export const semester = writable('');
export const semesterData: Writable<SemesterDataType> = writable({});
export const showLogin = writable(false);