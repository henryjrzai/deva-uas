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

        const { id, trxid, date, item, qty, customer, amount, status } = fields;

        if (!id || !trxid || !date || !item || !qty || !customer || !amount || !status) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
        }

        const insert = await sql`
        INSERT INTO transactions (id, trxid, date, item, qty, customer, amount, status)
        VALUES (${id}, ${trxid}, ${date}, ${item}, ${qty}, ${customer}, ${amount}, ${status})
        `;


        console.log("insert result:", insert);
        return res.status(201).json({
          message: "Transaksi berhasil disimpan!",
          transaction: { id, date, item, qty, customer, amount, status },
        });
      } catch (error) {
        console.error("Error saat menyimpan transaksi:", error);
        return res.status(500).json({
          message: "Gagal menyimpan transaksi",
          error: error.message,
        });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Metode ${req.method} tidak diizinkan.` });
  }
}