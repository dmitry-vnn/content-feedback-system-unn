import sql from "#db/postgre_sql_provider.js";

export default {

    async createUser(login, password, name) {
        const query = `
            INSERT INTO "user" (login, password, name)
            VALUES ($1, $2, $3)
            RETURNING id;
        `
        const values = [login, password, name]

        const result = await sql.query(query, values)

        return result.rows[0].id
    },

    async findUserById(id) {
        const query = `SELECT * FROM "user" WHERE id = $1;`
        const values = [id]

        const result = await sql.query(query, values);

        if (result.count === 0) {
            return null
        }

        return result.rows[0]
    },

    async findUserByLogin(login) {
        const query = `SELECT * FROM "user" WHERE login = $1;`
        const values = [login]

        const result = await sql.query(query, values);

        if (result.count === 0) {
            return null
        }

        return result.rows[0]
    },

    async isUserExists(login) {
        const query = `SELECT COUNT(*) FROM "user" WHERE login = $1;`
        const values = [login]

        const result = await sql.query(query, values);

        return result.rows[0].count > 0
    },

}