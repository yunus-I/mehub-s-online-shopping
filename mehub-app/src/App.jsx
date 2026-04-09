import React, { useState, useEffect } from 'react';
import { ShoppingBag, Globe, Search, ChevronRight, ArrowLeft, ShoppingCart, Star, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// --- 1. LANGUAGE TRANSLATIONS ---
const translations = {
  en: {
    appTitle: "አዲስ ቦንዳ",
    welcome: "Welcome to አዲስ ቦንዳ",
    subtitle: "Find your perfect style today.",
    selectGender: "Select Gender",
    mens: "Men's",
    womens: "Women's",
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
    appTitle: "አዲስ ቦንዳ",
    welcome: "ወደ አዲስ ቦንዳ በደህና መጡ",
    subtitle: "ፍጹም የሆነውን ስታይልዎን ዛሬውኑ ያግኙ።",
    selectGender: "ጾታ ይምረጡ",
    mens: "የወንዶች",
    womens: "የሴቶች",
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
    appTitle: "አዲስ ቦንዳ",
    welcome: "Baga gara አዲስ ቦንዳ dhuftan",
    subtitle: "Style keessan guutuu har'a argadhaa.",
    selectGender: "Saala Filadhu",
    mens: "Dhiiraaf",
    womens: "Dubartiif",
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
const genders = [
  { id: 'f', key: 'womens', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
  { id: 'm', key: 'mens', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80' }
];

const categories = [
  { id: 'tights', key: 'tights', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80' },
  { id: 'trousers', key: 'trousers', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80' },
  { id: 'tshirts', key: 'tshirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
  { id: 'shoes', key: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
];

// --- 3. PRODUCT DATABASE ---
export default function App() {
  // --- STATE MANAGEMENT ---
  const [lang, setLang] = useState('en'); 
  const [view, setView] = useState('home'); // Controls which page is showing ('home', 'categories', 'products', 'product')
  const [activeGender, setActiveGender] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: data.id || doc.id,
            categoryId: typeof data.categoryId === 'string' ? data.categoryId.toLowerCase().trim() : '',
            price: data.price,
            originalPrice: data.originalPrice,
            sex: typeof data.sex === 'string' ? data.sex.toLowerCase().trim() : '',
            images: Array.isArray(data.images) ? data.images : [data.image1, data.image2, data.image3, data.image4].filter(Boolean),
            name: { 
              en: data.name?.en || data.name_en || '', 
              am: data.name?.am || data.name_am || '', 
              om: data.name?.om || data.name_om || '' 
            },
            desc: { 
              en: data.desc?.en || data.desc_en || '', 
              am: data.desc?.am || data.desc_am || '', 
              om: data.desc?.om || data.desc_om || '' 
            }
          };
        });
        setProducts(productsList);
        console.log("Fetched products:", productsList);
      } catch (error) {
        console.error("Error fetching products from Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const t = translations[lang];

  // --- NAVIGATION FUNCTIONS ---
  const goToGender = (genderId) => {
    setActiveGender(genderId);
    setView('categories');
    window.scrollTo(0, 0);
  };

  const goToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setView('products');
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  const goToProduct = (product) => {
    setActiveProduct(product);
    setActiveImageIndex(0); // Always start with the first photo
    setView('product');
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (view === 'product') setView('products');
    else if (view === 'products') setView('categories');
    else if (view === 'categories') setView('home');
  };

  // --- PAGE 1: HOME (GENDER SELECTION) ---
  const renderHome = () => (
    <>
      <div className="px-5 py-6 md:px-8 md:py-10">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl p-6 md:p-10 text-white shadow-lg shadow-red-200">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">{t.welcome}</h2>
          <p className="text-red-100 text-sm md:text-lg mb-6">{t.subtitle}</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-full flex items-center px-4 py-3 mt-2 md:max-w-md">
            <Search className="w-5 h-5 text-white/80 mr-3" />
            <span className="text-white/80 text-sm md:text-base">Search styles...</span>
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 mt-2 md:mt-6">
        <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{t.selectGender}</h3>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {genders.map((g) => (
            <button 
              key={g.id}
              onClick={() => goToGender(g.id)}
              className="group relative rounded-2xl md:rounded-3xl overflow-hidden h-40 md:h-64 flex-1 shadow-sm active:scale-95 transition-transform"
            >
              <img src={g.image} alt={t[g.key]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-3xl md:text-5xl drop-shadow-md tracking-wide">{t[g.key]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // --- PAGE 2: CATEGORIES ---
  const renderCategories = () => {
    const genderName = activeGender ? t[genders.find(g => g.id === activeGender)?.key || 'mens'] : '';
    // Hide tights for men's category
    const visibleCategories = categories.filter(cat => !(activeGender === 'm' && cat.id === 'tights'));

    return (
      <div className="px-5 py-6 md:px-8 md:py-10">
        <h3 className="text-xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-10">{t.selectCategory} <span className="text-red-500 font-medium">({genderName})</span></h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 md:gap-8">
          {visibleCategories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => goToCategory(cat.id)}
              className="group relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/5] shadow-sm active:scale-95 transition-transform"
            >
              <img src={cat.image} alt={t[cat.key]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 flex items-center justify-between">
                <span className="text-white font-semibold text-lg md:text-3xl drop-shadow-md">{t[cat.key]}</span>
                <div className="bg-white/30 backdrop-blur-sm p-1.5 md:p-3 rounded-full">
                  <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // --- PAGE 3: PRODUCT LIST ---
  const renderProducts = () => {
    // Filter products to only show ones in the selected category AND gender
    // Fallback: If 'sex' is missing in their database, show the product so it's not entirely hidden.
    const categoryProducts = products.filter(p => p.categoryId === activeCategory && (!p.sex || p.sex === activeGender));
    const categoryName = t[categories.find(c => c.id === activeCategory).key];

    return (
      <div className="px-5 py-6 md:px-8 md:py-10">
        <h3 className="text-xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-10">{t.productsIn} {categoryName}</h3>
        
        {categoryProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 md:text-xl">More products coming soon!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categoryProducts.map((p) => {
              const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
              return (
                <button 
                  key={p.id}
                  onClick={() => goToProduct(p)}
                  className="bg-white rounded-2xl md:rounded-3xl p-2 md:p-4 shadow-sm border border-gray-100 flex flex-col text-left active:scale-95 transition-all hover:shadow-md hover:border-gray-200"
                >
                  <div className="w-full aspect-square rounded-xl md:rounded-2xl overflow-hidden relative mb-3">
                    <img src={p.images[0]} alt={p.name[lang]} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full z-10">
                      -{discount}%
                    </span>
                  </div>
                  <div className="px-1 md:px-2 pb-1 md:pb-2">
                    <h4 className="font-semibold text-gray-800 text-sm md:text-lg line-clamp-1">{p.name[lang]}</h4>
                    <div className="flex items-center gap-2 mt-1 md:mt-2">
                      <span className="font-bold text-red-500 text-sm md:text-xl">{p.price} ETB</span>
                      <span className="text-xs md:text-sm text-gray-400 line-through">{p.originalPrice}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    );
  };

  // --- PAGE 4: PRODUCT DETAILS (4 photos & Order Button) ---
  const renderProductDetail = () => {
    const p = activeProduct;
    const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

    const handleOrder = () => {
      const messages = {
        en: `Hello, I want to order:\nProduct: ${p.name.en}\nPrice: ${p.price} ETB\n\nWhen I want it: [Please fill in]\nWhere I want it: [Please fill in]`,
        am: `ጤና ይስጥልኝ፣ ይህንን ማዘዝ እፈልጋለሁ፡\nምርት፡ ${p.name.am}\nዋጋ፡ ${p.price} ETB\n\nመቼ እንደምፈልገው፡ [እባክዎ ይሙሉ]\nየት እንደምፈልገው፡ [እባክዎ ይሙሉ]`,
        om: `Akkam, kana ajajuun barbaada:\nOomisha: ${p.name.om}\nGatii: ${p.price} ETB\n\nYoom akkan barbaadu: [Maaloo guutaa]\nEessatti akkan barbaadu: [Maaloo guutaa]`,
      };
      const text = messages[lang] || messages.en;
      const encodedText = encodeURIComponent(text);
      window.open(`https://t.me/mhuby0?text=${encodedText}`, '_blank');
    };

    return (
      <div className="flex flex-col md:flex-row pb-28 md:pb-10 md:p-8 md:gap-10 xl:gap-16 max-w-7xl mx-auto">
        {/* IMAGE SECTION */}
        <div className="md:w-1/2 flex flex-col">
          {/* BIG MAIN IMAGE */}
          <div className="w-full aspect-[4/5] bg-gray-100 relative md:rounded-3xl overflow-hidden shadow-sm">
            <img src={p.images[activeImageIndex]} className="w-full h-full object-cover" />
          </div>

          {/* 4 THUMBNAIL IMAGES */}
          <div className="grid grid-cols-4 gap-3 p-5 md:p-0 md:mt-6">
            {p.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)} 
                className={`aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all hover:opacity-100 cursor-pointer ${idx === activeImageIndex ? 'border-red-500 scale-105 shadow-md' : 'border-transparent opacity-70'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT DETAILS SECTION */}
        <div className="px-5 md:px-0 md:w-1/2 md:flex md:flex-col justify-start md:py-4">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 leading-tight flex-1">{p.name[lang]}</h2>
          </div>

          <div className="flex items-end gap-3 md:gap-5 mt-3 md:mt-6 mb-6 md:mb-10">
            <span className="text-3xl md:text-6xl font-black text-red-500">{p.price} <span className="text-lg md:text-2xl">ETB</span></span>
            <span className="text-gray-400 line-through text-lg md:text-2xl mb-1 md:mb-2">{p.originalPrice} ETB</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-lg font-bold mb-1 md:mb-3">
              -{discount}% {t.discount}
            </span>
          </div>

          <h4 className="font-bold text-gray-800 mb-2 md:mb-4 md:text-2xl">{t.description}</h4>
          <p className="text-gray-600 leading-relaxed text-sm md:text-lg mb-8 md:mb-12">
            {p.desc[lang]}
          </p>

          {/* "ORDER NOW" BUTTON */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-20 flex justify-center pb-8 md:static md:p-0 md:border-none md:pb-0 md:mt-auto md:justify-start">
            <div className="w-full max-w-md md:max-w-none">
              <button 
                onClick={handleOrder} 
                className="w-full md:w-auto md:px-12 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 md:py-5 rounded-2xl md:rounded-full flex justify-center items-center gap-3 shadow-lg shadow-red-200 active:scale-95 transition-all text-lg md:text-2xl hover:shadow-xl hover:shadow-red-300 hover:scale-105"
              >
                <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
                {t.orderNow} - {p.price} ETB
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-800">
        <div className="w-full bg-white xl:max-w-[1600px] min-h-screen shadow-2xl flex flex-col items-center justify-center transition-all duration-300">
          <Loader2 className="w-8 h-8 md:w-16 md:h-16 text-red-500 animate-spin mb-4 md:mb-6" />
          <p className="text-gray-500 font-medium md:text-2xl">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-800">
      <div className="w-full bg-white xl:max-w-[1600px] min-h-screen shadow-2xl relative overflow-x-hidden flex flex-col transition-all duration-300 mx-auto border-x border-gray-100">
        
        {/* DYNAMIC HEADER */}
        <header className="flex items-center justify-between px-5 py-4 md:px-10 md:py-6 bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
          <div className="flex items-center gap-3 md:gap-6">
            {view !== 'home' ? (
              <button onClick={goBack} className="p-2 md:p-3 bg-gray-100 rounded-full active:scale-90 transition-transform hover:bg-gray-200">
                <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 text-gray-800" />
              </button>
            ) : (
              <div className="bg-red-500 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-md shadow-red-200">
                <ShoppingBag className="w-5 h-5 md:w-8 md:h-8 text-white" />
              </div>
            )}
            
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              {view === 'home' ? t.appTitle : t.back}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4 bg-gray-100 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full hover:bg-gray-200 transition-colors shadow-sm cursor-pointer">
            <Globe className="w-4 h-4 md:w-6 md:h-6 text-gray-500" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-sm md:text-lg font-medium outline-none cursor-pointer text-gray-700"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="om">Oromoo</option>
            </select>
          </div>
        </header>

        {/* MAIN VIEWS */}
        <main className="flex-1 overflow-y-auto pb-6 md:pb-12">
          {view === 'home' && renderHome()}
          {view === 'categories' && renderCategories()}
          {view === 'products' && renderProducts()}
          {view === 'product' && renderProductDetail()}
        </main>

      </div>
    </div>
  );
}