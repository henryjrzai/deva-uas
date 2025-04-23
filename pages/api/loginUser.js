import postgres from "postgres";
import { IncomingForm } from "formidable";

const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

// Middleware untuk menangani upload file
export const config = {
    api: {
        bodyParser: false, // Nonaktifkan bodyParser bawaan Next.js
    },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        const form = new IncomingForm();

        form.parse(req, async (err, fields) => {
            if (err) {
                console.error("Error parsing form data:", err);
                return res.status(500).json({ message: "Gagal memproses data" });
            }

            try {
                const username = fields.username?.toString();
                const password = fields.password?.toString();

                // Validasi data
                if (!username || !password) {
                    return res.status(400).json({ message: "Semua field harus diisi!" });
                }

                // Query untuk mencari user berdasarkan username
                const users = await sql`
                    SELECT *
                    FROM users
                    WHERE username = ${username}
                `;

                // Periksa apakah user ditemukan
                if (users.length === 0) {
                    return res.status(404).json({ message: "User tidak ditemukan" });
                }

                const user = users[0]; // Ambil user pertama dari hasil query

                // Periksa password
                if (user.password !== password) {
                    return res.status(401).json({ message: "Password salah" });
                }

                // Jika login berhasil
                return res.status(200).json({
                    status: 200,
                    message: "Login berhasil",
                    user: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        role: user.role,
                    },
                });
            } catch (error) {
                console.error("Error saat login:", error);
                return res.status(500).json({
                    message: "Terjadi kesalahan pada server",
                    error: error.message,
                });
            }
        });
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}