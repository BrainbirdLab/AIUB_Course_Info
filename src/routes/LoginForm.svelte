<script lang="ts">
	import { onMount } from "svelte";
    import Logo from "./Logo.svelte";
    import { fade, fly } from "svelte/transition";
	import { showLogin, updateLog, updateStatus } from "$lib/store";
    import { GetData } from "../lib/fetcher";

	let usernameLabel = "AIUB ID";
	let passwordLabel = "Password";
	let username: HTMLInputElement;
	let password: HTMLInputElement;

	let submitting = false;

	let showPassword = false;

	function handleForm(){
		//console.log("Reading form");

		if (username.value == "") {
			//console.log("Username is empty");
			usernameLabel = `<span style="color: orangered;">Please provide your ID</span>`
			username.focus();
			return;
		}

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

		const UserName = username.value;
		const Password = password.value;

		submitting = true;

		GetData(UserName, Password, (err) => {
			submitting = false;
			if (!err) {
				loaded = false;
			} 
		});
	}

	let loaded = false;

	onMount(() => {
		loaded = true;
	});
</script>


{#if loaded}
<div class="formWrapper">
	<form on:submit|preventDefault={handleForm} class="form" in:fly={{y: 20, delay: 200}}>
		<div class="title" in:fly|global={{x: -10, delay: 200}}>
			<Logo />
			Login with your AIUB ID
		</div>
		{#if !submitting}
		<div class="formfield" in:fly|global={{y: 10, delay: 250}}>
			<input on:input={()=> {usernameLabel = 'AIUB ID'}}  placeholder="dd" type="text" bind:this={username} id="userid" name="UserName" />
			<label for="UserName">{@html usernameLabel}</label>
		</div>
		<div class="formfield" in:fly|global={{y: 10, delay: 300}}>
			<input on:input={() => {passwordLabel = 'Password'}} placeholder="99" type="{showPassword ? "text" : "password"}" bind:this={password} id="password" name="Password" />
			<label for="Password">{@html passwordLabel}</label>
			<button in:fade|global={{delay: 500}} class="eye" type="button" on:click={()=> {showPassword = !showPassword}}>
				<i class="fa-solid {showPassword ? "fa-eye-slash" : "fa-eye"}"></i>
			</button>
		</div>
		<button type="submit" in:fly|global={{y: 10, delay: 350}}>Login <i class="fa-solid fa-sign-in"></i></button>
		{/if}
		{#if $updateLog}
		<div class="log" class:submitting={submitting} class:error={$updateStatus === "error"}>
			{$updateLog}
			{#if $updateStatus === "error"}
			<i class="fa-solid fa-triangle-exclamation"></i>
			{/if}
		</div>
		{/if}
	</form>
</div>
{/if}


<style lang="scss">

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
		height: 400px;
		position: relative;
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

		&:has(.submitting){
			height: 200px;
		}

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