import { headers } from "next/headers";
import { auth } from "./auth";

export const getSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
};

export const getUSer = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return session?.user;
};
