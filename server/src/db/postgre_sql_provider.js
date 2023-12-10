import pg from "pg";

const sql = new pg.Client({
    connectionString: "postgres://postgres:root@127.0.0.1:5432/feedback_system"
});

await sql.connect()

export default sql