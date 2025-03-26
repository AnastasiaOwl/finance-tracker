"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { signUpWithEmail,signInWithGoogle  } from "@/firebase/firebaseApi"; 
import FloatingNumbers from "@/components/FloatingNumbers";
import React from "react";
import Image from "next/image";
import financeChart from "@/icons/financeChart.jpg";
import userIcon from "@/icons/icons8-user-32.png";
import passwordIcon from "@/icons/icons8-password-24.png";
import googleIcon from "@/icons/icons8-google-plus-48.png";

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

  const handleRegisterGoogle = async (event: React.FormEvent)=>{
    event.preventDefault();
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
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
        <form onSubmit={handleRegister} className="flex flex-col w-64 bg-black/80 w-[25vw] h-[65vh] items-center 
        border  rounded-2xl z-10">
          <h1 className="text-xl text-white mt-[2vw] mb-[4vw] mb-4 justify-self-start">Реєстрація</h1>
          <div className=" flex flex-col gap-8 items-center">
            <div className="flex flex-row items-center">
              <Image src={userIcon} alt="user" width={30} height={30} className="mr-[0.8vw]" />
              <input
                type="email"
                placeholder="Email"
                className="p-2 border rounded w-[18vw]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-row items-center">
              <Image src={passwordIcon} alt="password" width={30} height={30} className="mr-[0.8vw]"/>
              <input
                type="password"
                placeholder="Password"
                className="p-2 border rounded w-[18vw]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              onClick={handleRegister}
              className="bg-black text-white border border-white px-4 py-2 rounded-xl w-[10vw]
                      hover:bg-white hover:text-black hover:border-black
                      transition-colors duration-300"
              >
              Зареєструватись
            </button>
          </div>
          <div className="flex flex-row items-center mt-[3.5vw]">
            <p className="text-white mr-[1.5vw]">Авторизуватись через </p>
            <button className=" w-[2vw] h-[2vw] mr-[0.5vw]
                              transition-transform 
                              duration-300 
                              hover:scale-110"
                              onClick = {handleRegisterGoogle}>
              <Image src={googleIcon} alt="google"/>
            </button>
          </div>
        </form>
      </div>
      <FloatingNumbers />
    </div>
  );
}
