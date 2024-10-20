<script lang="ts">
    import { fade, fly } from "svelte/transition";


    let controller: AbortController | null = null; 

    let titleLabel = "Title";
    let messageLabel = "Message";
    let actLabel = "Act";
    let authLabel = "Auth Key";

    let title: HTMLInputElement;
    let message: HTMLInputElement;
    let act: HTMLInputElement;
    let auth: HTMLInputElement;

    let submitting = false;
    let updateLog = "";
    let updateStatus = "";

    let showAuth = false;

    let timeout: number;
    
    function sendPush() {

        if (auth.value == "") {
            authLabel = `<span style="color: orangered;">Please provide your auth key</span>`
            auth.focus();
            return;
        }

        if (title.value == "") {
            titleLabel = `<span style="color: orangered;">Please provide a title</span>`
            title.focus();
            return;
        }

        if (message.value == "") {
            messageLabel = `<span style="color: orangered;">Please provide a message</span>`
            message.focus();
            return;
        }

        if (act.value == "") {
            actLabel = `<span style="color: orangered;">Please provide an action</span>`
            act.focus();
            return;
        }

        if (controller) {
            controller.abort();
        }

        controller = new AbortController();

        //{"auth": "sdfdfsd", "act": "server", "title": "Submit bugs", "message": "Help us improving by submitting bugs."}

        submitting = true;
        fetch("/api/send-push", {
            method: "POST",
            body: JSON.stringify({
                auth: auth.value,
                act: act.value,
                title: title.value,
                message: message.value
            }),
            signal: controller.signal
        }).then(async(res) => {
            const data = await res.json();
            updateLog = data.message;
            if (res.status !== 200) {
                updateStatus = "error";
            } else {
                updateStatus = "success";
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                updateLog = "";
                updateStatus = "";
            }, 2000);
        }).catch((e) => {
            updateLog = "Error sending push";
            updateStatus = "error";
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                updateLog = "";
                updateStatus = "";
            }, 2000);
            console.log(e);
        }).finally(() => {
            submitting = false;
            //clear all fields
            auth.value = "";
            act.value = "";
            title.value = "";
            message.value = "";
        });
    }

</script>

<div class="container">
    <div class="formWrapper">
        <div class="form">
            <div class="title" in:fly={{x: 10}}>
                Admin push message
            </div>
            <div class="log" class:submitting={submitting} class:error={updateStatus === "error"}>
                {updateLog}
                {#if updateStatus === "error"}
                <i class="fa-solid fa-triangle-exclamation"></i>
                {/if}
            </div>
            <div class="formfield" in:fly|global={{y: 10, delay: 300}}>
                <input on:input={() => {authLabel = 'Auth Key'}} placeholder="99" type="{showAuth ? "text" : "password"}" bind:this={auth} id="auth" name="auth" />
                <label for="auth">{@html authLabel}</label>
                <button in:fade|global={{delay: 500}} class="eye" type="button" on:click={()=> {showAuth = !showAuth}}>
                    <i class="fa-solid {showAuth ? "fa-eye-slash" : "fa-eye"}"></i>
                </button>
            </div>
            <div class="formfield" in:fly|global={{y: 10, delay: 250}}>
                <input on:input={()=> {titleLabel = 'Title'}}  placeholder="" type="text" bind:this={title} id="title" name="title" />
                <label for="title">{@html titleLabel}</label>
            </div>
            <div class="formfield" in:fly|global={{y: 10, delay: 250}}>
                <input on:input={()=> {messageLabel = 'Message'}}  placeholder="" type="text" bind:this={message} id="message" name="message" />
                <label for="message">{@html messageLabel}</label>
            </div>
            <div class="formfield" in:fly|global={{y: 10, delay: 250}}>
                <input on:input={()=> {actLabel = 'Act'}}  placeholder="" type="text" bind:this={act} id="act" name="act" />
                <label for="act">{@html actLabel}</label>
            </div>
            <button type="submit" disabled={submitting} in:fly|global={{y: 10, delay: 350}} on:click={sendPush}>Send <i class="fa-solid fa-sign-in"></i></button>
        </div>
    </div>
</div>

<style lang="scss">

    .log {
        height: 10px;
        min-height: 10px;
    }

    .container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: safe center;
        margin: auto;
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
		position: relative;
        margin: auto 0;
        padding: 20px 0;
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

    button:disabled{
        filter: brightness(0.7);
        cursor: not-allowed;
    }

</style>