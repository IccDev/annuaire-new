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
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-4 h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"
            />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Lien d'inscription invalide
          </h1>
          <p className="text-gray-600">
            Ce lien a expiré ou n’est plus actif.
            Veuillez demander un nouveau lien d'inscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {candidate && (
        <RegisterForm
          token={candidate?.id}
          emailCandidate={candidate?.emailCandidate}
        />
      )}
    </div>
  );
}



// import RegisterForm from "@/components/auth/RegisterForm";
// import prisma from "@/lib/prisma";


// export default async function RegisterPage({ params }: any) {
//   const { token } = await params;


//   const candidate = await prisma.candidate.findFirst({
//     where: {
//       id: token,
//     },
//   });

//   if (!candidate?.codeValidation) {
//     return <div className="text-red-500">Ce lien d'inscription n'est plus valide.</div>;
//   }


//   return <div> {candidate && <RegisterForm token={candidate?.id} emailCandidate={candidate?.emailCandidate} />} </div>;
// }
