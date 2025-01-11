<script lang="ts">

    import { currentPage } from "$lib/store.svelte";
    import { fade } from "svelte/transition";

</script>

<div class="menu" in:fade>
    <a
        class="navBtn"
        id="nav-Routine"
		href="/"
        class:shown={currentPage.value == "/"}
    >
        <div class="content pointer-none">
            Routine <i class="fa-regular fa-calendar-days"></i>
        </div>
    </a>
	<a
		class="navBtn"
		id="nav-AllCourses"
		href="/all-courses"
		class:shown={currentPage.value == "/all-courses"}
	>
		<div class="content pointer-none">
			All Courses <i class="fa-solid fa-book"></i>
		</div>
	</a>
    <a
        class="navBtn"
        id="nav-Completed"
		href="/complete"
        class:shown={currentPage.value == "/complete"}
    >
        <div class="content pointer-none" >
            Completed <i class="fa-solid fa-circle-check"></i>
        </div>
    </a>
    <a
        class="navBtn"
        id="nav-Unlocked"
		href="/unlocked"
        class:shown={currentPage.value == "/unlocked"}
    >
        <div class="content pointer-none">
            Unlocked <i class="fa-solid fa-unlock"></i>
        </div>
    </a>
	<a
		class="navBtn"
		id="nav-stats"
		href="/stats"
		class:shown={currentPage.value == "/stats"}
	>
		<div class="content pointer-none">
			Stats <i class="fa-solid fa-chart-bar"></i>
		</div>
	</a>
	<a
		class="navBtn"
		id="nav-Notice"
		href="/notice"
		class:shown={currentPage.value == "/notice"}
	>
		<div class="content pointer-none">
			Notice <i class="fa-solid fa-bell"></i>
		</div>
	</a>
	<a
		class="navBtn"
		id="nav-calendar"
		href="/calendar"
		class:shown={currentPage.value == "/calendar"}
	>
		<div class="content pointer-none">
			Calendar <i class="fa-solid fa-calendar"></i>
		</div>
	</a>
	<a
		class="navBtn"
		id="nav-faculties"
		href="/faculties"
		class:shown={currentPage.value == "/faculties"}
	>
		<div class="content pointer-none">
			Faculties <i class="fa-solid fa-chalkboard-user"></i>
		</div>
	</a>
</div>


<style lang="scss">

	.menu {
		display: flex;
		flex-direction: row;
		gap: 8px;
		list-style: none;
		color: var(--accent);
		position: sticky;
		top: 0;
		padding: 5px 15px;
		background: var(--primary);
		justify-content: safe center;
		align-items: center;
		width: 100%;
		z-index: 20;
		overflow-x: scroll;
		a {
			cursor: pointer;
			text-align: center;
			font-size: 0.75rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 5px;
			text-decoration: none;
			color: inherit;

			.content {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				justify-content: center;
				white-space: nowrap;
				gap: 5px;
				&.pointer-none{
					pointer-events: none;
				}
			}

			&::after {
				content: "";
				display: block;
				width: 100%;
				height: 2px;
				background: var(--accent);
				transition: 200ms ease-in-out;
				transform: scaleX(0);
				filter: brightness(1);
				transform-origin: center;
			}

			&:hover {
				filter: brightness(1.2);
			}
		}

		a.shown {
			&::after {
				transform: scaleX(1);
			}
		}
	}
</style>