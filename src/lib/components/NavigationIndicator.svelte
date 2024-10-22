<script lang="ts">
    import { navigating } from "$app/stores";
</script>

{#if !!$navigating}
    <div class="navigationIndicator"></div>
{/if}

<style lang="scss">
    .navigationIndicator {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--accent);
        animation: navigate 5s;
        z-index: 1000;
    }
    
    @keyframes navigate {
        /* fast width from 0 to 50% in 1s */
        0% {
            width: 0;
        }
        25% {
            width: 50%;
        }
        /* slow width from 50% to 100% in 5s */
        90% {
            width: 95%;
        }
        100% {
            width: 95%;
        }
    }
</style>