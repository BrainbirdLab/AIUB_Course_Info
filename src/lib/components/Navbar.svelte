<script lang="ts">

    import { currentPage } from "$lib/store.svelte";
    import { fade, slide } from "svelte/transition";

	const navs = [
		{
			"name": "Routine",
			"icon": "fa-regular fa-calendar-days",
			"href": "/routine",
		},
		{
			"name": "All Courses",
			"icon": "fa-solid fa-book",
			"href": "/all-courses",
		},
		{
			"name": "Completed",
			"icon": "fa-solid fa-circle-check",
			"href": "/complete",
		},
		{
			"name": "Unlocked",
			"icon": "fa-solid fa-unlock",
			"href": "/unlocked",
		},
		{
			"name": "Stats",
			"icon": "fa-solid fa-chart-line",
			"href": "/stats",
		},
		{
			"name": "Notice",
			"icon": "fa-solid fa-bell",
			"href": "/notice",
		},
		{
			"name": "Calendar",
			"icon": "fa-solid fa-calendar",
			"href": "/calendar",
		},
		{
			"name": "Faculties",
			"icon": "fa-solid fa-chalkboard-user",
			"href": "/faculties",
		},
		{
			"name": "Settings",
			"icon": "fa-solid fa-cog",
			"href": "/settings",
		},
	];

</script>

<div class="menu" in:fade>
	{#each navs as nav}
		<a
			class="navBtn"
			id="nav-{nav.name}"
			href="{nav.href}"
			class:shown={currentPage.value == nav.href}
			aria-label="{nav.name}"
		>
			<div class="content pointer-none">
				{#if currentPage.value == nav.href}
					<div class="nav-name" transition:slide={{axis: "x"}}>{nav.name}</div>
				{/if}
				<i class="{nav.icon}"></i>
			</div>
		</a>
	{/each}
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
		align-items: flex-end;
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
			padding: 5px;

			.content {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				justify-content: center;
				white-space: nowrap;
				gap: 5px;
				i {
					font-size: 1rem;
				}
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