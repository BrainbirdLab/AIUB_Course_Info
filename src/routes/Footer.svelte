<script lang="ts">
    const version = __VERSION__;
    export let padding: string = "0px";
</script>

<footer class="footer" style:padding={padding}>
    <div class="source">
        <a href="https://github.com/BrainbirdLab/AIUB_Course_Info"
            >Source code <i class="fa-solid fa-code"></i></a
        >
    </div>
    ・
    <div class="support">
        <a href="https://github.com/BrainbirdLab/AIUB_Course_Info/issues">
            Submit issues <i class="fa-solid fa-circle-exclamation"></i>
        </a>
    </div>
    ・
    <div class="verision">
        v{version}
    </div>
</footer>

<style lang="scss">
    .footer {
		display: flex;
		flex-direction: row;
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