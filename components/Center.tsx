import React from "react";

interface CenterProps {
    children: React.ReactNode;
    className?: string;
}

export const Center: React.FC<CenterProps> = ({ children, className = "" }) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            {children}
        </div>
    );
};
