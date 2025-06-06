import postgres from "postgres"
const sql = postgres(process.env.POSTGRES_URL, { ssl : "require" })

export default async function handler(req, res) {
  if (req.method === "GET") {
    const products = await sql`
      SELECT 
        products.id, 
        products.name, 
        products.price, 
        products.stock, 
        products.image, 
        products."categoryId", 
        categories.name as category 
      FROM products 
      INNER JOIN categories 
      ON products."categoryId" = categories.id
    `;
    return res.status(200).json({ status: 200, data: products })
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}