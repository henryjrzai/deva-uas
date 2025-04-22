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
        const { id, product, category, stock, price } = fields;

        // Validasi data
        if (!id || !product || !category || !stock || !price) {
          return res.status(400).json({ message: "Semua field harus diisi!" });
        }

        // Query untuk update produk ke database
        const update = await sql`
          UPDATE products
          SET name = ${product}, price = ${price}, stock = ${stock}, "categoryId" = ${category}
          WHERE id = ${id}
        `;

        console.log("update result:", update);
        return res.status(201).json({
          message: "Produk berhasil update!",
          product: { id, product, category, stock, price },
        });
      } catch (error) {
        console.error("Error saat update produk:", error);
        return res.status(500).json({
          message: "Gagal update produk",
          error: error.message,
        });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Metode ${req.method} tidak diizinkan.` });
  }
}