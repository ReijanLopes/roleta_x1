import { LoginForm } from "@/app/auth/login/login-form";
import Image from "next/image";

import logosvg from "@/public/logo/LogoColor 2.svg";

export default function Login() {
  return (
    <div className="bg-black bg-gradient-to-b from-black via-zinc-900 to-blue-700 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden ">
      <div className="absolute -left-[50%] top-[60%] md:-left-[40%] md:top-[40%] opacity-20 w-[500px] h-[500px] md:w-[1000px] md:h-[1000px] xl:-left-[20%] xl:w-[1500px] xl:h-[1500px]">
        <Image
          src={logosvg}
          alt="Logo da X1 Games"
          fill
          className="object-contain"
        />
      </div>
      <div className="w-full max-w-sm md:max-w-4xl z-10">
        <LoginForm />
      </div>
    </div>
  );
}
