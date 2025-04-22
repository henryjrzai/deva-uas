import multer from "multer";
import path from "path";
import postgres from "postgres";
const sql = postgres(process.env.POSTGRES_URL, { ssl: "require" });

// Konfigurasi multer untuk menyimpan file di folder public/images
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "public/images"), // Lokasi penyimpanan file
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nama file unik
  },
});

const upload = multer({ storage });

// Middleware untuk menangani upload file
export const config = {
  api: {
    bodyParser: false, // Nonaktifkan bodyParser bawaan Next.js
  },
};

// Fungsi untuk menangani upload file dengan Promise
const uploadFile = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Tunggu proses upload selesai
      await uploadFile(req, res);

      const { id, product, category, stock, price } = req.body;
      const imageUrl = `images/${req.file.filename}`; // URL gambar

      // Validasi data
      if (!id || !product || !category || !stock || !price) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
      }

      // Query untuk menambahkan produk ke database
      const insert = await sql`
        INSERT INTO products (id, name, price, stock, image, "categoryId")
        VALUES (${id}, ${product}, ${price}, ${stock}, ${imageUrl}, ${category})
      `;

      console.log("Insert result:", insert);
      return res.status(201).json({
        message: "Produk berhasil ditambahkan!",
        product: { id, product, category, stock, price, imageUrl },
      });
    } catch (error) {
      console.error("Error saat menambahkan produk:", error);
      return res.status(500).json({
        message: "Gagal menambahkan produk",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Metode ${req.method} tidak diizinkan.` });
  }
}