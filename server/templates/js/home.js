import {alertIfSuccess, checkErrorAndAlertIt} from "./share.js";

window.onload = () => {

    const uploadButton = document.getElementById("upload-button");

    uploadButton.addEventListener("click", function() {

        const inputFile = document.getElementById("file");
        const contentFile = inputFile.files[0];

        const formData = new FormData();
        formData.append("file", contentFile);

        const options = {
            method: "POST",
            body: formData,
        };

        fetch("/content", options)
            .then(response => {
                if (!response.ok) {
                    response.text().then(text => {
                        checkErrorAndAlertIt(text)
                    })
                    return 
                }
                return response.text();
            })
            .then(bodyAsString => {
                alertIfSuccess(bodyAsString)
            })
            .catch(error => {
                console.error('Произошла ошибка:', error.message);
            });
    });
}