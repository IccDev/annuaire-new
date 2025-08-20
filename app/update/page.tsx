"use client";

import React from "react";
import UserUpdate from "@/components/shared/UpdateForm";
import { useSession } from "@/lib/auth-client";

const UpdatePage = () => {
    const { data: session } = useSession();

    if (!session?.user) {
        return <div>Chargement...</div>;
    }

    return (
        <UserUpdate email={session.user.email || ""} />
    )
}

export default UpdatePage;