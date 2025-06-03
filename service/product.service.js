import { productsData } from "@/service/data/products.js"
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function getProductsDB() {
    const response = await fetch(`${baseUrl}/api/getProduct`, { method: "GET" });
    const data = await response.json();
    console.log(`data product : ${data}`)
    return data;
}

export async function getProductByIdDB(id) {
    const response = await fetch(`${baseUrl}/api/getProductById?id=${id}`);
    const data = await response.json();
    return data;
}

export async function getCategoriesDB() {
    const response = await fetch(`${baseUrl}/api/getCategories`, { method: "GET" });
    return await response.json();
}

export async function deleteProductDB(id) {
    const response = await fetch(`${baseUrl}/api/deleteProduct?id=${id}`, { method: "DELETE" });
    return await response.json();
}


export function addProduct(data) {
    const product = productsData.push(data)
    console.log(productsData)
    if(product) {
        return true
    }
}

export function deleteProduct(id) {
    const product = productsData.findIndex((product) => product.id === id);
    if (product !== -1) {
        productsData.splice(product, 1);
    }
    return true
}

export function getProductById(id){
    const product = productsData.find((product) => product.id === id);
    return product
}

export function updateProduct(id, data) {
    const productIndex = productsData.findIndex((product) => product.id === id);
    if (productIndex !== -1) {
        productsData[productIndex] = { ...productsData[productIndex], ...data };
        return true;
    }
    return false;
}

export const countProduct = productsData.length;