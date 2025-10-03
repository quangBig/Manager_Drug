import { createPool } from "mysql2/promise";

export const DatabaseProviders = {
    provide: "DATABASE_CONNECTION",
    useFactory: async () => {
        try {
            const pool = createPool({
                host: '52.175.37.189',   // Đúng IP server
                port: 5001,              // Đúng port MySQL
                user: 'root',
                password: '123qwe!@#',
                database: 'HospitalERP108',
                waitForConnections: true,
                connectionLimit: 10,     // Nên giới hạn pool
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
