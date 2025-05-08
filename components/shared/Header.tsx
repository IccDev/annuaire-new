"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeaderProps {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
    return (
        <header className={cn(
            "w-full bg-white/80 backdrop-blur-sm shadow-sm py-4",
            className
        )}>
            <div className="container mx-auto px-4 flex justify-center items-center">
                <div className="relative w-48 h-16">
                    <Image
                        src="/images/logo-icc.svg"
                        alt="Logo ICC"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
        </header>
    );
}