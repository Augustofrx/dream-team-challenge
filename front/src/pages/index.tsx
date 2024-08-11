import React, { useState } from "react";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";

export default function Home() {
  const [isRegisterModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <nav className="w-full h-[70px] bg-black bg-opacity-30 backdrop-blur-lg z-10 drop-shadow-lg flex justify-between items-center">
        <img className="mx-4 w-20" src="/dt-logo.webp" alt="dt-logo" />
        <div>
          <button
            className="border-none font-anton btn btn-sm text-green-800 hover:text-green-900  bg-green-200 hover:bg-green-100 mx-2"
            onClick={() => setLoginModalOpen(true)}
          >
            Iniciar sesión
          </button>

          <button
            className="font-anton btn btn-sm text-green-200 hover:text-green-200  bg-green-900 hover:bg-green-800 mx-2 border-2 border-green-200"
            onClick={() => setRegisterModalOpen(true)}
          >
            Registrarse
          </button>
        </div>
      </nav>
      <div className="z-10 w-full h-full flex flex-col gap-2 text-white justify-center items-center">
        <div>
          <h1 className="text-5xl font-anton text-center">BIENVENIDO A</h1>
          <p className="text-7xl font-anton font-semibold text-center">
            DREAM TEAM
          </p>
        </div>
        <div>
          <span className="font-anton text-2xl text-green-200 hover:text-green-300 underline underline-offset-auto cursor-pointer mx-2 border-none text-center">
            ¿Qué es Dream Team?
          </span>
        </div>
      </div>
      <section className="w-full h-full flex flex-col justify-center items-center">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
      </section>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </main>
  );
}
