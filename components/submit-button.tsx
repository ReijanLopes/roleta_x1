"use client";

import { useFormStatus } from "react-dom";
import React, { type ComponentProps } from "react";
import Loading from "./loading";


type Props = ComponentProps<"button"> & {
    isPending?: boolean;
  };

export function SubmitButtonClient({
    children,
    className,
    isPending,
    ...props
  }: Props) {
  
    return (
      <button
        {...props}
        type="submit"
        className={`${className} bg-[#353E2B] text-white h-9 rounded-lg cursor-pointer px-3 ${
          isPending && "!flex !items-center !justify-center cursor-progress"
        }`}
        aria-disabled={isPending}
        disabled={isPending}
      >
        {isPending ? <Loading  className="w-5 h-5"/> : children}
      </button>
    );
  }