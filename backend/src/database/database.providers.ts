import { createPool } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export const DatabaseProviders = {
    provide: "DATABASE_CONNECTION",
    useFactory: async () => {
        try {
            const pool = createPool({
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0,
            });

            const connection = await pool.getConnection();
            console.log("✅ Kết nối MySQL thành công");
            connection.release();

            return pool;
        } catch (err) {
            console.error("❌ Không kết nối được MySQL:", err);
            throw err;
        }
    },
};
