function setFormSubmitHandler(formId, submitFormButtonId, url) {
    const form = document.getElementById(formId);
    const submitButton = document.getElementById(submitFormButtonId);

    submitButton.addEventListener("click", () => {

        const formData = new FormData(form);
        const request = new XMLHttpRequest()

        request.open("POST", url, true)
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

        request.onreadystatechange = () => {

            if (request.readyState !== 4) {
                return
            }

            if (request.status !== 200) {
                checkErrorAndAlertIt(request.responseText)
            }

            const redirectUrl = request.responseURL

            if (redirectUrl) {
                window.location = redirectUrl
            }
        }

        request.send(new URLSearchParams(formData))

    })
}

function checkErrorAndAlertIt(bodyAsString) {
    if (!bodyAsString) {
        return false
    }

    const jsonBody = JSON.parse(bodyAsString);
    if (!jsonBody.error) {
        return false
    }

    alert(jsonBody.error)
}

function alertIfSuccess(bodyAsString) {
    if (!bodyAsString) {
        return
    }

    const jsonBody = JSON.parse(bodyAsString);
    if (!jsonBody.success) {
        return
    }

    alert(jsonBody.success)
}

export {setFormSubmitHandler, checkErrorAndAlertIt, alertIfSuccess}