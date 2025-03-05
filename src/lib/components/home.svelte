<script lang="ts">

    import { fade, fly } from "svelte/transition";
    import "$lib/styles/global.scss";
    import Footer from "$lib/components/Footer.svelte";
    import { showLogin } from "$lib/store.svelte";

    const compilerVersion = __VERSION__;

    const buttons = [
        {
            name: "Discord",
            href: "https://discord.gg/yQKcHhKzyn",
            class: "discord",
        },
        {
            name: showLogin.value ? "Login" : "Dashboard",
            href: showLogin.value ? "/login" : "/routine",
            class: "dashboard",
        },
    ]

    const targets = [
        {
            name: "Windows",
            icon: "fab fa-windows",
        },
        {
            name: "MacOS",
            icon: "fab fa-apple",
        },
        {
            name: "Linux",
            icon: "fab fa-ubuntu",
        },
        {
            name: "Android",
            icon: "fab fa-android",
        },
    ]
</script>

<div class="container">
    <div class="center flex column pad-top" in:fly|global={{ y: -10, delay: 100 }}>
        <div class="flex column center">
            <img src="/aiub.png" alt="AIUB Logo" />
            <div class="name">
                <span class="">AIUB</span><span class="blue">Pocket</span>
            </div>
        </div>
        <div class="version-info">
            <div class="version">v.{compilerVersion}</div>
            Free and Open Source
        </div>
    </div>
    
    <span class="big-title center" in:fly|global={{ x: -10, delay: 200 }}
        >Daily companion for AIUBians</span
    >
    <div class="more center" in:fade|global={{ delay: 250 }}>
        AIUB Pocket is an easy to use, all-in-one app for AIUB students. It provides regular class routines, course details and preregistration info. It also delivers all official notices via in app notifications and allows students to visualize their academic progress.
    </div>
    
    <div class="button-group">
        {#each buttons as button, i}
            <a
                in:fly|global={{ y: 5, delay: (i+1)*200 }}
                class="button-link {button.class}"
                href={button.href}
            >
                {button.name}
            </a>
        {/each}
    </div>

    
    <section class="runsOn">
        <ul>
            {#each targets as target, i}
            <li in:fly|global={{ y: 10, delay: ((i+1)*100) + 100 }}>
                <i class="{target.icon}"></i>
            </li>
            {/each}
        </ul>
    </section>
    
    <div class="breakout-wrapper" in:fly={{ x: 20, delay: 100 }}>
        <img class="breakout" src="/screenshots/routine.png" alt="back" />
    </div>

    <article in:fade>
        <section class="feature">
            <div class="row inner-content">
                <div class="item-info">
                    <div class="item-title">
                        All class routines in one place with details
                    </div>
                    <div class="item-text">
                        See all of your class routines in one place with detailed visualization. Update your routine with a single click if you're already logged in.
                    </div>
                </div>

                <img src="/screenshots/routine.png" alt="routine" />

            </div>
        </section>
        <section class="rev feature">
            <div class="row inner-content">
            <img src="/screenshots/courses.png" alt="courses">
            <div class="item-info">
                <div class="item-title">
                    See courses you have completed in one place
                </div>
                <div class="item-text">
                    Get a detailed view of all the courses you have completed along with the course code, credit hours and grades. You can hide the grade displayed from the settings.
                </div>
            </div>
            </div>
        </section>
        <section class="feature">
            <div class="row inner-content">
                <div class="item-info">
                    <div class="item-title">
                        Pre registrable courses based on your previous and current courses
                    </div>
                    <div class="item-text">
                        When you are eligible for a course, you can see it here. If you take the course in the pre-registration, a "Registered" tag will be added to that course.
                    </div>
                </div>
                
                <img src="/screenshots/prereg.png" alt="courses">

            </div>
        </section>
        <section class="feature">
            <div class="row inner-content">
                <img src="/screenshots/notice.png" alt="notice" />
                <div class="item-info">
                    <div class="item-title">
                        Official notices and updates in one place
                    </div>
                    <div class="item-text">
                        You don't need to visit the website to see the latest notices. All official notices will be delivered to you via in-app notifications instantly. Our system continously checks for new notices and updates.
                    </div>
                </div>
            </div>
        </section>
        <section class="feature">
            <div class="row inner-content">
                <div class="item-info">
                    <div class="item-title">
                        Visualize your academic progress throughout academic life
                    </div>
                    <div class="item-text">
                        Various charts and graphs will help you visualize your academic progress. You can see your GPA, CGPA and your performance based on departments and subjects.
                    </div>
                </div>
                
                <img src="/screenshots/stats.png" alt="progress" />

            </div>
        </section>
        <section class="feature">
            <div class="row inner-content">
                <img src="/screenshots/faculties.png" alt="faculty" />
                <div class="item-info">
                    <div class="item-title">
                        Faculty list and contact information
                    </div>
                    <div class="item-text">
                        Get a list of all the faculties and their contact information. You can search and filter by departments and names.
                    </div>
                </div>
            </div>
        </section>
        <section class="support" style="flex-direction: row;">
            <div class="inner-content col">
                <h3 class="item-title">Buy me a coffee</h3>
                <div class="row">
                    <div class="col">
                        If you like the project and want to support me, you can buy me a coffee. Your support will help me keep the project running and improve it.
                        <a
                            class="button-link"
                            href="https://www.buymeacoffee.com/itsfuad"
                            target="_blank"
                        >
                        Buy me a coffee <i class="fa-solid fa-coffee"></i>
                        </a>
                    </div>
                </div>
            </div>
            <img class="qr" src="/bmc_qr.png" alt="Buy me a coffee" />
            <Footer />
        </section>
    </article>
    
</div>

<style lang="scss">

    .blue {
        color: #1182f2;
    }

    .yellow {
        color: #ffc107;
    }

    .qr {
        width: 200px;
        border-radius: 17px;
        border: 2px solid;
    }

    .support {
        background: #1a1a1a;
        width: 100%;
        padding: 50px 10px;
        gap: 30px;
        min-width: 100%;
        border-radius: 0;
        flex-direction: row;
        flex-wrap: wrap;
        .col {
            max-width: 600px;
        }
    }

    .container{
        //padding: 10px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        overflow: initial;
    }

    .item-info{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 10px;
        font-size: 0.9rem;
        .item-title{
            font-size: 1.6rem;
            font-weight: bold;
        }
        .item-text{
            font-size: 0.9rem;
        }
    }

    article{
        width: 100% !important;
        max-width: initial;
        background: #E91E63;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        perspective: 1000px;
    }

    .feature{
        display: flex;
        align-items: center !important;
        justify-content: center !important;
        list-style: none;
        list-style: none;
        border-radius: 0;
        padding: 50px 10px;
        min-height: 350px;
        max-width: initial;
        width: 100%;
        overflow-x: clip;

        .inner-content{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            max-width: 900px;
        }

        //odd child
        &:nth-child(odd){
            background: #182c3b;
            img {
                transform: perspective(5in) rotate3d(6, -10, 2, 45deg);
            }
        }
        // even child
        &:nth-child(even){
            background: #041e2f;
            img {
                transform: perspective(5in) rotate3d(-4, -9, 2, -61deg);
            }
        }

        img {
            z-index: 1;
            filter: blur(1px);
        }

        .item-info{
            z-index: 2;
        }
    }

    .button-group{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 10px;
        margin-bottom: 45px;
    }

    .button-link {
        padding: 10px 20px;
        border-radius: 25px;
        background: rgb(0 120 214);
        color: #ffffff;
        font-size: 1rem;
        text-decoration: none;

        &.dashboard {
            background: var(--accent);
        }

        &.discord {
            background: var(--light-dark);
        }

        &:hover {
            text-decoration: underline;
        }
    }

    .fa-windows {
        color: #0078d6;
    }

    .fa-apple {
        color: #ffffff;
    }

    .fa-ubuntu {
        color: #f96834;
    }

    .fa-android {
        color: #21ff73;
    }
    
    section {
        width: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
    }


    .runsOn {
        padding: 42px 0;
        ul {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 20px;
            li {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10px;
                margin: 10px 0;
                font-size: 3.4rem;
            }
        }
    }

    .breakout-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        max-width: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: -1;
        perspective: 1000px;
    }

    .breakout {
        border-radius: 10px;
        //max-width: 100%;
        //width: 400px;
        width: 100%;
        //rotate 3d
        position: absolute;
        top: 50%;
        left: 0;
        z-index: -1;
        //3d perspective rotate
        filter: blur(5px);
        transform: translateY(-50%) rotateY(50deg) rotateX(30deg);
        transition: transform 0.5s;
    }

    .name {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
    }

    .version-info {
        font-size: 0.7rem;
        color: #ffffff;
        padding: 0 5px 0 0;
        border-radius: 5px;
        width: max-content;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-weight: normal;
        gap: 5px;
        background: rgba(91, 251, 91, 0.156);
        color: rgb(170, 255, 170);
        .version {
            background: rgba(0, 0, 0, 0.997);
            height: 100%;
            padding: 5px 5px;
            color: ghostwhite;
            font-family: inherit;
            border-top-left-radius: inherit;
            border-bottom-left-radius: inherit;
        }
    }

    .big-title {
        color: #ffffff !important;
        line-height: 1;
        max-width: min(800px, 98vw);
        font-size: min(5rem, 15vw) !important;
        text-align: center;
    }

    .more {
        font-size: min(4.5vw, 1rem);
        max-width: 600px;
        color: #ffffffa1;
        text-align: center;
        padding: 20px 0;
    }

    .center {
        text-align: center !important;
    }

    section {
        border-radius: 10px;
        //background: #ffffff17;
        color: rgb(240, 240, 240);
        font-size: 0.9rem;
        width: 100%;
        max-width: 900px;

        .row{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }

        .col {
            display: flex;
            flex-direction: column !important;
            align-items: flex-start;
            gap: 10px;
        }

        img {
            border-radius: 10px;
            max-width: 100%;
            width: 400px;
        }
    }

    .pad-top {
        margin-top: 50px;
    }

    //on mobile ratio, make it column
    @media screen and (orientation: portrait) {
        .row {
            flex-direction: column !important;
            align-items: center !important;

            img{
                width: auto;
                flex-grow: 1;
            }
        }
    }
</style>
