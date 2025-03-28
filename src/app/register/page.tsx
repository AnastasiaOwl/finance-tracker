"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { signUpWithEmail,signInWithGoogle, signInWithEmail  } from "@/firebase/firebaseApi"; 
import FloatingNumbers from "@/components/FloatingNumbers";
import React from "react";
import Image from "next/image";
import financeChart from "@/icons/financeChart.jpg";
import userIcon from "@/icons/icons8-user-32.png";
import passwordIcon from "@/icons/icons8-password-24.png";
import passwordCheckIcon from "@/icons/icons8-password-96.png"
import googleIcon from "@/icons/icons8-google-plus-48.png";

export default function RegisterPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const circleTranslate = "translate-x-[122px]";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      await signUpWithEmail(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed. Try again.");
    }
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await  signInWithEmail(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
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

    const toggleAuthMode = () => {
    setIsRegisterMode((prev) => !prev);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
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
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="flex flex-col w-64 bg-black/80 w-[25vw] h-[65vh] items-center 
        border  rounded-2xl z-10">
            <div className="relative inline-flex items-center cursor-pointer select-none mt-[2vw] mb-[4vw]" onClick={toggleAuthMode}>
            <div className={`
                block w-40 h-10 rounded-full border transition-all duration-300
                ${isRegisterMode 
                  ? "bg-black border-white"  
                  : "bg-white border-black"
                }`}></div>
              <div className={`
                  absolute left-1 right-1 w-8 h-8 rounded-full shadow-md transition-all duration-300
                  ${isRegisterMode 
                    ? "bg-white translate-x-0" 
                    : "bg-black " + circleTranslate
                  }`}></div>
              <span
                className={` absolute left-0 w-full text-center font-medium transition-colors duration-300
                  ${isRegisterMode ? "text-white" : "text-black"}`}>
                {isRegisterMode ? "Реєстрація" : "Авторизація"}
              </span>
          </div>
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
              {isRegisterMode && (
              <div className="flex items-center mb-3">
                <Image src={passwordCheckIcon} alt="password" width={30} height={30} className="mr-2" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="p-2 border rounded w-[18vw]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <button
              type="submit"
              onSubmit={isRegisterMode ? handleRegister : handleLogin}
              className="bg-black text-white border border-white px-4 py-2 rounded-xl w-[10vw]
                      hover:bg-white hover:text-black hover:border-black
                      transition-colors duration-300"
              >
              {isRegisterMode ? "Зареєструватись" : "Увійти"}
            </button>
            {errorMessage && <p className="text-red-400 mb-2">{errorMessage}</p>}
          </div>
          {!isRegisterMode && (
            <div className="flex flex-row items-center mt-[3.5vw]">
              <p className="text-white mr-[1.5vw]">Авторизуватись через</p>
              <button
                className="w-[2vw] h-[2vw] mr-[0.5vw] transition-transform duration-300 hover:scale-110"
                onClick={handleRegisterGoogle}
              >
                <Image src={googleIcon} alt="google" />
              </button>
            </div>
          )}
        </form>
      </div>
      <FloatingNumbers />
    </div>
  );
}
