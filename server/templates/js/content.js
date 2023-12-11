function displayContent(contents) {
    const contentDiv = document.getElementById("contents");

    contents.forEach((content, index) => {
        const contentItem = document.createElement("li");
        contentItem.classList.add("content-item");
        contentItem.innerHTML = `
            <b>
                ${content.name}
            </b>:
            <br><br>
            <code>
                ${content.content.replace(/\n/g, "<br>")}
            </code>
            <br><br>
        `
        const showReviewsButton = document.createElement("button");
        showReviewsButton.textContent = "Показать отзывы";
        showReviewsButton.addEventListener("click", function() {
            showFeedbacks(content.feedbacks);
        });

        contentItem.appendChild(showReviewsButton);
        contentDiv.appendChild(contentItem);
    });
}

function showFeedbacks(feedbacks) {
    const reviewsList = document.getElementById("feedback-list");
    reviewsList.innerHTML = "";

    feedbacks.forEach((review, index) => {
        const reviewItem = document.createElement("li");
        reviewItem.innerHTML = `<strong>${review.reviewer}</strong>: ${review.comment} (Оценка: ${review.mark})`;
        reviewsList.appendChild(reviewItem);
    });

    const feedbackModal = document.getElementById("feedback-modal");
    const overlay = document.getElementById("overlay");
    feedbackModal.style.display = "block";
    overlay.style.display = "block";

    // add close button
    const closeButton = document.createElement("button");

    closeButton.textContent = "Закрыть";

    closeButton.addEventListener("click", () => {
        feedbackModal.style.display = "none";
        overlay.style.display = "none";

        feedbackModal.removeChild(closeButton)
    })

    feedbackModal.appendChild(closeButton)
}

window.onload = () => {
    const contentDiv = document.getElementById("contents");
    contentDiv.innerHTML = "";

    const request = new XMLHttpRequest();
    request.open("GET", "/api/content", true);

    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200) {
                const content = JSON.parse(request.responseText);
                displayContent(content);
            } else {
                console.error("Ошибка при получении данных:", request.statusText);
            }
        }
    };

    request.send();
}