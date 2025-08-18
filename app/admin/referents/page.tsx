"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, MoreHorizontal, Shield, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Referent {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: boolean | null;
  createdAt: Date;
}

export default function ReferentsPage() {
  const [referents, setReferents] = useState<Referent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionUser, setActionUser] = useState<Referent | null>(null);
  const [actionType, setActionType] = useState<'remove' | 'delete' | null>(null);

  useEffect(() => {
    fetchReferents();
  }, []);

  const fetchReferents = async () => {
    try {
      const response = await fetch('/api/admin/referents');
      if (response.ok) {
        const data = await response.json();
        setReferents(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des référents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionUser) return;

    try {
      if (actionType === 'remove') {
        const response = await fetch(`/api/admin/users/${actionUser.id}/role`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'USER' })
        });
        if (response.ok) fetchReferents();
      } else if (actionType === 'delete') {
        const response = await fetch(`/api/admin/users/${actionUser.id}`, {
          method: 'DELETE'
        });
        if (response.ok) fetchReferents();
      }
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
    } finally {
      setActionUser(null);
      setActionType(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-slate-200 animate-pulse rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 bg-clip-text text-transparent">
              Gestion des référents
            </h1>
            <p className="text-slate-600 mt-1 flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span>{referents.length} référent{referents.length > 1 ? 's' : ''} actif{referents.length > 1 ? 's' : ''}</span>
            </p>
          </div>
          <Badge className="bg-slate-100 text-slate-700 border-slate-200">
            {referents.length} référents
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {referents.map((referent) => (
            <Card 
              key={referent.id} 
              className="border-0 shadow-xl shadow-slate-500/5 bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 hover:scale-[1.02] group"
            >
              <CardHeader className="pb-2 md:pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <Avatar className="w-8 h-8 md:w-12 md:h-12 ring-2 ring-white shadow-md flex-shrink-0">
                      <AvatarImage src="/images/avatar.png" alt={referent.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white font-semibold text-xs md:text-sm">
                        {referent.name ? referent.name.charAt(0).toUpperCase() : 'R'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-sm md:text-lg font-semibold text-slate-800 truncate">
                        {referent.name || 'Référent'}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-slate-500 truncate">{referent.email}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-slate-100 transition-all duration-200"
                      >
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => window.open(`/user?id=${referent.id}`, '_blank')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir le profil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => {
                          setActionUser(referent);
                          setActionType('remove');
                        }}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Retirer le rôle référent
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() => {
                          setActionUser(referent);
                          setActionType('delete');
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer l'utilisateur
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                <div className="flex items-center justify-between">
                  <div className="scale-75 md:scale-100 origin-left">
                    <Badge className={
                      referent.role === 'ADMIN' 
                        ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 text-xs' 
                        : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0 text-xs'
                    }>
                      {referent.role}
                    </Badge>
                  </div>
                  {/* <div className="flex items-center space-x-1 md:space-x-2">
                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${referent.emailVerified ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className={`text-xs md:text-sm ${referent.emailVerified ? 'text-green-700' : 'text-amber-700'}`}>
                      {referent.emailVerified ? 'Vérifié' : 'En attente'}
                    </span>
                  </div> */}
                </div>
                
                <div className="text-center p-2 md:p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50">
                  <div className="text-sm md:text-lg font-semibold text-slate-700">
                    Depuis le {new Intl.DateTimeFormat('fr-FR', {
                      day: '2-digit',
                      month: '2-digit', 
                      year: 'numeric'
                    }).format(new Date(referent.createdAt))}
                  </div>
                  <div className="text-sm text-slate-600">Date d'inscription</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {referents.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Aucun référent trouvé</h3>
            <p className="text-slate-500">Les référents apparaîtront ici une fois promus.</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!actionUser && !!actionType} onOpenChange={() => {
        setActionUser(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'remove' ? 'Retirer le rôle référent' : 'Supprimer l\'utilisateur'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'remove' 
                ? `Êtes-vous sûr de vouloir retirer le rôle référent à ${actionUser?.name || actionUser?.email} ? Ils redeviendront utilisateur standard.`
                : `Êtes-vous sûr de vouloir supprimer ${actionUser?.name || actionUser?.email} ? Cette action est irréversible.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className={actionType === 'delete' ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {actionType === 'remove' ? 'Retirer le rôle' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
