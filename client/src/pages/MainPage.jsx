import React, { useState } from 'react';
import { ShoppingCart, Phone, Mail, MapPin, Menu, X, Package, Store, Truck, User } from 'lucide-react';
import { Link } from "react-router-dom";

export default function MainPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('Всі товари');

  const products = [
    { id: 1, name: 'Свіжий хліб житній', price: 35, category: 'Хлібобулочні', image: '/src/assets/img/bread.png' },
    { id: 2, name: 'Молоко органічне 2.5%', price: 42, category: 'Молочні продукти', image: '/src/assets/img/milk.png' },
    { id: 3, name: 'Яйця курячі С0', price: 68, category: 'Яйця', image: '/src/assets/img/eggs.png' },
    { id: 4, name: 'Сир твердий "Гауда"', price: 185, category: 'Молочні продукти', image: '/src/assets/img/cheese.png' },
    { id: 5, name: 'Ковбаса варена premium', price: 215, category: "М'ясні вироби", image: '/src/assets/img/sausage.png' },
    { id: 6, name: 'Овочевий салат', price: 95, category: 'Салати', image: '/src/assets/img/salad.png' },
  ];

  const categories = ['Всі товари', 'Хлібобулочні', 'Молочні продукти', 'М\'ясні вироби', 'Овочі та фрукти'];

  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  const filteredProducts = selectedCategory === 'Всі товари' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">ФрешМаркет</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition">Головна</a>
              <a href="#products" className="text-gray-700 hover:text-green-600 transition">Каталог</a>
              <a href="#delivery" className="text-gray-700 hover:text-green-600 transition">Доставка</a>
              <a href="#contacts" className="text-gray-700 hover:text-green-600 transition">Контакти</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-700 hover:text-green-600 transition">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/auth" className="p-2 text-gray-700 hover:text-green-600 transition">
                <User className="h-7 w-7" />
              </Link>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <a href="#home" className="block py-2 text-gray-700 hover:text-green-600">Головна</a>
              <a href="#products" className="block py-2 text-gray-700 hover:text-green-600">Каталог</a>
              <a href="#delivery" className="block py-2 text-gray-700 hover:text-green-600">Доставка</a>
              <a href="#contacts" className="block py-2 text-gray-700 hover:text-green-600">Контакти</a>
            </nav>
          )}
        </div>
      </header>

      <section id="home" className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Свіжі продукти з доставкою</h2>
          <p className="text-xl mb-8 text-green-100">Для дому, магазинів та складів</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition">Переглянути каталог</a>
          </div>
        </div>
      </section>

      <section id="delivery" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Варіанти доставки</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-green-50 hover:shadow-lg transition">
              <div className="inline-block p-4 bg-green-600 rounded-full mb-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">Кінцевим споживачам</h4>
              <p className="text-gray-600">Доставка додому від 300 грн. Швидко та зручно по всьому місту.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50 hover:shadow-lg transition">
              <div className="inline-block p-4 bg-green-600 rounded-full mb-4">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">Роздрібним мережам</h4>
              <p className="text-gray-600">Спеціальні ціни для магазинів. Регулярні поставки продукції.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50 hover:shadow-lg transition">
              <div className="inline-block p-4 bg-green-600 rounded-full mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">На склади</h4>
              <p className="text-gray-600">Оптові обсяги з доставкою на ваш склад. Вигідні умови.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Наші продукти</h3>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
                <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full transition border border-gray-200 ${
                    selectedCategory === cat 
                    ? 'bg-green-600 text-white border-green-600' 
                    : 'bg-white text-gray-700 hover:bg-green-600 hover:text-white'
                }`}
                >
                {cat}
                </button>
            ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-6xl">
                    <img src={product.image} alt={product.name} className='h-40'></img>
                </div>
                <div className="p-6">
                    <span className="text-xs text-green-600 font-semibold">{product.category}</span>
                    <h4 className="text-lg font-bold mt-1 mb-2 text-gray-800">{product.name}</h4>
                    <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">{product.price} грн</span>
                    <button
                        onClick={addToCart}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Купити
                    </button>
                    </div>
                </div>
                </div>
            ))}
            </div>

            {filteredProducts.length === 0 && (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Товарів у цій категорії поки немає</p>
            </div>
            )}
        </div>
        </section>

      <footer id="contacts" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <Package className="h-6 w-6 mr-2 text-green-400" />
                ФрешМаркет
              </h4>
              <p className="text-gray-400">Якісні продукти харчування з доставкою для всіх типів клієнтів.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Контакти</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-green-400" />
                  <span>+38 (067) 123-45-67</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-green-400" />
                  <span>info@freshmarket.ua</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-green-400" />
                  <span>м. Київ, вул. Хрещатик, 1</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Графік роботи</h4>
              <div className="text-gray-400 space-y-2">
                <p>Пн-Пт: 8:00 - 20:00</p>
                <p>Сб-Нд: 9:00 - 18:00</p>
                <p className="mt-4 text-green-400 font-semibold">Прийом замовлень 24/7</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ФрешМаркет. Всі права захищено.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}