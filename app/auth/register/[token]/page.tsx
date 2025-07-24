import RegisterForm from "@/components/auth/RegisterForm";
import prisma from "@/lib/prisma";


export default async function RegisterPage({ params }: any) {
  const { token } = await params;


  const candidate = await prisma.candidate.findFirst({
    where: {
      id: token,
    },
  });

  if (!candidate?.codeValidation) {
    return <div className="text-red-500">Ce lien d'inscription n'est plus valide.</div>;
  }


  return <div> {candidate && <RegisterForm token={candidate?.id} emailCandidate={candidate?.emailCandidate} />} </div>;
}
