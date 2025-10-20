"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ExportExcelButton() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        try {
            setIsExporting(true);

            const response = await fetch("/api/admin/export-excel");

            if (!response.ok) {
                throw new Error("Erreur lors de l'export");
            }

            const blob = await response.blob();

            const contentDisposition = response.headers.get("Content-Disposition");
            let filename = "rapport_icc.xlsx";

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Rapport Excel téléchargé avec succès", {
                description: `Le fichier ${filename} a été téléchargé`,
            });
        } catch (error) {
            console.error("Erreur lors de l'export:", error);
            toast.error("Erreur lors de l'export", {
                description: "Impossible de générer le rapport Excel",
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
            size="lg"
        >
            {isExporting ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Génération en cours...
                </>
            ) : (
                <>
                    <FileSpreadsheet className="w-5 h-5 mr-2" />
                    Exporter en Excel
                    <Download className="w-4 h-4 ml-2" />
                </>
            )}
        </Button>
    );
}
