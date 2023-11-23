import { writable, type Writable } from 'svelte/store';


export type Class = {
    class_id: string;
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

/*
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
*/

export const CourseIconColors = {
  'CSC' : {
    'ICON' : '<i class="fa-solid fa-laptop-code"></i>',
    'COLOR' : '#2196F3'
  },
  'MAT' : {
    'ICON' : '<i class="fa-solid fa-calculator"></i>',
    'COLOR' : '#2f4f4f'
  },
  'ENG' : {
    'ICON' : '<i class="fa-solid fa-book"></i>',
    'COLOR' : '#d32636'
  },
  'PHY' : {
    'ICON' : '<i class="fa-solid fa-atom"></i>',
    'COLOR' : '#413ab7'
  },
  'CHEM' : {
    'ICON' : '<i class="fa-solid fa-flask"></i>',
    'COLOR' : '#7c0f9e'
  },
  'BIO' : {
    'ICON' : '<i class="fa-solid fa-microscope"></i>',
    'COLOR' : '#2196f3'
  },
  'ECO' : {
    'ICON' : '<i class="fa-solid fa-money-bill"></i>',
    'COLOR' : '#03a9f4'
  },
  'EEE' : {
    'ICON' : '<i class="fa-solid fa-bolt"></i>',
    'COLOR' : '#ff8426'
  },
  'COE' : {
    'ICON' : '<i class="fa-solid fa-microchip"></i>',
    'COLOR' : '#f89347'
  },
  'BBA' : {
    'ICON' : '<i class="fa-solid fa-chart-bar"></i>',
    'COLOR' : '#4ed51f'
  },
  'MBA' : {
    'ICON' : '<i class="fa-solid fa-chart-bar"></i>',
    'COLOR' : '#4ed51f'
  },
  'BAE' : {
    'ICON' : '<i class="fa-solid fa-gears"></i>',
    'COLOR' : '#f8b747'
  },
  'BAS' : {
    'ICON' : '<i class="fa-solid fa-earth-asia"></i>',
    'COLOR' : '#93c42e'
  },
  'MGT' : {
    'ICON' : '<i class="fa-solid fa-briefcase"></i>',
    'COLOR' : '#00d45f4'
  },
  'MIS' : {
    'ICON' : '<i class="fa-solid fa-server"></i>',
    'COLOR' : '#2196F3'
  },
  'F' : {
    'ICON' : '<i class="fa-solid fa-money-bill"></i>',
    'COLOR' : '#4ed51f'
  },
  'HUM' : {
    'ICON' : '<i class="fa-solid fa-book"></i>',
    'COLOR' : '#d32636'
  },
  'FIN': {
    'ICON' : '<i class="fa-solid fa-money-bill"></i>',
    'COLOR' : '#4ed51f'
  },
  'MPH' : {
    'ICON' : '<i class="fa-solid fa-user-md"></i>',
    'COLOR' : '#d32636'
  },
  'OSCM' : {
    'ICON' : '<i class="fa-solid fa-truck"></i>',
    'COLOR' : '#ff5722'
  }, 
  'MMC' : {
    'ICON' : '<i class="fa-solid fa-clapperboard"></i>',
    'COLOR' : '#d32636'
  }, 
  'Major' : {
    'ICON' : '<i class="fa-solid fa-graduation-cap"></i>',
    'COLOR' : '#4caf50'
  }, 
  'MKT' : {
    'ICON' : '<i class="fa-solid fa-bullhorn"></i>',
    'COLOR' : '#ff5722'
  },
}

export function parseCourseId(courseId: string) {
  return courseId.match(/[A-Z]+/)![0] as keyof typeof CourseIconColors;
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

export function titleCase(str: string) {
  const temp = str.toLowerCase().split(' ');
  for (var i = 0; i < temp.length; i++) {
      temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
  }
  return temp.join(' ');
}