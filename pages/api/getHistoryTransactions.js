import postgres from "postgres"
const sql = postgres(process.env.POSTGRES_URL, { ssl : "require" })

export default async function handler(req, res) {
  if (req.method === "GET") {
    const transactions = await sql`
        SELECT 
          transactions.id, 
          transactions.trxid, 
          transactions.date, 
          transactions.customer, 
          transactions.item, 
          transactions.amount,
          transactions.qty,
        transactions.status,
          users.name as customername,
          products.name as productname
        FROM transactions 
        INNER JOIN products 
        ON transactions.item = products.id 
        INNER JOIN users
        ON transactions.customer = users.id
        ORDER BY transactions.date DESC
      `;
      console.log(`transactions: `, transactions);
    return res.status(200).json({ status: 200, data: transactions })
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}