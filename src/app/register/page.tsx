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
        w-[calc(var(--vw)*80)]
        mobile-landscape:w-[calc(var(--vw)*60)]
        mobile-landscape:h-[calc(var(--vw)*50)]
        sm:w-40
        md:w-80
        lg:w-96 h-[65vh] items-center 
        border  rounded-2xl z-10">
          <div className="relative inline-flex items-center cursor-pointer select-none mt-[calc(var(--vw)*2)] mb-[calc(var(--vw)*4)]" onClick={toggleAuthMode}>
            <div className={`
                block
                w-[calc(var(--vw)*50)]
                h-[calc(var(--vw)*10)]
                mobile-landscape:w-[calc(var(--vw)*30)]
                mobile-landscape:h-[calc(var(--vw)*7)]
                sm:w-[calc(var(--vw)*30)]
                md:w-[calc(var(--vw)*12)]
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
                  mobile-landscape:w-[5.5vw]
                  mobile-landscape:h-[5.5vw]
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
            mobile-landscape:gap-3
            items-center mt-[calc(var(--vw)*4)] 
            md:mt-[calc(var(--vw)*0)]
            mobile-landscape:mt-[calc(var(--vw)*1)]">
            <div className="flex flex-row items-center">
              <Image src={userIcon} alt="user" className="mr-[0.8vw]
                w-[calc(var(--vw)*8)] h-[calc(var(--vw)*8)]
                mobile-landscape:w-[calc(var(--vw)*4)]
                mobile-landscape:h-[calc(var(--vw)*4)]
                md:w-[calc(var(--vw)*2)]
                md:h-[calc(var(--vw)*2)]" />
              <input
                type="email"
                placeholder="Email"
                className="p-2 border rounded 
                w-[calc(var(--vw)*46)] h-[calc(var(--vw)*10)]
                mobile-landscape:w-[calc(var(--vw)*35)]
                mobile-landscape:h-[calc(var(--vw)*6)]
                md:w-[calc(var(--vw)*18)]
                md:h-[calc(var(--vw)*3)]
                text-sm
                md:text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-row items-center">
              <Image src={passwordIcon} alt="password" className="mr-[0.8vw]
                w-[calc(var(--vw)*8)] h-[calc(var(--vw)*8)]
                mobile-landscape:w-[calc(var(--vw)*4)]
                mobile-landscape:h-[calc(var(--vw)*4)]
                md:w-[calc(var(--vw)*2)]
                md:h-[calc(var(--vw)*2)]"/>
              <input
                type="password"
                placeholder="Password"
                className="p-2 border rounded
                w-[calc(var(--vw)*46)] h-[calc(var(--vw)*10)]
                mobile-landscape:w-[calc(var(--vw)*35)]
                mobile-landscape:h-[calc(var(--vw)*6)]
                md:w-[calc(var(--vw)*18)]
                md:h-[calc(var(--vw)*3)]
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
                w-[calc(var(--vw)*8)] h-[calc(var(--vw)*8)]
                mobile-landscape:w-[calc(var(--vw)*4)]
                mobile-landscape:h-[calc(var(--vw)*4)]
                md:w-[calc(var(--vw)*2)]
                md:h-[calc(var(--vw)*2)]" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="p-2 border rounded    
                  w-[calc(var(--vw)*46)] h-[calc(var(--vw)*10)]
                  mobile-landscape:w-[calc(var(--vw)*35)]
                  mobile-landscape:h-[calc(var(--vw)*6)]
                  md:w-[calc(var(--vw)*18)]
                  md:h-[calc(var(--vw)*3)]
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
              mobile-landscape:h-[calc(var(--vw)*6)]
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
            <div className="flex flex-row items-center mt-[calc(var(--vw)*3)]">
              <p className="text-white mr-[calc(var(--vw)*1)]
              text-sm
              md:text-lg">Авторизуватись через</p>
              <button
                className="w-[calc(var(--vw)*8)] h-[calc(var(--vw)*8)]
                mobile-landscape:w-[calc(var(--vw)*5)]
                mobile-landscape:h-[calc(var(--vw)*5)]
                md:w-[2.6vw]
                md:h-[2.6vw]
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
