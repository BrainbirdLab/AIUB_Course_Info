<script lang="ts">
	import { onMount } from "svelte";
    import Logo from "$lib/components/Logo.svelte";
    import { fade, fly } from "svelte/transition";
	import { updateLog, updateStatus } from "$lib/store.svelte";
    import { GetData } from "$lib/fetcher";
    import { goto } from "$app/navigation";

	let usernameLabel = $state("AIUB ID");
	let passwordLabel = $state("Password");

	let username: HTMLInputElement = $state() as HTMLInputElement;
	let password: HTMLInputElement = $state() as HTMLInputElement;
	let agree: HTMLInputElement = $state() as HTMLInputElement;

	let agreeChecked = $state(false);

	let uncheckedError = $state("");


	let submitting = $state(false);

	let showPassword = $state(false);

	function handleForm(e: Event) {
		//console.log("Reading form");
		e.preventDefault();

		if (username.value == "") {
			//console.log("Username is empty");
			usernameLabel = `<span style="color: orangered;">Please provide your ID</span>`
			username.focus();
			return;
		}

		//trim spaces
		username.value = username.value.trim();		

		if (/^\d{2}-\d{5}-\d{1}$/.test(username.value) == false) {
			//console.log("Invalid ID");
			usernameLabel = `<span style="color: orangered;">Invalid ID</span>`
			username.focus();
			return;
		}

		//console.log("Valid ID");

		if (password.value == "") {
			console.log("Password is empty");
			passwordLabel = `<span style="color: orangered;">Please provide your password</span>`
			password.focus();
			return;
		}

		if (agreeChecked == false) {
			uncheckedError = "Please agree to the terms of service";
			agree.focus();
			return;
		}

		const UserName = username.value;
		const Password = password.value;

		submitting = true;

		GetData(UserName, Password, false, (err) => {
			submitting = false;
			if (!err) {
				loaded = false;
				goto("/routine");
			}
		});
	}

	let loaded = $state(false);

	onMount(() => {
		loaded = true;
	});
</script>


{#if loaded}
<div class="formWrapper">
	<form onsubmit={handleForm} class="form" in:fly={{y: 20, delay: 200}}>
		<div class="title" in:fly|global={{x: -10, delay: 200}}>
			<a href="/"><Logo /></a>
			Login with your AIUB ID
		</div>
		{#if !submitting}
		<div class="formfield" in:fly|global={{y: 10, delay: 250}}>
			<input oninput={()=> {usernameLabel = 'AIUB ID'}}  placeholder="dd" type="text" bind:this={username} id="userid" name="UserName" />
			<label for="UserName">{@html usernameLabel}</label>
		</div>
		<div class="formfield mb-5" in:fly|global={{y: 10, delay: 300}}>
			<input oninput={() => {passwordLabel = 'Password'}} placeholder="99" type="{showPassword ? "text" : "password"}" bind:this={password} id="password" name="Password" />
			<label for="Password">{@html passwordLabel}</label>
			<button aria-label="show" in:fade|global={{delay: 500}} class="eye" type="button" onclick={()=> {showPassword = !showPassword}}>
				<i class="fa-solid {showPassword ? "fa-eye-slash" : "fa-eye"}"></i>
			</button>
		</div>
		{#if uncheckedError && agreeChecked == false}
		<div class="concent-error">
			{uncheckedError}
		</div>
		{/if}
		<label class="concent" in:fly|global={{x: 10, delay: 330}}>
			<input type="checkbox" name="agree" bind:this={agree} bind:checked={agreeChecked}>
			<div class="tick">
				{#if agreeChecked}
				<i class="fa-regular fa-check-square"></i>
				{:else}
				<i class="fa-regular fa-square"></i>
				{/if}
			</div>
			By logging in, you agree to our <a href="/terms" class="t">Terms & Privacy</a>
		</label>
		<button type="submit" in:fly|global={{y: 10, delay: 380}}>Login <i class="fa-solid fa-sign-in"></i></button>
		{/if}
		{#if updateLog.value}
		<div class="log" class:submitting={submitting} class:error={updateStatus.value === "error"}>
			{updateLog.value}
			{#if updateStatus.value === "error"}
			<i class="fa-solid fa-triangle-exclamation"></i>
			{/if}
		</div>
		{/if}
	</form>
</div>
{/if}

<style lang="scss">

	.mb-5{
		margin-bottom: 5px;
	}

	.concent-error {
		font-size: 0.7rem;
		color: orangered;
	}
	.concent {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		color: whitesmoke;
        font-size: 0.7rem;
		width: 100%;
        gap: 5px;
		cursor: pointer;
		input {
			display: none;
		}
        a {
            color: var(--accent);
            &:hover {
                filter: brightness(0.95);
            }
        }
	}

	.eye {
		background: none;
		width: initial;
		height: initial;
		padding: 0;
		margin: 0;
		right: 0px;
		position: absolute;
		color: var(--label-color);
	}

	.log{
		font-size: 0.8rem;
		color: var(--accent);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 3px;

		&.error{
			color: orangered;
		}

	}

	.fa-triangle-exclamation {
		color: orange !important;
	}

	.formWrapper{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 90vw;
		width: 350px;
		height: 450px;
		position: relative;
		margin-bottom: 30px;
	}

	.form{
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 15px;
		border: 2px solid var(--light-dark);
		border-radius: 10px;
		padding: 40px 20px;
		width: 100%;
		height: 100%;
		transition: 150ms ease-in-out;

		.title{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 10px;
			font-size: 1rem;
		}
	}

	.formfield{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		width: 100%;
		position: relative;

		label{
			position: absolute;
			transition: 200ms ease-in-out;
			pointer-events: none;
			width: 100%;
			font-size: 0.8rem;
			color: var(--label-color);
		}

		input:focus + label{
			transform: translateY(-20px);
			font-size: 0.6rem;
			color: var(--accent);
		}

		input::placeholder{
			opacity: 0;
		}

		input:not(:placeholder-shown) + label{
			transform: translateY(-20px);
			font-size: 0.6rem;
			opacity: 1;
			color: var(--accent);
		}
	}

	input{
		background: none;
		border: none;
		border-bottom: 2px solid var(--light-dark);
		padding: 10px;
		outline: none;
		width: 100%;
		color: ghostwhite;
		transition: 200ms ease-in-out;
		&:hover{
			border-bottom: 2px solid var(--hover-light-dark);
		}
		&:focus{
			border-bottom: 2px solid var(--accent);
		}
	}

	button{
		background: var(--light-dark);
		border: none;
		border-radius: 10px;
		padding: 10px 15px;
		color: ghostwhite;
		cursor: pointer;
		margin-top: 20px;
		&:hover{
			opacity: 0.9;
		}
	}

</style>