import { getUser } from "@/lib/auth-server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function Auth() {
    const user = await getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Profil utilisateur</CardTitle>
                    <CardDescription>Informations de votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Nom</p>
                        <p className="text-base">{user.name || "Non renseigné"}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-base">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Email vérifié</p>
                        <p className="text-base">{user.emailVerified ? "Oui" : "Non"}</p>
                    </div>
                    {user.image && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Photo de profil</p>
                            <img 
                                src={user.image} 
                                alt="Profile" 
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}