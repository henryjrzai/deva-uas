import postgres from "postgres"
const sql = postgres(process.env.POSTGRES_URL, { ssl : "require" })

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.query;
    const products = await sql`DELETE FROM products WHERE id = ${id}`;
    return res.status(200).json({ status: 200, message: "Produck berhasil dihapus", data: products })
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}