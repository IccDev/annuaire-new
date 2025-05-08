"use client";

import { useParams } from "next/navigation";
import UpdateFormComplete from "@/components/update/UpdateForm";

export default function UpdatePage() {
    const params = useParams();
    const email = params.email as string;

    return (
        <div className="container mx-auto py-8 px-4">
            <UpdateFormComplete />
        </div>
    );
}