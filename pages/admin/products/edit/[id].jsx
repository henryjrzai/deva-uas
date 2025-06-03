import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { katalogProduct, productsData } from '@/service/data/products';
import Layout from '@/pages/components/Layout/Layout';
import { Button, Checkbox, Label, TextInput, Select, FileInput } from 'flowbite-react';
import { updateProduct, getProductByIdDB } from '@/service/product.service';
import { getCategoriesDB } from "@/service/product.service";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const categoriesData = getCategoriesDB();

  useEffect(() => {
    if (!router.query.id) return;
    const productId = router.query.id;
    const fetchProducts = async () => {
      try {
          const productDB = await getProductByIdDB(productId);
          setProduct(productDB.data[0]); 
          console.log(product)
      } catch (error) {
          console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchProducts();

    const fetchCategories = async () => {
      try {
          const productsData = await categoriesData;
          setCategories(productsData.data); 
      } catch (error) {
          console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchCategories();
  }, [router.query.id]);

  const handleEditData = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("id", router.query.id);
    data.append("product", e.target.product.value);
    data.append("category", e.target.category.value);
    data.append("stock", e.target.stock.value);
    data.append("price", e.target.price.value);
  
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/updateProduct`, {
      method: "POST",
      body: data, // Kirim data sebagai FormData
    });
  
    if (response.status !== 201) {
      alert("Gagal memperbarui produk");
      return;
    }
  
    const result = await response.json();
    if (result) {
      router.push("/admin/products");
    }
  
    setIsLoading(true);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold">Edit Data Produk</h2>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleEditData}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="category">Kategori</Label>
                </div>
                <Select
                  id="category"
                  name="category"
                  required
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.id} selected={item.name === product.category} className="text-black">
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="product">Nama Produk</Label>
                </div>
                <TextInput
                  id="product"
                  type="text"
                  required
                  name="product"
                  value={product.name} // Bind the value to product state
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="price">Harga Satuan</Label>
                </div>
                <TextInput
                  id="price"
                  type="number"
                  required
                  name="price"
                  value={product.price} // Bind the value to product state
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="stock">Jumlah Stok</Label>
                </div>
                <TextInput
                  id="stock"
                  type="number"
                  required
                  name="stock"
                  value={product.stock} // Bind the value to product state
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Edit'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
