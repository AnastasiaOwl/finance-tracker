"use client";
import { useState } from "react"; //md: phone //lg: laptop
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
        <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="flex flex-col bg-black/80  
        md:w-[calc(var(--vw)*70)]
        md:h-fit
        lg:w-96 items-center 
        border  rounded-2xl z-10">
          <div className="relative inline-flex items-center cursor-pointer select-none mt-[calc(var(--vw)*2)] mb-[calc(var(--vw)*4)]" onClick={toggleAuthMode}>
            <div className={`
                block
                h-[calc(var(--vw)*10)]
                md:w-[calc(var(--vw)*25)]
                lg:w-[calc(var(--vw)*13)]
                md:h-10 
                rounded-full border transition-all ease-in-out duration-700
                ${isRegisterMode 
                  ? "bg-black border-white transition-colors ease-in-out duration-700"
                  : "bg-white border-black transition-colors ease-in-out duration-700"
                }`}></div>
              <div className={`
                  absolute top-1
                 ${isRegisterMode ? "left-1 bg-white" : "right-1 bg-black"}
                  w-6 h-6
                  md:w-8
                  md:h-8  rounded-full shadow-md
                  transition-transform ease-in-out duration-700
                  }`}></div>
              <span
                className={` absolute left-0 w-full text-center 
                      text-sm
                      md:text-lg  transition-colors duration-300
                  ${isRegisterMode ? "text-white" : "text-black"}`}>
                {isRegisterMode ? "Реєстрація" : "Авторизація"}
              </span>
          </div>
          <div className=" flex flex-col 
            gap-8
            items-center mt-[calc(var(--vw)*4)] 
            md:mt-[calc(var(--vw)*0)]">
            <div className="flex flex-row items-center">
              <Image src={userIcon} alt="user" className="mr-[0.8vw]
                md:w-[calc(var(--vw)*2.5)]
                md:h-[calc(var(--vw)*2.5)]
                lg:w-[calc(var(--vw)*2)]
                lg:h-[calc(var(--vw)*2)]" />
              <input
                type="email"
                placeholder="Email"
                className="p-2 border rounded 
                md:w-[calc(var(--vw)*25)]
                md:h-[calc(var(--vw)*4)]
                lg:w-[calc(var(--vw)*18)]
                lg:h-[calc(var(--vw)*3)]
                text-sm
                md:text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-row items-center">
              <Image src={passwordIcon} alt="password" className="mr-[0.8vw]
                md:w-[calc(var(--vw)*2.5)]
                md:h-[calc(var(--vw)*2.5)]
                lg:w-[calc(var(--vw)*2)]
                lg:h-[calc(var(--vw)*2)]"/>
              <input
                type="password"
                placeholder="Password"
                className="p-2 border rounded
                md:w-[calc(var(--vw)*25)]
                md:h-[calc(var(--vw)*4)]
                lg:w-[calc(var(--vw)*18)]
                lg:h-[calc(var(--vw)*3)]
                text-sm
                md:text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
              {isRegisterMode && (
              <div className="flex items-center mb-3">
                <Image src={passwordCheckIcon} alt="password" className="mr-2
                md:w-[calc(var(--vw)*2.5)]
                md:h-[calc(var(--vw)*2.5)]
                lg:w-[calc(var(--vw)*2)]
                lg:h-[calc(var(--vw)*2)]" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="p-2 border rounded    
                  md:w-[calc(var(--vw)*25)]
                  md:h-[calc(var(--vw)*4)]
                  lg:w-[calc(var(--vw)*18)]
                  lg:h-[calc(var(--vw)*3)]
                  text-sm
                  md:text-lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <button
              type="submit"
              onSubmit={isRegisterMode ? handleRegister : handleLogin}
              className="bg-black text-white border border-white px-4 py-2 rounded-xl
              inline-flex items-center justify-center
              w-fit
              md:mb-[calc(var(--vw)*1)]
              text-sm
              md:text-lg
              hover:bg-white hover:text-black hover:border-black
              transition-colors duration-300"
              >
              {isRegisterMode ? "Зареєструватись" : "Увійти"}
            </button>
            {errorMessage && <p className="text-red-400 mb-2">{errorMessage}</p>}
          </div>
          {!isRegisterMode && (
            <div className="flex flex-row items-center mt-[calc(var(--vw)*3)]
            md:mb-[calc(var(--vw)*1)]">
              <p className="text-white mr-[calc(var(--vw)*1)]
              text-sm
              md:text-lg">Авторизуватись через</p>
              <button
                className="
                md:w-[3.5vw]
                md:h-[3.5vw]
                lg:w-[2.6vw]
                lg:h-[2.6vw]
                transition-transform duration-300 hover:scale-110"
                onClick={handleRegisterGoogle}
              >
                <Image src={googleIcon} alt="google"/>
              </button>
            </div>
          )}
        </form>
      </div>
      <FloatingNumbers />
    </div>
  );
}
