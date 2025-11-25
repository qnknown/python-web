import React, { useState, useMemo } from 'react';
import { ShoppingCart, Phone, Mail, MapPin, Menu, X, Package, Store, Truck, User, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { Link } from "react-router-dom";

export default function MainPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Всі товари');

  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryMethod: 'courier',
    warehouse: ''
  });

  const products = [
    { id: 1, name: 'Свіжий хліб житній', price: 35, wholesalePrice: 30, wholesaleMinQuantity: 10, category: 'Хлібобулочні', image: '/src/assets/img/bread.png' },
    { id: 2, name: 'Молоко органічне 2.5%', price: 42, wholesalePrice: 38, wholesaleMinQuantity: 12, category: 'Молочні продукти', image: '/src/assets/img/milk.png' },
    { id: 3, name: 'Яйця курячі С0', price: 68, wholesalePrice: 60, wholesaleMinQuantity: 10, category: 'Яйця', image: '/src/assets/img/eggs.png' },
    { id: 4, name: 'Сир твердий "Гауда"', price: 185, wholesalePrice: 165, wholesaleMinQuantity: 5, category: 'Молочні продукти', image: '/src/assets/img/cheese.png' },
    { id: 5, name: 'Ковбаса варена premium', price: 215, wholesalePrice: 195, wholesaleMinQuantity: 5, category: "М'ясні вироби", image: '/src/assets/img/sausage.png' },
    { id: 6, name: 'Овочевий салат', price: 95, wholesalePrice: 85, wholesaleMinQuantity: 5, category: 'Салати', image: '/src/assets/img/salad.png' },
  ];

  const categories = ['Всі товари', 'Хлібобулочні', 'Молочні продукти', 'М\'ясні вироби', 'Овочі та фрукти'];

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setOrderSuccess(false);
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = item.quantity >= item.wholesaleMinQuantity ? item.wholesalePrice : item.price;
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  const isWholesaleOrder = useMemo(() => {
    return cartItems.some(item => item.quantity >= item.wholesaleMinQuantity);
  }, [cartItems]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = selectedCategory === 'Всі товари'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      name: checkoutForm.name,
      phone: checkoutForm.phone,
      email: checkoutForm.email,
      address: checkoutForm.deliveryMethod === 'courier' ? checkoutForm.address : null,
      delivery_method: checkoutForm.deliveryMethod,
      warehouse: checkoutForm.deliveryMethod === 'warehouse' ? checkoutForm.warehouse : null,
      items: cartItems.map(item => ({
        product_name: item.name,
        quantity: item.quantity,
        price: item.quantity >= item.wholesaleMinQuantity ? item.wholesalePrice : item.price
      }))
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderSuccess(true);
        setCartItems([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setCheckoutForm({
          name: '',
          phone: '',
          email: '',
          address: '',
          deliveryMethod: 'courier',
          warehouse: ''
        });
      } else {
        console.error('Failed to submit order');
        alert('Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative">
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCheckoutOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-6 bg-green-600 text-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">Оформлення замовлення</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-white hover:text-green-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ім'я та Прізвище</label>
                <input
                  required
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={checkoutForm.name}
                  onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  required
                  type="tel"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={checkoutForm.phone}
                  onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={checkoutForm.email}
                  onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <label className="block text-sm font-medium text-green-800 mb-2">Спосіб доставки</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="courier"
                      checked={checkoutForm.deliveryMethod === 'courier'}
                      onChange={e => setCheckoutForm({ ...checkoutForm, deliveryMethod: e.target.value })}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>Кур'єр</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="warehouse"
                      checked={checkoutForm.deliveryMethod === 'warehouse'}
                      onChange={e => setCheckoutForm({ ...checkoutForm, deliveryMethod: e.target.value })}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span>Самовивіз зі складу</span>
                  </label>
                </div>
              </div>

              {(checkoutForm.deliveryMethod === 'courier') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Адреса доставки</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    value={checkoutForm.address}
                    onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                  ></textarea>
                </div>
              )}

              {checkoutForm.deliveryMethod === 'warehouse' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Оберіть склад</label>
                  <select
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    value={checkoutForm.warehouse}
                    onChange={e => setCheckoutForm({ ...checkoutForm, warehouse: e.target.value })}
                  >
                    <option value="">Оберіть склад...</option>
                    <option value="kyiv-1">Київ, Склад №1 (Правий берег)</option>
                    <option value="kyiv-2">Київ, Склад №2 (Лівий берег)</option>
                    <option value="lviv">Львів, Центральний термінал</option>
                  </select>
                </div>
              )}

              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">До сплати:</span>
                  <span className="text-2xl font-bold text-green-700">{cartTotal} грн</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Підтвердити замовлення
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setOrderSuccess(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-bounce-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Дякуємо!</h3>
            <p className="text-gray-600 mb-6">Ваше замовлення успішно прийнято. Ми зв'яжемося з вами найближчим часом.</p>
            <button
              onClick={() => setOrderSuccess(false)}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
            >
              Продовжити покупки
            </button>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            <div className="p-4 border-b flex justify-between items-center bg-green-50">
              <h2 className="text-xl font-bold text-green-800 flex items-center">
                <ShoppingCart className="mr-2" /> Кошик
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-green-100 rounded-full transition">
                <X className="h-6 w-6 text-green-800" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Ваш кошик порожній</p>
                </div>
              ) : (
                cartItems.map(item => {
                  const isWholesale = item.quantity >= item.wholesaleMinQuantity;
                  const currentPrice = isWholesale ? item.wholesalePrice : item.price;

                  return (
                    <div key={item.id} className="flex gap-4 bg-white border rounded-lg p-3 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md bg-green-50" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-gray-100 text-gray-600"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 font-medium text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${isWholesale ? 'text-green-600' : 'text-gray-800'}`}>
                              {currentPrice * item.quantity} грн
                            </div>
                            {isWholesale && (
                              <div className="text-xs text-green-600 font-medium">
                                Опт: {item.wholesalePrice} грн/шт
                              </div>
                            )}
                            {!isWholesale && item.quantity < item.wholesaleMinQuantity && (
                              <div className="text-xs text-gray-400">
                                Ще {item.wholesaleMinQuantity - item.quantity} шт до опт. ціни ({item.wholesalePrice} грн)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 self-start"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">Всього:</span>
                <span className="text-2xl font-bold text-green-700">{cartTotal} грн</span>
              </div>
              <button
                disabled={cartItems.length === 0}
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Оформити замовлення
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button
                className="relative p-2 text-gray-700 hover:text-green-600 transition"
                onClick={() => setIsCartOpen(true)}
              >
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
              <Link to={localStorage.getItem('token') ? (localStorage.getItem('role') === 'admin' ? "/admin" : "/user") : "/auth"} className="p-2 text-gray-700 hover:text-green-600 transition">
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
                className={`px-4 py-2 rounded-full transition border border-gray-200 ${selectedCategory === cat
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
              <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col">
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-6xl relative">
                  <img src={product.image} alt={product.name} className='h-40'></img>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-green-800 shadow-sm">
                    Опт від {product.wholesaleMinQuantity} шт
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs text-green-600 font-semibold">{product.category}</span>
                  <h4 className="text-lg font-bold mt-1 mb-2 text-gray-800">{product.name}</h4>
                  <div className="mt-auto flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{product.price} грн</div>
                      <div className="text-sm text-gray-500">Опт: <span className="font-semibold text-green-700">{product.wholesalePrice} грн</span></div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
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