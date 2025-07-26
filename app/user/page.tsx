import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUSer } from "@/lib/auth-server";
import { unauthorized } from "next/navigation";
import React from "react";

const AuthPage = async () => {
    const user = await getUSer();
    console.log("user in auth page: ", user);
    

    if (!user) {
        return unauthorized();
    }
    return (
        <Card>
            <CardHeader>User Profil</CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Name</span>
                        <span>{user?.name}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span>{user?.email}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AuthPage;