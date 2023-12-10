import contentRepository from "#repositories/content_repository.js";

export default {

    async getUserContent(userId) {
        const contents = await contentRepository.findAllUserContent(userId);

        if (contents.length === 0) {
            return []
        }

        const contentMap = new Map()

        for (let content of contents) {
            contentMap.set(content.id, {
                content: content.content,
                name: content.name,
                feedbacks: []
            })
        }

        const feedbacks = await contentRepository.findAllFeedbacksForAllUserContent(userId);

        for (let feedback of feedbacks) {
            const content = contentMap.get(feedback.content_id);
            content.feedbacks.push({
                reviewer: feedback.reviewer,
                mark: feedback.mark,
                comment: feedback.comment,
            })
        }

        return Array.from(contentMap.values())

    },


    async findContentsToReview(reviewerId) {
        const contents = await contentRepository
            .findContentWithLowFeedback(reviewerId, 3);

        if (contents.length === 0) {
            return []
        }

        const contentMap = new Map()

        for (let content of contents) {
            contentMap.set(content.id, {
                id: content.id,
                content: content.content,
                name: content.name,
                ownerName: content.owner_name,
                feedbacks: []
            })
        }

        const feedbacks = await contentRepository.findFeedbacksForContents(
            Array.from(contentMap.keys())
        );

        for (let feedback of feedbacks) {
            const content = contentMap.get(feedback.content_id);
            content.feedbacks.push({
                reviewer: feedback.reviewer,
                mark: feedback.mark,
                comment: feedback.comment,
            })
        }

        return Array.from(contentMap.values())

    },

    async createContent(userId, content, name) {
        return await contentRepository.createContent(userId, content, name);
    },

    async createFeedback(contentId, reviewerId, mark, comment) {
        await contentRepository.createOrUpdateFeedback(
            contentId, reviewerId, mark, comment
        )
    }

}