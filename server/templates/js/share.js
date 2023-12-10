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

            if (request.status === 500) {
                const error = JSON.parse(request.responseText);
                if (error && error.error) {
                    alert(error.error)
                }
                return;
            }

            const redirectUrl = request.responseURL

            if (redirectUrl) {
                window.location = redirectUrl
            }
        }

        request.send(new URLSearchParams(formData))

    })
}

export {setFormSubmitHandler}