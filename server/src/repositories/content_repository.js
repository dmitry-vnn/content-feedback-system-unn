import sql from "#db/postgre_sql_provider.js";

export default {
    async createContent(ownerId, content, name) {
        const query = `
            INSERT INTO content (owner_id, content, name)
            VALUES ($1, $2, $3)
            RETURNING id;
        `
        const result = await sql.query(query, [ownerId, content, name])

        return result.rows[0].id
    },

    async findAllUserContent(ownerId) {
        const query = "SELECT * FROM content WHERE owner_id = $1;"

        const result = await sql.query(query, [ownerId])

        return result.rows
    },

    async findContentWithLowFeedback(reviewerId, count) {
        const query = `
            WITH content_and_feedback AS
                     (SELECT content.*,
                             feedback.content_id

                      FROM content
                               LEFT JOIN feedback
                                         ON feedback.content_id = content.id

                      WHERE content.owner_id != $1),

                 top_3_low_feedback_contents AS
                     (SELECT content_and_feedback.id                AS content_id,
                             content_and_feedback.owner_id,
                             content_and_feedback.name              AS content_name,
                             content_and_feedback.content,
                             COUNT(content_and_feedback.content_id) AS feedbacks
                      FROM content_and_feedback
                      GROUP BY id, owner_id, content_name, content
                      ORDER BY feedbacks
                      LIMIT $2)

            SELECT top_3_low_feedback_contents.content_id AS id,
                   top_3_low_feedback_contents.content_name AS name,
                   top_3_low_feedback_contents.content,
                   "user".name AS owner_name

            FROM top_3_low_feedback_contents
                     JOIN "user"
                          ON top_3_low_feedback_contents.owner_id = "user".id;
        `

        const result = await sql.query(query, [reviewerId, count])

        return result.rows
    },

    async findFeedbacksForContents(contentsIds) {
        const query = `
            SELECT
                feedback.content_id,
                feedback.comment,
                feedback.mark,
                "user".name         AS reviewer
            FROM feedback
                     JOIN "user" on feedback.reviewer_id = "user".id
            WHERE feedback.content_id = ANY($1::int[]);
        `

        const result = await sql.query(query, [contentsIds])

        return result.rows
    },


    async findAllFeedbacksForAllUserContent(userId) {
        const query = `
            WITH content_and_feedback AS
                     (SELECT feedback.reviewer_id,
                             feedback.comment,
                             feedback.mark,
                             feedback.content_id

                      FROM feedback
                               RIGHT JOIN content
                                          ON feedback.content_id = content.id

                      WHERE content.owner_id = $1)
            SELECT content_and_feedback.comment,
                   content_and_feedback.mark,
                   "user".name AS reviewer,
                   content_and_feedback.content_id

            FROM content_and_feedback
                     JOIN "user"
                          ON content_and_feedback.reviewer_id = "user".id;
        `

        const result = await sql.query(query, [userId])

        return result.rows
    },

    async createOrUpdateFeedback(contentId, reviewerId, mark, comment) {
        const query = `
            INSERT INTO feedback (content_id, reviewer_id, mark, comment)
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT (content_id, reviewer_id) DO UPDATE SET 
                    mark = $3,
                    comment = $4;
        `

        const params = [contentId, reviewerId, mark, comment]

        await sql.query(query, params)
    }

}