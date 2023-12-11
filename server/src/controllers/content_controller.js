import multer from "multer";

import contentService from "#services/content_service.js";
import validator from "#controllers/properties_validator.js";

const upload = multer();

export default {

    getContentPage(req, res) {
        res.render("content")
    },

    getFeedbackPage(req, res) {
        res.render("feedback")
    },

    getContent(req, res, userId) {
        contentService.getUserContent(userId)
            .then(content => res.json(content))
    },

    getReviewContent(req, res, userId) {
        contentService.getContentToUserReview(userId)
            .then(content => res.json(content))
    },

    postContent(req, res, userId) {

        upload.single("file")(req, res, (err) => {
            if (err) {
                res.status(500)
                res.end()
                return
            }

            const file = req.file;

            if (!validator.tryValidateParamsOrSendError(req, res, "file")) {
                return;
            }

            contentService.createContent(userId, file)
                .then(() => res.json({success: "Работа успешна загружена!"}))
        })
    },

    postFeedback(req, res, userId) {
        const {contentId, mark, comment} = req.body

        if (!validator.tryValidateParamsOrSendError(req.body, res, "contentId", "mark", "comment")) {
            return;
        }

        contentService.createFeedback(contentId, userId, mark, comment)
            .then(() => res.json({success: "Спасибо за ваш отзыв)"}))

    }
}


