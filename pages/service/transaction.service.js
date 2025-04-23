export async function getAllTransactionsDB() {
    const response = await fetch("/api/getHistoryTransactions", { method: "GET" });
    return response.json();
}

async function totalRevenue() {
    const transactionsData = await getAllTransactionsDB();
    const data = await transactionsData.data
    const completedTransactions = await data.filter(transaction => transaction.status === "Selesai");
    
    const income = await completedTransactions.reduce((total, transaction) => {
        return total + parseInt(transaction.amount); // Menggunakan parseInt untuk mengubah string menjadi angka
    }, 0);
    
    const formattedTotal = await new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(income);

    return await formattedTotal;
}
export const totalIncome = totalRevenue();

