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
        // Pastikan nilai fields diubah menjadi string
        const id = fields.id?.toString();
        const email = fields.email?.toString();
        const username = fields.username?.toString();
        const password = fields.password?.toString();
        const name = fields.name?.toString();
        const role = fields.role?.toString();

        console.log("fields:", { id, email, username, password, name, role });

        // Validasi data
        if (!id || !email || !username || !password || !name || !role) {
          return res.status(400).json({ message: "Semua field harus diisi!" });
        }

        // Query untuk menyimpan user ke database
        const insert = await sql`
          INSERT INTO users (id, email, username, password, name, role)
          VALUES (${id}, ${email}, ${username}, ${password}, ${name}, ${role})
        `;

        console.log("insert result:", insert);
        return res.status(201).json({
          status: 201,
          message: "User berhasil disimpan!",
          user: { id, email, username, name, role },
        });
      } catch (error) {
        console.error("Error saat menyimpan user:", error);
        return res.status(500).json({
          message: "Gagal menyimpan user",
          error: error.message,
        });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Metode ${req.method} tidak diizinkan.` });
  }
}