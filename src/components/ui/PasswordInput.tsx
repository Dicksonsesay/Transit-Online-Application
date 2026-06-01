"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  wrapperClassName?: string;
  inputClassName?: string;
  showLeftIcon?: boolean;
  iconSize?: number;
};

export default function PasswordInput({
  wrapperClassName,
  inputClassName,
  className,
  showLeftIcon = true,
  iconSize = 18,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const leftPad = showLeftIcon ? (iconSize >= 18 ? "pl-11" : "pl-10") : "pl-3.5";
  const leftIconPos = iconSize >= 18 ? "left-4" : "left-3.5";

  return (
    <div className={cn("relative", wrapperClassName)}>
      {showLeftIcon ? (
        <FiLock
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-zinc-400",
            leftIconPos
          )}
          size={iconSize}
          aria-hidden
        />
      ) : null}
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(leftPad, inputClassName, className, "pr-11")}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 transition-colors hover:text-[var(--primary-blue)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-blue)]/30"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? (
          <FiEyeOff size={iconSize} aria-hidden />
        ) : (
          <FiEye size={iconSize} aria-hidden />
        )}
      </button>
    </div>
  );
}
