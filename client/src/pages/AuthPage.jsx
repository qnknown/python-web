import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ user_name: "", password: "", email: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const endpoint = isLogin
      ? "https://python-web-back.onrender.com/auth"
      : "https://python-web-back.onrender.com/register";

    const payload = isLogin
      ? {
        user_name: form.user_name,
        password: form.password,
      }
      : {
        user_name: form.user_name,
        password: form.password,
        email: form.email,
      };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Помилка авторизації/реєстрації");

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") navigate("/admin");
      else navigate("/user");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-xl p-8 rounded-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          {isLogin ? "Авторизація" : "Реєстрація"}
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логін"
            className="w-full p-3 border rounded-lg"
            value={form.user_name}
            onChange={(e) => setForm({ ...form, user_name: e.target.value })}
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 border rounded-lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          )}

          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border rounded-lg"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
            {isLogin ? "Увійти" : "Зареєструватися"}
          </button>
        </form>

        <button
          className="w-full mt-4 text-green-600 underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Створити акаунт" : "Вже є акаунт? Увійти"}
        </button>
      </div>
    </div>
  );
}
