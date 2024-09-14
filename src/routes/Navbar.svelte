<script lang="ts">
    import { pushState } from "$app/navigation";
    import { fade } from "svelte/transition";
    import { tabs, type TABS } from "$lib/store";

    function showOptions() {
		pushState("", { options: true });
	}

    function handleNav(node: HTMLElement) {
		node.onclick = (e: Event) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains("navBtn")) {
				const id = target.id;
				tabs.set(id.split("-")[1] as TABS);
				localStorage.setItem("tabs", $tabs);
			}
		};

		return {
			destroy() {
				node.onclick = null;
			},
		};
	}
</script>

<ul class="menu" use:handleNav in:fade>
    <li
        class="navBtn"
        id="nav-Routine"
        class:shown={$tabs == "Routine"}
    >
        <div class="content pointer-none">
            Routine <i class="fa-regular fa-calendar-days"></i>
        </div>
    </li>
    <li
        class="navBtn"
        id="nav-Completed"
        class:shown={$tabs == "Completed"}
    >
        <div class="content pointer-none">
            Completed <i class="fa-solid fa-circle-check"></i>
        </div>
    </li>
    <li
        class="navBtn"
        id="nav-Unlocked"
        class:shown={$tabs == "Unlocked"}
    >
        <div class="content pointer-none">
            Unlocked <i class="fa-solid fa-unlock"></i>
        </div>
    </li>
	<li
		class="navBtn"
		id="nav-Notice"
		class:shown={$tabs == "Notice"}
	>
		<div class="content pointer-none">
			Notice <i class="fa-solid fa-bell"></i>
		</div>
	</li>
    <li class="options">
        <button class="content" on:click={showOptions}>
            Options
            <i class="fa-solid fa-wrench"></i>
        </button>
    </li>
</ul>

<style lang="scss">
    	.options {
		color: tomato;
		font-size: 0.7rem;
		button{
			color: inherit;
			font-size: inherit;
		}
	}
	.menu {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 15px;
		list-style: none;
		color: var(--accent);
		position: sticky;
		top: 0;
		padding: 10px;
		background: var(--primary);
		justify-content: center;
		align-items: center;
		width: 100%;
		z-index: 20;
		li {
			cursor: pointer;
			text-align: center;
			font-size: 0.7rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 5px;

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

		li.shown {
			&::after {
				transform: scaleX(1);
			}
		}
	}
</style>