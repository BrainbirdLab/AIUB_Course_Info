<script lang="ts">
    const version = __VERSION__;
	
	interface Props {
		padding?: string
	}

    let {padding = "0px"} : Props = $props();

</script>

<footer class="footer" style:padding={padding}>
	<div class="terms">
		<a href="/terms">Terms of Service</a>
	</div>
	•
	<div class="discord">
		<a href="https://discord.gg/yQKcHhKzyn"
			>Join our Discord <i class="fa-brands fa-discord"></i></a
		>
	</div>
	•
    <div class="source">
        <a href="https://github.com/BrainbirdLab/AIUB_Course_Info"
            >Source code <i class="fa-solid fa-code"></i></a
        >
    </div>
    •
    <div class="verision">
        v{version}
    </div>
	•
	<div class="systemStatus">
		<a href="/status">System Status</a>
	</div>
</footer>

<style lang="scss">
    .footer {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 10px;
		gap: 5px;
		font-size: 0.6rem;
		position: relative;
		margin: auto 0 0;
		color: var(--label-color);

		a {
			text-decoration: underline;
			color: inherit;
		}

		i {
			font-size: inherit;
		}
	}
</style>