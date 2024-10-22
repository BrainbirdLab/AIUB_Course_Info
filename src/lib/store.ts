import { writable, type Writable } from 'svelte/store';
import { unsubscribeFromNotice } from './fetcher';
import { clearDB } from './db';


const data = [
    {
        "IsShowProfileDetails": true,
        "CvPersonal": {
            "ID": 7256,
            "UserId": 60989,
            "Name": "MD. ANWARUL KABIR",
            "Email": "kabir@aiub.edu"
        },
        "Faculty": "FACULTY OF SCIENCE & TECHNOLOGY",
        "Designation": "Faculty",
        "Position": "ASSOCIATE PROFESSOR",
        "PositionID": 137,
        "HrDepartment": "DEPARTMENT OF COMPUTER SCIENCE",
        "PersonalOtherInfo": {
            "ID": 0,
            "UserId": 0,
            "AcademicInterests": "",
            "ResearchInterests": "",
            "RoomNo": "",
            "BuildingNo": "",
            "SecondProfilePhoto": "/Files/Uploads/public-employee-profiles/profile-pictures/60989.jpg"
        }
    },
];


export type FacultyType = {
  "IsShowProfileDetails": boolean;
  "CvPersonal": {
      "ID": number;
      "UserId": number;
      "Name": string;
      "Email": string;
  };
  "Faculty": string;
  "Designation": string;
  "Position": string;
  "PositionID": number;
  "HrDepartment": string;
  "PersonalOtherInfo": {  
      "ID": number;
      "UserId": number;
      "AcademicInterests": string;
      "ResearchInterests": string;
      "RoomNo": string;
      "BuildingNo": string;
      "SecondProfilePhoto": string;
  };
};

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

export type CourseType = {
  [courseId: string]: {
    course_name: string;
    credit: number;
    prerequisites: string[];
  };
};

export type UnlockedCoursesType = CourseType & {
  [courseId: string]: {
    retake: boolean;
  };
};

export type CompletedCoursesType = CourseType & {
  [courseId: string]: {
    grade: string;
  };
};

export type TABS = 'Completed' | 'Unlocked' | 'Routine' | 'Notice';


export const User = writable('');
export const semesterName = writable('');
export const semesterClassRoutine: Writable<SemesterDataType> = writable({});
export const completedCourses: Writable<CompletedCoursesType> = writable({});
export const unlockedCourses: Writable<UnlockedCoursesType> = writable({});
export const preregisteredCourses: Writable<UnlockedCoursesType> = writable({});
export const allCourses: Writable<CourseType> = writable({});
export const calendarData = writable({title: "", table: ""});
export const faculties = writable<FacultyType[]>([]);

export const showLogin = writable(false);
export const showGrade = writable(false);

export const turnOnNotification = writable(false);
export const isSubscribed = writable(false);
export const isSubUnsubRunning = writable(false);
export const subCheckingDone = writable(false);
export const subPermissionDenied = writable(false);

export type NoticeOBJECT = {
  date: string;
  notice: string;
  link?: string;
}

export const pageLoaded = writable(false);

export const allNotices: Writable<NoticeOBJECT[]> = writable([]);

export const isOffline = writable(false);

export const updateLog = writable('');
export const updateStatus: Writable<"loading"|"error"|"success"|""> = writable('');
export const calenderFetching = writable(false);
export const facultiesIsFetching = writable(false);

const AvailableColors =  [
  "#405b91",
  "#1d8ad3",
  "#123472",
  "#d3251d",
  "#009169",
  "#008a91",
  "#064491",
  "#7d12df",
  "#4caf50",
  "#4d6a59",
  "#622e8e",
  "#36a61e",
  "#df9f12",
];

export function getColors(){
  return new Array(...AvailableColors);
}

const CourseIconColors = {
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
    'COLOR' : '#00d45f'
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

export function getIconColor(courseId: string){
  return CourseIconColors[parseCourseId(courseId)].COLOR || '#121a2b';
}

export function getIcon(courseId: string){
  return CourseIconColors[parseCourseId(courseId)].ICON || '<i class="fa-solid fa-book"></i>';
}

export const creditsPrerequisitesObj: {[key:string]: number} = {
  'CSC4197': 100,
};

export function parseCourseId(courseId: string) {
  return RegExp(/[A-Z]+/).exec(courseId)![0] as keyof typeof CourseIconColors;
}

export function clearData(){
  console.log("Clearing Data");
  showLogin.set(true);
  localStorage.clear();
  completedCourses.set({});
  unlockedCourses.set({});
  semesterClassRoutine.set({});
  semesterName.set('');
  allNotices.set([]);
  User.set('');
  clearDB("notices");
  unsubscribeFromNotice(navigator.serviceWorker.controller);
}

export function titleCase(str: string) {
  const temp = str.toLowerCase().split(' ');
  for (let i = 0; i < temp.length; i++) {
      temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1);
  }
  return temp.join(' ');
}

export const currentPage = writable('/');