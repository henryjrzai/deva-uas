import Layout from "@/pages/components/Layout/Layout";
import { Button, Checkbox, Label, TextInput, Select, FileInput } from "flowbite-react";
import { katalogProduct } from "@/pages/service/data/products";
import { useEffect, useState } from "react";
import { addProduct } from "@/pages/service/product.service";
import LoadingComponent from "@/pages/components/Layout/Loading";
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { getCategoriesDB } from "@/pages/service/product.service";

export default function CreateProduct() {
  const router = useRouter();
  const katalog = katalogProduct;
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const categoriesData = getCategoriesDB();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
          const productsData = await categoriesData;
          setCategories(productsData.data); 
      } catch (error) {
          console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchCategories();
  }, categoriesData)


  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadError("");
  
    try {
      const formData = new FormData();
      formData.append("id", uuidv4() );
      formData.append("product", e.target.product.value);
      formData.append("category", e.target.category.value);
      formData.append("stock", e.target.stock.value);
      formData.append("price", e.target.price.value);
      formData.append("image", e.target.image.files[0]);
  
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/addProduct`, {
        method: "POST",
        body: formData,
      });
  
      if (response.status !== 201) {
        throw new Error("Gagal menyimpan produk");
      }
  
      const result = await response.json();
      if (result) {
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Error:", error);
      setUploadError(error.message);
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Layout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold">Tambah Data Produk</h2>
              <form className="flex flex-col gap-4 mt-4" onSubmit={handleAddProduct}>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="category">Kategori</Label>
                  </div>
                  <Select id="category" name="category" required>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id} className="text-black">
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="product">Nama Produk</Label>
                  </div>
                  <TextInput id="product" type="text" required name="product" />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="price">Harga Satuan</Label>
                  </div>
                  <TextInput id="price" type="number" required name="price" />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="stock">Jumlah Stok</Label>
                  </div>
                  <TextInput id="stock" type="number" required name="stock" />
                </div>
                <div>
                  <Label className="mb-2 block" htmlFor="image">
                    Upload file
                  </Label>
                  <FileInput id="image" />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Simpan'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}