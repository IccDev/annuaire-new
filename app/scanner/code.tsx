import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useParams } from "next/navigation";

interface QRCodeProps {
    registerPath: string;
}

export default function QRCode({ registerPath }: QRCodeProps) {
    const params = useParams();
    const eglise = params.eglise as string;
    const fullPath = `https://www.impactcentrechretien.eu/register`;

    return (
        <div>
            <QRCodeSVG size={300} value={fullPath} />
        </div>
    );
}
