"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, Shield } from "lucide-react";
import { useState } from "react";
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

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: boolean | null;
  createdAt: Date;
}

interface UsersTableProps {
  users: User[];
  onUserUpdate: () => void;
}

function getRoleBadge(role: string) {
  switch (role) {
    case 'ADMIN':
      return <Badge className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0">Admin</Badge>;
    case 'REFERENT':
      return <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white border-0">Référent</Badge>;
    default:
      return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Utilisateur</Badge>;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export default function UsersTable({ users, onUserUpdate }: UsersTableProps) {
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [roleChangeUser, setRoleChangeUser] = useState<{ user: User; newRole: string } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUser(userId);
    setRoleChangeUser(null);
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        await onUserUpdate();
      }
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    try {
      const response = await fetch(`/api/admin/users/${deleteUser.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onUserUpdate();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setDeleteUser(null);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-xl shadow-slate-500/5 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">

          <div className="hidden md:grid grid-cols-10 gap-4 px-6 py-4 border-b border-slate-100/50 text-sm font-semibold text-slate-600">
            <div className="col-span-4">Utilisateur</div>
            <div className="col-span-2">Rôle</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          <div className="divide-y divide-slate-100/50">
            {users.map((user: User) => (
              <div key={user.id}>

                <div className="hidden md:grid grid-cols-10 gap-4 px-6 py-4 hover:bg-gradient-to-r hover:from-slate-50/30 hover:to-slate-100/20 transition-all duration-300 group">
                  <div className="col-span-4 flex items-center space-x-3">
                    <Avatar className="w-10 h-10 ring-2 ring-white shadow-md">
                      <AvatarImage src={(user as any).imageUrl || (user as any).image || undefined} alt={user.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate">{user.name || 'Utilisateur'}</p>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    {getRoleBadge(user.role)}
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-slate-600">{formatDate(new Date(user.createdAt))}</span>
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <DropdownMenu 
                      open={openDropdown === user.id} 
                      onOpenChange={(open) => setOpenDropdown(open ? user.id : null)}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-slate-100 transition-all duration-200"
                          disabled={updatingUser === user.id}
                        >
                          <MoreHorizontal className="h-4 w-4 text-slate-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            window.open(`/user?id=${user.id}`, '_blank');
                            setOpenDropdown(null);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le profil
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />

                        {user.role === 'ADMIN' ? (

                          <DropdownMenuItem
                            className="cursor-pointer text-orange-600 focus:text-orange-600"
                            onClick={() => {
                              setRoleChangeUser({ user, newRole: 'USER' });
                              setOpenDropdown(null);
                            }}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Retirer droits admin
                          </DropdownMenuItem>
                        ) : (

                          <>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                const newRole = user.role === 'REFERENT' ? 'USER' : 'REFERENT';
                                setRoleChangeUser({ user, newRole });
                                setOpenDropdown(null);
                              }}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {user.role === 'REFERENT' ? 'Retirer référent' : 'Promouvoir référent'}
                            </DropdownMenuItem>
                            {user.role === 'USER' && (
                              <DropdownMenuItem
                                className="cursor-pointer text-orange-600 focus:text-orange-600"
                                onClick={() => {
                                  setRoleChangeUser({ user, newRole: 'ADMIN' });
                                  setOpenDropdown(null);
                                }}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Promouvoir admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => {
                                setDeleteUser(user);
                                setOpenDropdown(null);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>


                <div className="md:hidden p-3 hover:bg-slate-50/50 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 ring-2 ring-white shadow-md flex-shrink-0">
                      <AvatarImage src={(user as any).imageUrl || (user as any).image || undefined} alt={user.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-slate-400 to-slate-500 text-white font-semibold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 truncate text-sm">{user.name || 'Utilisateur'}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="scale-75 origin-left">
                              {getRoleBadge(user.role)}
                            </div>
                            <span className="text-xs text-slate-500">
                              {formatDate(new Date(user.createdAt))}
                            </span>
                          </div>
                        </div>

                        <DropdownMenu
                          open={openDropdown === `mobile-${user.id}`}
                          onOpenChange={(open) => setOpenDropdown(open ? `mobile-${user.id}` : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-slate-100 transition-all duration-200 flex-shrink-0"
                              disabled={updatingUser === user.id}
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                window.open(`/user?id=${user.id}`, '_blank');
                                setOpenDropdown(null);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir le profil
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />

                            {user.role === 'ADMIN' ? (

                              <DropdownMenuItem
                                className="cursor-pointer text-orange-600 focus:text-orange-600"
                                onClick={() => {
                                  setRoleChangeUser({ user, newRole: 'USER' });
                                  setOpenDropdown(null);
                                }}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Retirer droits admin
                              </DropdownMenuItem>
                            ) : (

                              <>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const newRole = user.role === 'REFERENT' ? 'USER' : 'REFERENT';
                                    setRoleChangeUser({ user, newRole });
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  {user.role === 'REFERENT' ? 'Retirer référent' : 'Promouvoir référent'}
                                </DropdownMenuItem>
                                {user.role === 'USER' && (
                                  <DropdownMenuItem
                                    className="cursor-pointer text-orange-600 focus:text-orange-600"
                                    onClick={() => {
                                      setRoleChangeUser({ user, newRole: 'ADMIN' });
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Promouvoir admin
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                  onClick={() => {
                                    setDeleteUser(user);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Aucun utilisateur trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {deleteUser?.name || deleteUser?.email} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!roleChangeUser} onOpenChange={() => setRoleChangeUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {roleChangeUser?.newRole === 'ADMIN' ? 'Promouvoir en admin' :
                roleChangeUser?.newRole === 'REFERENT' ? 'Promouvoir en référent' :
                  'Retirer le rôle de référent'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {roleChangeUser?.newRole === 'ADMIN'
                ? `Êtes-vous sûr de vouloir donner les droits d'administrateur à ${roleChangeUser?.user.name || roleChangeUser?.user.email} ? Cette action lui donnera accès à toutes les fonctionnalités admin.`
                : roleChangeUser?.newRole === 'REFERENT'
                  ? `Êtes-vous sûr de vouloir donner le rôle de référent à ${roleChangeUser?.user.name || roleChangeUser?.user.email} ? Cette personne pourra ensuite être consultée dans la liste des référents.`
                  : `Êtes-vous sûr de vouloir retirer le rôle de référent à ${roleChangeUser?.user.name || roleChangeUser?.user.email} ?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => roleChangeUser && handleRoleChange(roleChangeUser.user.id, roleChangeUser.newRole)}
              className={roleChangeUser?.newRole === 'ADMIN' ? "bg-orange-600 hover:bg-orange-700" : "bg-slate-600 hover:bg-slate-700"}
            >
              {roleChangeUser?.newRole === 'ADMIN' ? 'Promouvoir admin' :
                roleChangeUser?.newRole === 'REFERENT' ? 'Promouvoir référent' :
                  'Retirer référent'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
