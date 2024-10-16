<script lang="ts">
    import { pushState } from "$app/navigation";
    import { page } from "$app/stores";
    import { currentPage } from "$lib/store";
    import { fade } from "svelte/transition";

	let tabs = "Routine";

	function showOptions() {
		pushState("", { options: true });
	}

</script>

<div class="menu" in:fade>
    <a
        class="navBtn"
        id="nav-Routine"
		href="/"
        class:shown={$currentPage == "/"}
    >
        <div class="content pointer-none">
            Routine <i class="fa-regular fa-calendar-days"></i>
        </div>
    </a>
    <a
        class="navBtn"
        id="nav-Completed"
		href="/complete"
        class:shown={$currentPage == "/complete"}
    >
        <div class="content pointer-none" >
            Completed <i class="fa-solid fa-circle-check"></i>
        </div>
    </a>
    <a
        class="navBtn"
        id="nav-Unlocked"
		href="/unlocked"
        class:shown={$currentPage == "/unlocked"}
    >
        <div class="content pointer-none">
            Unlocked <i class="fa-solid fa-unlock"></i>
        </div>
    </a>
	<a
		class="navBtn"
		id="nav-Notice"
		href="/notice"
		class:shown={$currentPage == "/notice"}
	>
		<div class="content pointer-none">
			Notice <i class="fa-solid fa-bell"></i>
		</div>
	</a>
	<a
		class="navBtn"
		id="nav-calendar"
		href="/calendar"
		class:shown={$currentPage == "/calendar"}
	>
		<div class="content pointer-none">
			Calendar <i class="fa-solid fa-calendar"></i>
		</div>
	</a>
	<button class="option" on:click={showOptions}>
		<i class="fa-solid fa-gear"></i>
	</button>
</div>


<style lang="scss">

	.option{
		color: var(--accent);
		width: 40px;
    	height: 40px;
		i {
			font-size: 1.2rem;
			color: inherit;
		}
	}

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
			font-size: 0.65rem;
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