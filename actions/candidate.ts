"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUSer } from "@/lib/auth-server";

export async function createCandidate(emailCandidate: string) {
  const user = await getUSer();

  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  const result = await prisma.candidate.create({
    data: {
      emailCandidate,
      emailReferent: user?.email || "",
      endedAt: twoWeeksFromNow,
    },
  });

  revalidatePath(`/auth/register/${result.id}`);
  redirect(`/auth/register/${result.id}`);
}

export async function getCandidateByToken(token: string) {
  const candidate = await prisma.candidate.findFirst({
    where: {
      id: token,
    },
  });

  return candidate;
}

export async function updateCandidate(token: string) {
  const updatedCandidate = await prisma.candidate.update({
    where: { id: token },
    data: {
      codeValidation: false,
    },
  });

  return updatedCandidate;
}
