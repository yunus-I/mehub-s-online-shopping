import React, { useState } from 'react';
import { ShoppingBag, Globe, Search, ChevronRight, ArrowLeft, ShoppingCart, Star } from 'lucide-react';

// --- 1. LANGUAGE TRANSLATIONS ---
const translations = {
  en: {
    appTitle: "Mehub",
    welcome: "Welcome to Mehub",
    subtitle: "Find your perfect style today.",
    selectCategory: "Shop by Category",
    tights: "Tights",
    trousers: "Trousers",
    tshirts: "T-Shirts",
    shoes: "Shoes",
    back: "Back",
    productsIn: "Products in",
    orderNow: "Order Now",
    price: "Price",
    discount: "OFF",
    description: "Product Description"
  },
  am: {
    appTitle: "ሚሀብ",
    welcome: "ወደ ሚሀብ በደህና መጡ",
    subtitle: "ፍጹም የሆነውን ስታይልዎን ዛሬውኑ ያግኙ።",
    selectCategory: "በምድብ ይምረጡ",
    tights: "ታይት",
    trousers: "ሱሪ",
    tshirts: "ቲሸርት",
    shoes: "ጫማ",
    back: "ተመለስ",
    productsIn: "ምርቶች በ",
    orderNow: "አሁን እዘዝ",
    price: "ዋጋ",
    discount: "ቅናሽ",
    description: "የምርት መግለጫ"
  },
  om: {
    appTitle: "Mehub",
    welcome: "Baga gara Mehub dhuftan",
    subtitle: "Style keessan guutuu har'a argadhaa.",
    selectCategory: "Ramaddii Filadhu",
    tights: "Taayitii",
    trousers: "Surree",
    tshirts: "T-shaartii",
    shoes: "Kophaa",
    back: "Deebi'i",
    productsIn: "Oomishoota",
    orderNow: "Amma Ajaji",
    price: "Gatii",
    discount: "Hir'ina",
    description: "Ibsa Oomishaa"
  }
};

// --- 2. CATEGORY DATA ---
const categories = [
  { id: 'tights', key: 'tights', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80' },
  { id: 'trousers', key: 'trousers', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80' },
  { id: 'tshirts', key: 'tshirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
  { id: 'shoes', key: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
];

// --- 3. MOCK PRODUCT DATABASE (4 photos each, prices, and languages) ---
const products = [
  {
    id: 'shoe1',
    categoryId: 'shoes',
    price: 2500,
    originalPrice: 3500,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80'
    ],
    name: { en: 'Premium Red Sneakers', am: 'ፕሪሚየም ቀይ ስኒከር', om: 'Kophaa Diimaa Premium' },
    desc: { en: 'High-quality, comfortable running shoes. Perfect for daily wear and sports.', am: 'ከፍተኛ ጥራት ያለው፣ ምቹ የሩጫ ጫማ። ለዕለታዊ አጠቃቀም እና ለስፖርት ተስማሚ።', om: 'Kophaa fiigichaa qulqullina olaanaa qabu. Guyyaa guyyaan uffachuuf mijataa dha.' }
  },
  {
    id: 'shirt1',
    categoryId: 'tshirts',
    price: 800,
    originalPrice: 1000,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80'
    ],
    name: { en: 'Classic White T-Shirt', am: 'ክላሲክ ነጭ ቲሸርት', om: 'T-shirt Adii Classic' },
    desc: { en: '100% Cotton, highly breathable t-shirt.', am: '100% ጥጥ የተሰራ፣ አየር የሚያስገባ ቲሸርት።', om: '100% jirbii irraa hojjatame, qilleensa sirriitti kan dabarsu.' }
  }
];

export default function App() {
  // --- STATE MANAGEMENT ---
  const [lang, setLang] = useState('en'); 
  const [view, setView] = useState('home'); // Controls which page is showing ('home', 'category', 'product')
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const t = translations[lang];

  // --- NAVIGATION FUNCTIONS ---
  const goToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setView('category');
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  const goToProduct = (product) => {
    setActiveProduct(product);
    setActiveImageIndex(0); // Always start with the first photo
    setView('product');
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (view === 'product') setView('category');
    else if (view === 'category') setView('home');
  };

  // --- PAGE 1: HOME (CATEGORIES) ---
  const renderHome = () => (
    <>
      <div className="px-5 py-6">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-red-200">
          <h2 className="text-2xl font-bold mb-1">{t.welcome}</h2>
          <p className="text-red-100 text-sm mb-4">{t.subtitle}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-full flex items-center px-4 py-2 mt-2">
            <Search className="w-4 h-4 text-white/80 mr-2" />
            <span className="text-white/80 text-sm">Search styles...</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-2">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{t.selectCategory}</h3>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => goToCategory(cat.id)}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-sm active:scale-95 transition-transform"
            >
              <img src={cat.image} alt={t[cat.key]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <span className="text-white font-semibold text-lg drop-shadow-md">{t[cat.key]}</span>
                <div className="bg-white/30 backdrop-blur-sm p-1 rounded-full">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // --- PAGE 2: PRODUCT LIST ---
  const renderCategory = () => {
    // Filter products to only show ones in the selected category
    const categoryProducts = products.filter(p => p.categoryId === activeCategory);
    const categoryName = t[categories.find(c => c.id === activeCategory).key];

    return (
      <div className="px-5 py-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{t.productsIn} {categoryName}</h3>
        
        {categoryProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">More products coming soon!</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categoryProducts.map((p) => {
              const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
              return (
                <button 
                  key={p.id}
                  onClick={() => goToProduct(p)}
                  className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex flex-col text-left active:scale-95 transition-transform"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden relative mb-3">
                    <img src={p.images[0]} alt={p.name[lang]} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{p.name[lang]}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-red-500 text-sm">{p.price} ETB</span>
                    <span className="text-xs text-gray-400 line-through">{p.originalPrice}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    );
  };

  // --- PAGE 3: PRODUCT DETAILS (4 photos & Order Button) ---
  const renderProductDetail = () => {
    const p = activeProduct;
    const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

    return (
      <div className="flex flex-col pb-28"> {/* Extra padding for the sticky bottom button */}
        {/* BIG MAIN IMAGE */}
        <div className="w-full aspect-[4/5] bg-gray-100 relative">
          <img src={p.images[activeImageIndex]} className="w-full h-full object-cover" />
        </div>

        {/* 4 THUMBNAIL IMAGES */}
        <div className="grid grid-cols-4 gap-3 p-5">
          {p.images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImageIndex(idx)} 
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${idx === activeImageIndex ? 'border-red-500 scale-105' : 'border-transparent opacity-70'}`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* PRODUCT DETAILS */}
        <div className="px-5">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight flex-1">{p.name[lang]}</h2>
          </div>

          <div className="flex items-end gap-3 mt-3 mb-6">
            <span className="text-3xl font-black text-red-500">{p.price} <span className="text-lg">ETB</span></span>
            <span className="text-gray-400 line-through text-lg mb-1">{p.originalPrice} ETB</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-bold mb-1">
              -{discount}% {t.discount}
            </span>
          </div>

          <h4 className="font-bold text-gray-800 mb-2">{t.description}</h4>
          <p className="text-gray-600 leading-relaxed text-sm">
            {p.desc[lang]}
          </p>
        </div>

        {/* STICKY "ORDER NOW" BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-20 flex justify-center pb-8">
          <div className="w-full max-w-md">
            <button 
              onClick={() => alert('Geolocation & Order Form coming on Day 9!')} 
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-red-200 active:scale-95 transition-transform text-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {t.orderNow} - {p.price} ETB
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-800">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative overflow-x-hidden flex flex-col">
        
        {/* DYNAMIC HEADER */}
        <header className="flex items-center justify-between px-5 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {view !== 'home' ? (
              <button onClick={goBack} className="p-2 bg-gray-100 rounded-full active:scale-90 transition-transform">
                <ArrowLeft className="w-5 h-5 text-gray-800" />
              </button>
            ) : (
              <div className="bg-red-500 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
            )}
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              {view === 'home' ? t.appTitle : t.back}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
            <Globe className="w-4 h-4 text-gray-500" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer text-gray-700"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="om">Oromoo</option>
            </select>
          </div>
        </header>

        {/* MAIN VIEWS */}
        <main className="flex-1 overflow-y-auto">
          {view === 'home' && renderHome()}
          {view === 'category' && renderCategory()}
          {view === 'product' && renderProductDetail()}
        </main>

      </div>
    </div>
  );
}