"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { PostWithAuthor } from "@/types/interfaces/post";
import { getPostTypeInfo, getCategoryInfo } from "@/lib/constants/post-categories";
import { deletePost } from "@/actions/post";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PostDetailProps {
  post: PostWithAuthor;
  isAuthor?: boolean;
  isAdmin?: boolean;
}

export default function PostDetail({ post, isAuthor = false, isAdmin = false }: PostDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const typeInfo = getPostTypeInfo(post.type);
  const categoryInfo = getCategoryInfo(post.category);
  const isExpired = post.expiresAt && new Date(post.expiresAt) < new Date();
  const canEdit = isAuthor || isAdmin;

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deletePost(post.id);

    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Annonce supprimée avec succès");
      router.push("/posts");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap gap-2">
                <Badge className={`${typeInfo.color} text-white`}>
                  {typeInfo.label}
                </Badge>
                <Badge variant="outline">{categoryInfo.label}</Badge>
                {!post.isActive && (
                  <Badge variant="secondary">Archivée</Badge>
                )}
                {isExpired && (
                  <Badge variant="destructive">Expirée</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold">{post.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {post.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{post.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} vues</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="sm:px-4"
                  size="sm"
                  asChild
                >
                  <Link href={`/posts/${post.id}/edit`}>
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline sm:ml-2">Modifier</span>
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="text-destructive hover:text-destructive sm:px-4"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline sm:ml-2">Supprimer</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer l'annonce</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. L'annonce sera définitivement supprimée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Suppression..." : "Supprimer"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {post.description}
            </p>
          </div>

          {post.requirements && (
            <>
              <Separator />
              <div>
                <h2 className="font-semibold mb-2">Critères recherchés</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {post.requirements}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-4">
            <h2 className="font-semibold">Contact</h2>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.imageUrl || undefined} />
                <AvatarFallback>
                  {post.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                {/* <Link
                  href={`/user?id=${post.author.id}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <User className="h-3 w-3" />
                  Voir le profil
                </Link> */}
              </div>
            </div>

            <div className="space-y-2">
              {post.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${post.contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    {post.contactEmail}
                  </a>
                </div>
              )}
              {post.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`tel:${post.contactPhone}`}
                    className="text-primary hover:underline"
                  >
                    {post.contactPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {post.expiresAt && (
            <>
              <Separator />
              <div className="text-sm text-muted-foreground">
                Expire le {new Date(post.expiresAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
