import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, User, LogOut, ShoppingBag, MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';

export function UserPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('https://python-web-back.onrender.com/orders/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/auth');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const toggleOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2 text-green-800 hover:text-green-600 transition">
              <Package className="h-8 w-8" />
              <h1 className="text-2xl font-bold">ФрешМаркет</h1>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">Мій кабінет</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700 transition font-medium"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Вийти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <ShoppingBag className="h-8 w-8 mr-3 text-green-600" />
          Мої замовлення
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Помилка!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Package className="h-20 w-20 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">У вас ще немає замовлень</h3>
            <p className="text-gray-500 mb-6">Зробіть своє перше замовлення прямо зараз!</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Перейти до покупок
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-900">Замовлення #{order.id}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Нове
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-4">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {order.delivery_method === 'courier' ? 'Кур\'єр' : 'Самовивіз'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {order.items.length} товарів
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Сума замовлення</div>
                      <div className="text-xl font-bold text-green-600">{order.total_price} грн</div>
                    </div>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-6 w-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Деталі доставки</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><span className="font-medium">Отримувач:</span> {order.name}</p>
                          <p><span className="font-medium">Телефон:</span> {order.phone}</p>
                          <p><span className="font-medium">Email:</span> {order.email}</p>
                          {order.delivery_method === 'courier' ? (
                            <p><span className="font-medium">Адреса:</span> {order.address}</p>
                          ) : (
                            <p><span className="font-medium">Склад:</span> {order.warehouse}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Товари</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                              <span className="font-medium text-gray-800">{item.product_name}</span>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">{item.quantity} шт x {item.price} грн</div>
                                <div className="font-semibold text-green-600">{item.quantity * item.price} грн</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}