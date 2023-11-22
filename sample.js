
const html = `<div class="grade-report margin5" id="divPrint">
    
<h3 class="text-center">American International University-Bangladesh</h3>
<h5 class="text-center">Curriculum Courses</h5>
<table class="table table-bordered margin-none curriculum-info">
    <tr>
        <td style="width: 30%">
            Curriculum No:
        </td>
        <td>
            309
    </td>

    <td style="width: 30%">
        Title:
    </td>
    <td>
        Bachelor of Science in Computer Science &amp; Engineering
</td>
</tr>

</table>
    <label>Semester: 1</label>
    <table class="table table-bordered">
        <tr>
            <th style="width: 10%">Code</th>
            <th style="width: 50%">Name</th>
            <th style="width: 20%">Credit<br />(Lec-Sci-Comp-Lan-Stu)</th>
            <th style="width: 20%">Pre-Requisite</th>
        </tr>
            <tr>
                <td>MAT1102</td>
                <td>DIFFERENTIAL CALCULUS &amp; CO-ORDINATE GEOMETRY</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>PHY1101</td>
                <td>PHYSICS 1</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>PHY1102</td>
                <td>PHYSICS 1 LAB</td>
                <td>
                    1 1 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>ENG1101</td>
                <td>ENGLISH READING SKILLS &amp; PUBLIC SPEAKING</td>
                <td>
                    3 0 0 1 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC1102</td>
                <td>INTRODUCTION TO PROGRAMMING</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC1103</td>
                <td>INTRODUCTION TO PROGRAMMING LAB</td>
                <td>
                    1 0 1 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC1101</td>
                <td>INTRODUCTION TO COMPUTER STUDIES</td>
                <td>
                    1 0 1 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
    </table>
    <label>Semester: 2</label>
    <table class="table table-bordered">
        <tr>
            <th style="width: 10%">Code</th>
            <th style="width: 50%">Name</th>
            <th style="width: 20%">Credit<br />(Lec-Sci-Comp-Lan-Stu)</th>
            <th style="width: 20%">Pre-Requisite</th>
        </tr>
            <tr>
                <td>CSC1204</td>
                <td>DISCRETE MATHEMATICS</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>MAT1102</li>
                        <li>CSC1102</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>MAT1205</td>
                <td>INTEGRAL CALCULUS &amp; ORDINARY DIFFERENTIAL EQUATIONS</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>MAT1102</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC1205</td>
                <td>OBJECT ORIENTED PROGRAMMING 1</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC1102</li>
                        <li>CSC1103</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>PHY1203</td>
                <td>PHYSICS 2</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>PHY1101</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>PHY1204</td>
                <td>PHYSICS 2 LAB</td>
                <td>
                    1 1 0 0 0
            </td>
            <td>
                <ul>
                        <li>PHY1102</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>ENG1202</td>
                <td>ENGLISH WRITING SKILLS &amp; COMMUNICATION</td>
                <td>
                    3 0 0 1 0
            </td>
            <td>
                <ul>
                        <li>ENG1101</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>COE2101</td>
                <td>INTRODUCTION TO ELECTRICAL CIRCUITS</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>PHY1101</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>COE2102</td>
                <td>INTRODUCTION TO ELECTRICAL CIRCUITS LAB</td>
                <td>
                    1 1 0 0 0
            </td>
            <td>
                <ul>
                        <li>PHY1102</li>
                </ul>
                
            </td>
        </tr>
    </table>
    <label>Semester: 3</label>
    <table class="table table-bordered">
        <tr>
            <th style="width: 10%">Code</th>
            <th style="width: 50%">Name</th>
            <th style="width: 20%">Credit<br />(Lec-Sci-Comp-Lan-Stu)</th>
            <th style="width: 20%">Pre-Requisite</th>
        </tr>
            <tr>
                <td>CHEM1101</td>
                <td>CHEMISTRY</td>
                <td>
                    3 1 0 0 0
            </td>
            <td>
                <ul>
                        <li>PHY1203</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>MAT2101</td>
                <td>COMPLEX VARIABLE,LAPLACE &amp; Z-TRANSFORMATION</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>MAT1205</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC2108</td>
                <td>INTRODUCTION TO DATABASE</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC1205</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>EEE2104</td>
                <td>ELECTRONIC DEVICES LAB</td>
                <td>
                    1 1 0 0 0
            </td>
            <td>
                <ul>
                        <li>COE2102</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>BBA1102</td>
                <td>PRINCIPLES OF ACCOUNTING</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>MAT1205</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>EEE2103</td>
                <td>ELECTRONIC DEVICES</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>COE2101</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC2106</td>
                <td>DATA STRUCTURE</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>CSC1204</li>
                        <li>CSC1205</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC2107</td>
                <td>DATA STRUCTURE LAB</td>
                <td>
                    1 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC1204</li>
                        <li>CSC1205</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>BAE2101</td>
                <td>COMPUTER AIDED DESIGN &amp; DRAFTING</td>
                <td>
                    1 0 1 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
    </table>
    <label>Semester: 4</label>
    <table class="table table-bordered">
        <tr>
            <th style="width: 10%">Code</th>
            <th style="width: 50%">Name</th>
            <th style="width: 20%">Credit<br />(Lec-Sci-Comp-Lan-Stu)</th>
            <th style="width: 20%">Pre-Requisite</th>
        </tr>
            <tr>
                <td>CSC2211</td>
                <td>ALGORITHMS</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC2106</li>
                        <li>CSC2107</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>MAT2202</td>
                <td>MATRICES, VECTORS, FOURIER ANALYSIS</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>MAT2101</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC2210</td>
                <td>OBJECT ORIENTED PROGRAMMING 2 </td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC2108</li>
                        <li>CSC1205</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC2209</td>
                <td>OBJECT ORIENTED ANALYSIS AND DESIGN</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>CSC2108</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>BAS2101</td>
                <td>BANGLADESH STUDIES</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>CSC1101</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>EEE3101</td>
                <td>DIGITAL LOGIC AND CIRCUITS</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>EEE2103</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>EEE3102</td>
                <td>DIGITAL LOGIC AND CIRCUITS LAB</td>
                <td>
                    1 1 0 0 0
            </td>
            <td>
                <ul>
                        <li>EEE2104</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>MAT3103</td>
                <td>COMPUTATIONAL STATISTICS AND PROBABILITY</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>MAT2101</li>
                </ul>
                
            </td>
        </tr>
    </table>
    <label>Semester: 5</label>
    <table class="table table-bordered">
        <tr>
            <th style="width: 10%">Code</th>
            <th style="width: 50%">Name</th>
            <th style="width: 20%">Credit<br />(Lec-Sci-Comp-Lan-Stu)</th>
            <th style="width: 20%">Pre-Requisite</th>
        </tr>
            <tr>
                <td>CSC3113</td>
                <td>THEORY OF COMPUTATION</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>CSC2211</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>ECO3150</td>
                <td>PRINCIPLES OF ECONOMICS </td>
                <td>
                    2 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>MAT3103</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>ENG2103</td>
                <td>BUSINESS COMMUNICATION</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>BAS2101</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>MAT3101</td>
                <td>NUMERICAL METHODS FOR SCIENCE AND ENGINEERING</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>MAT2202</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>COE3103</td>
                <td>DATA COMMUNICATION</td>
                <td>
                    3 1 0 0 0
            </td>
            <td>
                <ul>
                        <li>EEE3101</li>
                        <li>EEE3102</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>COE3104</td>
                <td>MICROPROCESSOR AND EMBEDDED SYSTEM</td>
                <td>
                    3 1 0 0 0
            </td>
            <td>
                <ul>
                        <li>EEE3101</li>
                        <li>EEE3102</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC3112</td>
                <td>SOFTWARE ENGINEERING</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC2209</li>
                        <li>CSC2210</li>
                </ul>
                
            </td>
        </tr>
    </table>
    <label>Semester: 6</label>
    <table class="table table-bordered">
        <tr>
            <th style="width: 10%">Code</th>
            <th style="width: 50%">Name</th>
            <th style="width: 20%">Credit<br />(Lec-Sci-Comp-Lan-Stu)</th>
            <th style="width: 20%">Pre-Requisite</th>
        </tr>
            <tr>
                <td>CSC3217</td>
                <td>ARTIFICIAL INTELLIGENCE AND EXPERT SYS.</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC2211</li>
                        <li>MAT3103</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>COE3206</td>
                <td>COMPUTER NETWORKS</td>
                <td>
                    3 1 0 0 0
            </td>
            <td>
                <ul>
                        <li>COE3103</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>COE3205</td>
                <td>COMPUTER ORGANIZATION AND ARCHITECTURE</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>COE3104</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC3214</td>
                <td>OPERATING SYSTEM</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC2211</li>
                        <li>COE3104</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC3215</td>
                <td>WEB TECHNOLOGIES</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC3112</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>EEE2216</td>
                <td>ENGINEERING ETHICS</td>
                <td>
                    2 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>CSC3112</li>
                        <li>COE3104</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC3216</td>
                <td>COMPILER DESIGN</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC3113</li>
                </ul>
                
            </td>
        </tr>
    </table>
    <label>Semester: 7</label>
    <table class="table table-bordered">
        <tr>
            <th style="width: 10%">Code</th>
            <th style="width: 50%">Name</th>
            <th style="width: 20%">Credit<br />(Lec-Sci-Comp-Lan-Stu)</th>
            <th style="width: 20%">Pre-Requisite</th>
        </tr>
            <tr>
                <td>CSC4118</td>
                <td>COMPUTER GRAPHICS</td>
                <td>
                    3 0 1 0 0
            </td>
            <td>
                <ul>
                        <li>CSC2211</li>
                        <li>MAT2202</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC****</td>
                <td>COS ELECTIVE 1</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>MGT3202</td>
                <td>ENGINEERING MANAGEMENT</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>EEE2216</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC4197</td>
                <td>RESEARCH METHODOLOGY</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC####</td>
                <td>CSE MAJOR 1</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC####</td>
                <td>CSE MAJOR 2</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC####</td>
                <td>CSE MAJOR 3</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
    </table>
    <label>Semester: 8</label>
    <table class="table table-bordered">
        <tr>
            <th style="width: 10%">Code</th>
            <th style="width: 50%">Name</th>
            <th style="width: 20%">Credit<br />(Lec-Sci-Comp-Lan-Stu)</th>
            <th style="width: 20%">Pre-Requisite</th>
        </tr>
            <tr>
                <td>CSC4298</td>
                <td>THESIS / PROJECT</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                        <li>CSC4197</li>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC****</td>
                <td>COS ELECTIVE 2</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
            <tr>
                <td>CSC4299</td>
                <td>INTERNSHIP</td>
                <td>
                    3 0 0 0 0
            </td>
            <td>
                <ul>
                </ul>
                
            </td>
        </tr>
    </table>

</div>


<script type="text/javascript">
$('#btnPrint').click(function () {
    $('#btnPrint').hide();
    $('#header').hide();
    //document.getElementById("studentList").print();
    window.print();
    return false;
});
</script>

`;



import jsdom from 'jsdom';

const { JSDOM } = jsdom;

const dom = new JSDOM(html);

const { document } = dom.window;

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

const getHtml = (selector) => $(selector).innerHTML;

const getText = (selector) => $(selector).textContent;

let courses;

//courses will contain all course names, course codes, credits, prerequisites ignore the table headers and labels only get the text content. A course cam have array of prerequisites

const allCourses = document.querySelectorAll('.table-bordered tr:not(:first-child)');

console.log(`${allCourses.length} Courses extracted`);

courses = Array.from(allCourses).map((course) => {
    const courseCode = course.querySelector('td:nth-child(1)').textContent.trim();
    const courseName = course.querySelector('td:nth-child(2)').textContent.trim();
    const credits = course.querySelector('td:nth-child(3)').textContent.trim().split(' ').map((credit) => parseInt(credit)).sort((a, b) => b - a)[0];
    //const prerequisites = course.querySelector('td:nth-child(4)').textContent.trim(); //this will give the prerequisites as a string, we need to split it and make an array
    const prerequisites = Array.from(course.querySelectorAll('td:nth-child(4) li')).map((li) => li.textContent.trim());
    return {
        courseCode,
        courseName,
        credits,
        prerequisites
    }
});

//save the courses in a json file
import fs from 'fs';
fs.writeFileSync('courses.json', JSON.stringify(courses, null, 2));

console.log('Output saved');

