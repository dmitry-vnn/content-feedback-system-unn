import multer from "multer";

import contentService from "#services/content_service.js";
import ApiError from "#errors/api_error.js";

const upload = multer();

export default {

    async getUserContent(req, res, userId) {
        const content = await contentService.getUserContent(userId);
        res.json(content)
    },

    getUserContentPage(req, res, userId) {
        res.render("content")
    },

    getFeedbackPage(req, res, userId) {
        res.render("feedback")
    },

    async getReviewContent(req, res, reviewerId) {
        const content = await contentService.findContentsToReview(reviewerId);
        res.json(content)
    },

    postContent(req, res, userId) {

        upload.single("file")(req, res, (err) => {
            if (err) {
                res.status(500)
                res.end()
                return
            }

            const file = req.file;

            if (!file) {
                res.status(400)
                res.end("Select file to uploading!")
                return;
            }

            const name = file.originalname
            const content = file.buffer.toString()

            contentService.createContent(userId, content, name).then(
                res.end()
            )
        })
    },

    postFeedback(req, res, reviewerId) {
        const {contentId, mark, comment} = req.body

        if (!(contentId && contentId && comment)) {
            res
                .status(400)
                .json(new ApiError("Не все параметры были переданы!"))
            return
        }

        contentService.createFeedback(
            contentId, reviewerId, mark, comment
        ).then(() => res.end())

    }
}


