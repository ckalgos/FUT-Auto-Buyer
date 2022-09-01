import { sendUINotification } from "./notificationUtil"

const createAntiBypassIframes = async () => {
	return new Promise((resolve) => {
		for (let i = 0; i < 4; i++) {
			let tmp = document.createElement("iframe")
			tmp.style.display = "none"
			tmp.src = "https://www.ea.com/fifa/ultimate-team/web-app/"
			document.body.appendChild(tmp)
		}
		resolve()
	})
}

const removeIframes = () => {
	return new Promise((resolve) => {
		let arr = Array.from(document.querySelectorAll("iframe"))
		for (let i = 0; i < arr.length; i++) {
			arr[i].remove()
		}
		resolve()
	})
}

const softbanIsBypassed = () => {
	return new Promise(async (resolve) => {
		const iframeArray = Array.from(document.querySelectorAll("iframe"))
		let iframeFullyLoadedNb = 0;
		setInterval(async () => {
			for (let i = 0; i < iframeArray.length; i++) {
				if (iframeFullyLoadedNb === iframeArray.length) {
					await removeIframes()
					resolve(false)
				}
				// if iframe contain the error poppup on starting the softban was successfully bypassed
				if (iframeArray[i]?.contentDocument?.body?.querySelector("body > div.view-modal-container.form-modal > section")) {
					await removeIframes()
					resolve(true)
				}
				// if iframe correctly loaded without the poppup we dont correctly bypassed the softban we should retry
				else if (iframeArray[i]?.contentDocument?.body?.querySelector("body > main > section > section > div.ut-navigation-bar-view.navbar-style-landscape > div.view-navbar-clubinfo"))
					iframeFullyLoadedNb++;
			}
		}, 500)
	})
}

const bypassSoftban = () => {
	return new Promise(async (resolve) => {
		let isBypassed = false
		for (let i = 0; i < 10; i++) {
			sendUINotification(`Bypass softban attempt ${i + 1} / 10`)
			await createAntiBypassIframes()
			isBypassed = await softbanIsBypassed()
			await removeIframes()
			if (isBypassed)
			{
				sendUINotification(`Bypass softban attempt ${i + 1} / 10`)
				break
			}
		}
		resolve(isBypassed)
	})
}

export default bypassSoftban
