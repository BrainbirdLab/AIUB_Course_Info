<script lang="ts">
        import { onMount } from "svelte";
    import Logo from "./Logo.svelte";
    import { fly } from "svelte/transition";
	import {showLogin, semesterData, type SemesterDataType, User} from "$lib/store";

	let usernameLabel = "AIUB ID";
	let passwordLabel = "Password";
	let username: HTMLInputElement;
	let password: HTMLInputElement;

	let submitting = false;
	let errlog = false;
	let logText = "";

	async function handleForm(){
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

		//console.log("Valid Password");

		//console.log("Submitting form");



		submitting = true;

		errlog = false;
		logText = "Communicating with server...";

		try{
			const res = await fetch('/api', {
				method: 'POST',
				body: new URLSearchParams({
					'UserName': username.value,
					'Password': password.value
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
			submitting = false;
			
			const data = await res.json();


			if (res.ok){
				errlog = false;
				//console.log(data);
				//logText = data.message;
				semesterData.set(data.message.semesters);
				User.set(data.message.username);
				localStorage.setItem('classData', JSON.stringify(data.message.semesters));
				localStorage.setItem('user', data.message.username);
				showLogin.set(false);
			} else {
				errlog = true;
				//console.log(data);
				logText = data.message;
			}

		} catch(e){
			console.log(e);
			errlog = true;
			logText = "Something went wrong";
		}


	}
</script>



<form on:submit|preventDefault={handleForm} class="form" in:fly={{y: 20, delay: 200}}>
	<div class="title" in:fly|global={{x: 10, delay: 200}}>
		<Logo />
		Login with your AIUB ID
	</div>
	{#if !submitting}
	<div class="formfield" in:fly|global={{y: 10, delay: 250}}>
		<input on:input={()=> {usernameLabel = 'AIUB ID'}}  placeholder="dd" type="text" bind:this={username} id="userid" name="UserName" />
		<label for="UserName">{@html usernameLabel}</label>
	</div>
	<div class="formfield" in:fly|global={{y: 10, delay: 300}}>
		<input on:input={() => {passwordLabel = 'Password'}} placeholder="99" type="password" bind:this={password} id="password" name="Password" />
		<label for="Password">{@html passwordLabel}</label>
	</div>
	<button type="submit" in:fly|global={{y: 10, delay: 350}}>Login <i class="fa-solid fa-sign-in"></i></button>
	{/if}
	{#if logText}
	<div class="log" class:submitting={submitting} class:error={errlog}>{logText}</div>
	{/if}
</form>



<style lang="scss">

	.log{
		font-size: 0.8rem;
		color: var(--accent);
		&.error{
			color: orangered;
		}
	}

	.form{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 15px;
		border: 2px solid var(--light-dark);
		border-radius: 10px;
		padding: 40px 20px;
		max-width: 90vw;
		width: 400px;
		height: 400px;
		transition: 200ms ease-in-out;

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