import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productsData } from '@/pages/service/data/products';
import { getProductsDB } from "@/pages/service/product.service";

export default function Beranda() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  
  // Data untuk slider dengan gambar dari assets lokal
  const sliderData = [
    {
      id: 1,
      title: "Selamat Datang di Toko Kelontong Pak Rangga",
      description: "Menyediakan kebutuhan sehari-hari dengan harga terjangkau",
      imageSrc: "/images/nikola.jpeg",
      altText: "Tampilan depan toko"
    },
    {
      id: 2,
      title: "Promo Mingguan",
      description: "Dapatkan diskon hingga 20% untuk produk pilihan setiap minggunya",
      imageSrc: "/images/nikola.jpeg",
      altText: "Produk promo mingguan"
    },
    {
      id: 3,
      title: "Antar Gratis",
      description: "Belanja minimal Rp 100.000 dapatkan layanan antar gratis dalam radius 3 km",
      imageSrc: "/images/nikola.jpeg",
      altText: "Layanan antar"
    }
  ];

  // Data kategori produk
  const categories = [
    { id: 1, name: "Sembako", icon: "🍚", url: "/katalog/sembako" },
    { id: 2, name: "Makanan Ringan", icon: "🍿", url: "/katalog/makanan-ringan" },
    { id: 3, name: "Minuman", icon: "🥤", url: "/katalog/minuman" },
    { id: 4, name: "Peralatan Mandi", icon: "🧼", url: "/katalog/peralatan-mandi" },
    { id: 5, name: "Bumbu Dapur", icon: "🧂", url: "/katalog/bumbu-dapur" },
    { id: 6, name: "Alat Tulis", icon: "✏️", url: "/katalog/alat-tulis" }
  ];

  // Data produk unggulan dengan gambar dari assets lokal
  const featuredProducts = products.slice(0, 4);

  // Auto slider
  useEffect(() => {
    const fetchProducts = async () => {
      try {
          const productsDB = await getProductsDB();
          setProducts(productsDB.data); 
      } catch (error) {
          console.error("Gagal mengambil data produk:", error);
      }
    };

    fetchProducts();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [sliderData.length]);

  // Slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  return (
    <div className="space-y-12">
      {/* Hero Slider */}
      <section className="relative overflow-hidden h-96 md:h-128">
        <div className="relative h-full">
          {sliderData.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={slide.imageSrc}
                  alt={slide.altText}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-lg text-white">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                      <p className="text-lg md:text-xl mb-8">{slide.description}</p>
                      <Link href="/katalog" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition duration-300">
                        Belanja Sekarang
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Slider controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
          {/* Slider indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {sliderData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Kategori Produk */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Kategori Produk</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={category.url}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center hover:shadow-lg transition duration-300 text-center"
              >
                <span className="text-4xl mb-2">{category.icon}</span>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produk Unggulan */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Produk Unggulan</h2>
            <Link href="/katalog" className="text-green-600 hover:text-green-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="relative h-48">
                  <Image
                    src={`${product.image}`}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      PROMO
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                  <div className="flex items-center">
                    <span className="font-semibold text-lg text-gray-900">Rp {formatPrice(product.price)}</span>
                    {product.discount && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        Rp {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/beli/${product.id}`} className="inline-block mt-2 text-center w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                    Beli
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pesan Antar Cepat & Mudah</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Pesan kebutuhan Anda melalui WhatsApp dan dapatkan layanan antar ke rumah Anda. Gratis ongkir untuk pembelian minimal Rp 100.000 dalam radius 3 km.
          </p>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center bg-white text-green-700 font-medium py-3 px-6 rounded-md hover:bg-gray-100 transition duration-300"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pesan via WhatsApp
          </a>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Apa Kata Pelanggan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src="/assets/customer1.jpg"
                    alt="Budi Santoso"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Budi Santoso</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Sangat senang berbelanja di Toko Pak Rangga. Produknya lengkap dan pelayanannya ramah. Pengantaran cepat dan tepat waktu!"
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src="/assets/customer2.jpg"
                    alt="Siti Rahayu"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Siti Rahayu</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Harga produk di Toko Pak Rangga sangat terjangkau. Saya sering berbelanja kebutuhan sehari-hari di sini, selalu puas!"
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                  AW
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Ahmad Wahyudi</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span className="text-gray-300">★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Layanan pesan antar sangat memudahkan, apalagi saat sedang sibuk. Produk yang diantarkan selalu sesuai dengan pesanan."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}