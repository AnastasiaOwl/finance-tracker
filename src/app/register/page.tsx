"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { signUpWithEmail } from "@/firebase/firebaseApi"; 
import React from "react";
import financeChart from "@/icons/financeChart.jpg";
import FloatingNumbers from "@/components/FloatingNumbers";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signUpWithEmail(email, password); 
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ 
        backgroundImage: `url(${financeChart.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <form onSubmit={handleRegister} className="flex flex-col w-64 bg-black w-[25vw] h-[65vh] items-center 
        border  rounded-2xl z-10">
          <h1 className="text-xl text-white mt-[2vw] mb-[4vw] mb-4 justify-self-start">Реєстрація</h1>
          <div className=" flex flex-col gap-8 items-center">
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded w-[18vw]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-2 border rounded w-[18vw]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-[10vw]"
            >
              Зареєструватись
            </button>
          </div>
        </form>
      </div>
      <FloatingNumbers />
    </div>
  );
}
