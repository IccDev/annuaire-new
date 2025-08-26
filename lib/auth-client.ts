import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000"
});

export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession 
} = authClient;

// Export des fonctions de reset password
export const forgetPassword = authClient.forgetPassword;
export const resetPassword = authClient.resetPassword;
