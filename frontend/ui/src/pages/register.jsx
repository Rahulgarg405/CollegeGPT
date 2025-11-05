import { useState } from "react";
import InputField from "../components/inputFeild";
import Button from "../components/button";


export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log("Registration response:", data);
      alert(data.message || "Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering. Try again later.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-accent">
      <form
        onSubmit={handleRegister}
        className="bg-white/70 backdrop-blur-glass shadow-smooth rounded-2xl p-10 w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create Account
        </h2>
        <InputField
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <Button label="Register" type="submit" />
      </form>
    </div>
  );
}
