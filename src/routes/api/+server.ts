import {JSDOM} from "jsdom";
import superagent from "superagent";
import type { SemesterDataType, Class } from "$lib/store.js";

const agent = superagent.agent();

export async function GET(){
    return new Response('Hello world!');
}

type ClassData = {
    time: string;
    type: string;
    day: string;
    room: string;
}

function parseTime(timeString: string): ClassData{
    const match = timeString.match(/\d{1,2}:\d{1,2}(?:\s?[ap]m|\s?[AP]M)?/g);
    const dayMap: {[day: string]: string} = {'Sun': 'Sunday', 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday'};
    const class_type = timeString.match(/\((.*?)\)/)?.[1];
    const day = dayMap[timeString.match(/(Sun|Mon|Tue|Wed)/)?.[1] ?? ''];
    const room = timeString.match(/Room: (.*)/)?.[1];

    try {
        const start_time = match?.[0];
        const end_time = match?.[1];
        if (!start_time || !end_time){
            throw new Error('Time not found in the string.');
        }

        let start_time_obj = new Date('1/1/2020 ' + start_time).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });
        let end_time_obj = new Date('1/1/2020 ' + end_time).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' });

        const final_time = `${start_time} - ${end_time}`;
        const data: ClassData = {
            type: class_type ?? '',
            time: final_time,
            day: day ?? '',
            room: room ?? ''
        }
        return data;
    }
    catch (e){
        console.log('Time not found in the string.');
        return {time: '', type: '', day: '', room: ''};
    }
}


function getCourseDetails(course: string){
    const match = course.match(/^(\d+)-(.+?)\s+\[([A-Z0-9]+)\](?:\s+\[([A-Z0-9]+)\])?$/);
    if (match){
        const course_id = match?.[1];
        const course_name = match?.[2];
        const section = match?.[4] ?? match?.[3];
        return {course_id, course_name, section};
    } else {
        console.log('Course not found in the string:', course);
        return {course_id: '', course_name: '', section: ''};
    }
}


export async function POST({request}){

    try{
        const url = 'https://portal.aiub.edu';
      
        const formData = await request.formData();
    
        if (!formData) {
            return new Response('Invalid form data', {status: 400});
        }
    
        const UserName = formData.get('UserName');
        const Password = formData.get('Password');
    
        if (!UserName || !Password) {
            return new Response('Invalid form data', {status: 400});
        }
    
        await agent.post(url).send({UserName, Password}).set('Content-Type', 'application/x-www-form-urlencoded');
        
        const res = await agent.get('https://portal.aiub.edu/Student');

        //if the response url is not https://portal.aiub.edu/Student then main page is not returned, so return Someting went wrong
        const responseUrl = res.redirects.pop();

        if (responseUrl) {
            console.log('Invalid username or password');
            return new Response(JSON.stringify({message:'Invalid username or password'}), {status: 401});
        }

        console.log('Login successful');

        const DOM = new JSDOM(res.text);

        const document = DOM.window.document;

        const targets = document.querySelectorAll('#SemesterDropDown > option');
        const User = document.querySelector('.navbar-link')?.textContent;

        const semesters: SemesterDataType = {};

        for (const target of targets) {
            // value of the option tag is the query string like /Student/Home/CourseList?q=iBpjLWVwA0VIY%2F8fTi0cBg%3D%3D
            const value = target.getAttribute('value')?.split('?')[1];
            //console.log('Fetching data for semester: ', target.textContent, ' with query string: ', value);

            const response = await agent.get(`https://portal.aiub.edu/Student/Registration?${value}`);

            const DOM_TABLE = new JSDOM(response.text);
            //console.log('Response: ', response.text);
            const table = DOM_TABLE.window.document.querySelector('.table-details');
            if (table){

                const rawCourseElements = table.querySelectorAll('td:first-child');
                const coursesObj: {[dayOfWeek: string]: {[timeSlot: string]: Class}} = {};
                
                for (const rawCourse of rawCourseElements){
                    if (rawCourse.textContent){
                        //The course name from the DOM
                        const courseName = rawCourse.querySelector('a')?.textContent ?? '';
                        const parsedCourse = getCourseDetails(courseName);
                        //The time from the DOM 
                        const courseTimes = rawCourse.querySelectorAll('div > span');

                        for (const time of courseTimes){
                            //if time.text doesn't contain 'Time' then skip
                            if (!time.textContent?.includes('Time')){
                                continue;
                            }

                            const parsedTime = parseTime(time.textContent);
                            if (!coursesObj[parsedTime.day]){
                                coursesObj[parsedTime.day] = {};
                            }

                            coursesObj[parsedTime.day][parsedTime.time] = {
                                course_name: parsedCourse.course_name,
                                course_id: parsedCourse.course_id,
                                section: parsedCourse.section,
                                type: parsedTime.type,
                                room: parsedTime.room
                            }
                        }
                    }
                }

                if (target.textContent){
                   // console.log('Adding on Semester: ', target.textContent, ' => ', coursesObj);
                    semesters[target.textContent] = coursesObj;
                }
            }
        }

        //console.log('Semesters: ', semesters);

        console.log('Returning response');


        return new Response(JSON.stringify({message: {semesters: semesters, username: User}}), {status: 200});
        

        //return new Response(JSON.stringify({message: 'Login Successful'}), {status: 200});

    } catch (e) {
        return new Response(JSON.stringify({message: 'Proxy Server Error'}), {status: 500});
    }
}