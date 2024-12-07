<script lang="ts">
    import { fly } from 'svelte/transition';

    interface Props {
        filterValue: string;
    }

    let { filterValue = $bindable() }: Props = $props();

</script>

<div class="search" in:fly|global={{x: 10}}>
    <i class="fa-solid fa-magnifying-glass"></i>
    <input type="text" autocomplete="off" placeholder="Search courses..." bind:value={filterValue}/>
    <button class="clear" aria-label="clear" onclick={() => filterValue = ''}>
        <i class="fa-solid fa-times"></i>
    </button>
</div>