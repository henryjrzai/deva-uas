import postgres from "postgres"
const sql = postgres(process.env.POSTGRES_URL, { ssl : "require" })

export default async function handler(req, res) {
  if (req.method === "GET") {
    const categories = await sql`
      SELECT *
      FROM categories 
    `;
    return res.status(200).json({ status: 200, data: categories })
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}