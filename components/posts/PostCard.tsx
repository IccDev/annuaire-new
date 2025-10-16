"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MapPin, Calendar } from "lucide-react";
import { PostWithAuthor } from "@/types/interfaces/post";
import { getPostTypeInfo, getCategoryInfo } from "@/lib/constants/post-categories";

interface PostCardProps {
  post: PostWithAuthor;
}

export default function PostCard({ post }: PostCardProps) {
  const typeInfo = getPostTypeInfo(post.type);
  const categoryInfo = getCategoryInfo(post.category);
  
  const isExpired = post.expiresAt && new Date(post.expiresAt) < new Date();

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge className={`${typeInfo.color} text-white`}>
              {typeInfo.label}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-lg line-clamp-2 mt-2">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{post.location}</span>
              </div>
            )}
            <Badge variant="outline">
              {categoryInfo.label}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.description}
          </p>

          {isExpired && (
            <Badge variant="destructive" className="mt-3">
              Expirée
            </Badge>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.imageUrl || undefined} />
                <AvatarFallback>
                  {post.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{post.author.name}</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
