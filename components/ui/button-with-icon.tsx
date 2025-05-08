import React from "react";

interface ButtonWithIconProps {
    handleOnClick: (e: React.MouseEvent, input: string) => void;
    onClickInput: string;
    children: React.ReactNode;
    className?: string;
}

const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
    handleOnClick,
    onClickInput,
    children,
    className = "",
}) => {
    return (
        <button
            onClick={(e) => handleOnClick(e, onClickInput)}
            className={`flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default ButtonWithIcon;
