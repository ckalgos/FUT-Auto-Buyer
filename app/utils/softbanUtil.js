
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
		while (document.querySelector(`iframe`)) {
			document.querySelector(`iframe`).remove()
		}
		resolve()
	})
}

const softbanIsBypassed = () => {
	return new Promise(async (resolve) => {
		const iframeArray = Array.from(document.querySelectorAll("iframe"))
		let iframeFullyLoadedNb = 0;
		let interval = setInterval(async () => {
			for (let i = 0; i < iframeArray.length; i++) {
				if (iframeFullyLoadedNb === iframeArray.length) {
					clearInterval(interval)
					resolve(false)
				}
				// if iframe contain the error poppup on starting the softban was successfully bypassed
				if (iframeArray[i].contentDocument.body.querySelector("body > div.view-modal-container.form-modal > section")) {
					resolve(true)
				}
				// if iframe correctly loaded without the poppup we dont correctly bypassed the softban we should retry
				else if (iframeArray[i].contentDocument.body.querySelector("body > main > section > section > div.ut-navigation-bar-view.navbar-style-landscape > div.view-navbar-clubinfo"))
					iframeFullyLoadedNb++;
			}
		}, 500)
	})
}

const bypassSoftban = () => {
	return new Promise(async (resolve) => {
		for (let i = 0; i < 10; i++) {
			await createAntiBypassIframes()
			let isBypassed = await softbanIsBypassed()
			await removeIframes()
			if (isBypassed)
				resolve(true)
		}
		resolve(false)
	})
}

export default bypassSoftban
