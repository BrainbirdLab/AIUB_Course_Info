import { unsubscribeFromNotice } from './fetcher';
import { clearDB } from './db';

function ref<T>(init: T) {
  let value = $state(init);
  return {
    get value() {
      return value;
    },
    set value(newValue: T) {
      value = newValue;
    },
    onChange(callback: (value: T) => void) {
      $effect.root(() => {
        $effect(() => callback(value));
      });
    }
  };
}

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
    semester: string;
  };
};

export type TABS = 'Completed' | 'Unlocked' | 'Routine' | 'Notice';


export const User = ref('');
export const semesterName = ref('');
export const semesterClassRoutine = ref<SemesterDataType>({});
export const completedCourses = ref<CompletedCoursesType>({});
export const unlockedCourses = ref<UnlockedCoursesType>({});
export const preregisteredCourses = ref<UnlockedCoursesType>({});
export const allCourses = ref<CourseType>({});
export const calendarData = ref({title: "", table: ""});
export const faculties = ref<FacultyType[]>([]);

export const showLogin = ref(false);
export const showGrade = ref(false);

export const turnOnNotification = ref(false);
export const isSubscribed = ref(false);
export const isSubUnsubRunning = ref(false);
export const subCheckingDone = ref(false);
export const subPermissionDenied = ref(false);

export type NoticeOBJECT = {
  date: string;
  notice: string;
  link?: string;
}

export const pageLoaded = ref(false);

export const allNotices = ref<NoticeOBJECT[]>([]);

export const isOffline = ref(false);

export const updateLog = ref('');
export const updateStatus = ref<"loading"|"error"|"success"|"">('');
export const calenderFetching = ref(false);
export const facultiesIsFetching = ref(false);

const AvailableColors = [
  "#33716a",  // Red
  "#1926C2",  // Blue
  "#0288D1",  // Light Blue
  "#388E3C",  // Green
  "#7B1FA2",  // Purple
  "#605040",  // Orange
  "#613737",
  "#8E74AA",  // Pink
  "#C2185B",  // Deep Pink
  "#673AB7",  // Deep Purple
  "#70bC9a",  // Turquoise
  "#125265",  // Amber
  "#cF8772",  // Deep Orange
  "#3F51B5",  // Indigo
  "#636f6e",
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
  return CourseIconColors[parseCourseId(courseId)]?.COLOR || '#121a2b';
}

export function getIcon(courseId: string){
  return CourseIconColors[parseCourseId(courseId)]?.ICON || '<i class="fa-solid fa-book"></i>';
}

export const creditsPrerequisitesObj: {[key:string]: number} = {
  'CSC4197': 100,
};

export const facultyColorsMap: {[key:string]: string} = {
  "FACULTY OF SCIENCE & TECHNOLOGY": "#3290de",
  "FACULTY OF BUSINESS ADMINISTRATION": "#3ed21d",
  "FACULTY OF ARTS AND SOCIAL SCIENCES": "#e62727",
  "FACULTY OF ENGINEERING": "darkorange",
}

export function parseCourseId(courseId: string) {
  return RegExp(/[A-Za-z]+/).exec(courseId)![0] as keyof typeof CourseIconColors;
}

export function clearData(){
  console.log("Clearing Data");
  showLogin.value = true;
  localStorage.clear();
  completedCourses.value = {};
  unlockedCourses.value = {};
  semesterClassRoutine.value = {};
  semesterName.value = '';
  allNotices.value = [];
  User.value = '';
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

export const currentPage = ref('/');
