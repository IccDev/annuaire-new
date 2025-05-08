import { storage } from "@/config/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
