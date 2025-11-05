import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import InputField from "../components/inputFeild";
import Button from "../components/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data?.token) {
        login(data.token, data.user.type);

        console.log("Token saved:", localStorage.getItem("authToken"));
        console.log("User type saved:", localStorage.getItem("userType"));

        navigate("/");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-accent">
      <form
        onSubmit={handleLogin}
        className="bg-white/70 backdrop-blur-glass shadow-smooth rounded-2xl p-10 w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button label="Login" type="submit" />
      </form>
    </div>
  );
}
