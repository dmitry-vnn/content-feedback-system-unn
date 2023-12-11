import {alertIfSuccess, checkErrorAndAlertIt} from "./share.js";

function displayContent(contents) {
    const contentsDiv = document.getElementById("contents");

    contents.forEach((content, index) => {
        const contentItem = document.createElement("div");
        contentItem.classList.add("content-item");
        contentItem.innerHTML = `
            <b>
                ${content.name}
            </b>
            (Автор: ${content.ownerName})
            <br><br>
            <code>
                ${content.content.replace(/\n/g, "<br>")}
            </code>
        `
        contentItem.onclick = function() {
            showFeedbacks(content);
        };

        contentsDiv.appendChild(contentItem);
    });
}

function showFeedbacks(content) {
    const feedbackList = document.getElementById("feedback-list");
    feedbackList.innerHTML = "";

    content.feedbacks.forEach((feedback, index) => {
        const reviewItem = document.createElement("div");
        reviewItem.innerHTML = `<strong>${feedback.reviewer}</strong>: ${feedback.comment} (Оценка: ${feedback.mark})`;
        feedbackList.appendChild(reviewItem);
    });

    const feedbackModal = document.getElementById("feedback-modal");
    const overlay = document.getElementById("overlay");
    feedbackModal.style.display = "block";
    overlay.style.display = "block";

    // save content id into global scope
    window.showedContentId = content.id;

    // add close button
    const closeButton = document.createElement("button");

    const submitButton = document.createElement("button");

    closeButton.textContent = "Закрыть";

    closeButton.addEventListener("click", () => {
        closeModal();

        feedbackModal.removeChild(closeButton)
        feedbackModal.removeChild(submitButton)
    })

    feedbackModal.appendChild(closeButton)

    // add submit button

    submitButton.textContent = "Отправить отзыв";

    submitButton.addEventListener("click", () => {
        submitFeedback()

        closeModal();

        feedbackModal.removeChild(closeButton)
        feedbackModal.removeChild(submitButton)
    })

    feedbackModal.appendChild(submitButton)
}

function closeModal() {
    const feedbackModal = document.getElementById("feedback-modal");
    const overlay = document.getElementById("overlay");
    feedbackModal.style.display = "none";
    overlay.style.display = "none";
}

function fetchFeedbacks() {
    fetch("/api/review")
        .then(response => response.json())
        .then(works => displayContent(works))
        .catch(error => console.error("Ошибка при получении данных:", error));
}

function clearFeedbacks() {
    const contentDiv = document.getElementById("contents");
    contentDiv.innerHTML = "";
}

function submitFeedback() {
    const mark = document.getElementById("mark").value;
    const comment = document.getElementById("comment").value;

    fetch("/api/feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contentId: window.showedContentId,
            mark: mark,
            comment: comment,
        }),
    })
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
            clearFeedbacks()
            fetchFeedbacks()
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
}

window.onload = () => {
    fetchFeedbacks()
}