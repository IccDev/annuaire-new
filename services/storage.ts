import { storage } from "@/config/firebase-config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const imageRef = ref(storage, `profile-photos/${Date.now()}-${file.name}`);

    const snapshot = await uploadBytes(imageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image:", error);
    throw new Error("Échec du téléchargement de l'image");
  }
};

export const uploadProfileImage = async (
  file: File,
  userId: string
): Promise<string> => {
  try {
    const fileName = `${userId}-${Date.now()}-${file.name}`;
    const imageRef = ref(storage, `profile-photos/${fileName}`);

    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de la photo de profil:",
      error
    );
    throw new Error("Échec du téléchargement de la photo de profil");
  }
};

export const deleteProfileImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
  }
};
