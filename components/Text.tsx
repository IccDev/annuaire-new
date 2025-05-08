import React from "react";

interface TextProps {
    font_size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
    color?: string;
    font_weight?: "normal" | "medium" | "semibold" | "bold";
    text_align?: "left" | "center" | "right";
    children: React.ReactNode;
    className?: string;
}

export const Text: React.FC<TextProps> = ({
    font_size = "base",
    color = "black",
    font_weight = "normal",
    text_align = "left",
    children,
    className = "",
}) => {
    const sizeClasses = {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
    };

    const weightClasses = {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
    };

    const alignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <p
            className={`${sizeClasses[font_size]} text-${color} ${weightClasses[font_weight]} ${alignClasses[text_align]} ${className}`}
        >
            {children}
        </p>
    );
};
