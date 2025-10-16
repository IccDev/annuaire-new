// Constantes pour les catégories d'annonces

import { PostType } from "@/app/generated/prisma";

// Catégories d'annonces disponibles
export const POST_CATEGORIES = [
  { value: "informatique", label: "Informatique & Tech", icon: "💻" },
  { value: "construction", label: "Construction & BTP", icon: "🏗️" },
  { value: "sante", label: "Santé & Médical", icon: "⚕️" },
  { value: "education", label: "Éducation & Formation", icon: "📚" },
  { value: "commerce", label: "Commerce & Vente", icon: "🛍️" },
  { value: "artisanat", label: "Artisanat", icon: "🔨" },
  { value: "transport", label: "Transport & Logistique", icon: "🚚" },
  { value: "hotellerie", label: "Hôtellerie & Restauration", icon: "🍽️" },
  { value: "finance", label: "Finance & Comptabilité", icon: "💰" },
  { value: "juridique", label: "Juridique", icon: "⚖️" },
  { value: "communication", label: "Communication & Marketing", icon: "📢" },
  { value: "agriculture", label: "Agriculture", icon: "🌾" },
  { value: "immobilier", label: "Immobilier", icon: "🏠" },
  { value: "beaute", label: "Beauté & Bien-être", icon: "💆" },
  { value: "autre", label: "Autre", icon: "📌" },
] as const;

// Types de posts avec labels et couleurs
export const POST_TYPES = [
  {
    value: PostType.JOB_OFFER,
    label: "Offre d'emploi",
    description: "Je propose un emploi",
    icon: "💼",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgLight: "bg-blue-50",
  },
  {
    value: PostType.JOB_REQUEST,
    label: "Recherche d'emploi",
    description: "Je recherche un emploi",
    icon: "🔍",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgLight: "bg-green-50",
  },
  {
    value: PostType.SERVICE_OFFER,
    label: "Offre de service",
    description: "Je propose un service",
    icon: "🛠️",
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgLight: "bg-purple-50",
  },
  {
    value: PostType.SERVICE_REQUEST,
    label: "Recherche de service",
    description: "Je recherche un profil/service",
    icon: "🎯",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgLight: "bg-orange-50",
  },
  {
    value: PostType.ANNOUNCEMENT,
    label: "Annonce générale",
    description: "Annonce diverse",
    icon: "📣",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgLight: "bg-gray-50",
  },
] as const;

// Helper pour obtenir les infos d'un type
export const getPostTypeInfo = (type: PostType) => {
  return POST_TYPES.find((t) => t.value === type) || POST_TYPES[4];
};

// Helper pour obtenir les infos d'une catégorie
export const getCategoryInfo = (category: string) => {
  return POST_CATEGORIES.find((c) => c.value === category) || POST_CATEGORIES[POST_CATEGORIES.length - 1];
};

// Durées d'expiration suggérées
export const EXPIRATION_OPTIONS = [
  { value: "7", label: "7 jours" },
  { value: "14", label: "14 jours" },
  { value: "30", label: "30 jours" },
  { value: "60", label: "60 jours" },
  { value: "90", label: "90 jours" },
  { value: "never", label: "Jamais" },
] as const;
