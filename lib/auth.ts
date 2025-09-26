import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },

  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? ["https://annuaire.impactcentrechretien.eu"]
      : undefined,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({
      user,
      token,
      url,
    }: {
      user: any;
      token: string;
      url: string;
    }) => {
      console.log(
        "sendResetPassword appelé pour:",
        user.email,
        "token:",
        token.substring(0, 10) + "..."
      );
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      try {
        await resend.emails.send({
          from: "ICC Annuaire <no-reply@impactcentrechretien.eu>",
          to: [user.email],
          subject: "Réinitialisation de votre mot de passe - Annuaire ICC",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Réinitialisation de mot de passe</title>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .container { background-color: #f9fafb; border-radius: 8px; padding: 24px; }
                  .button { display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 16px 0; }
                  .footer { margin-top: 24px; font-size: 14px; color: #666; }
                  .warning { background-color: #fef3c7; padding: 12px; border-radius: 6px; margin: 16px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>Réinitialisation de votre mot de passe</h2>
                  <p>Bonjour ${user.name},</p>
                  <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte sur l'Annuaire des Professions de l'Église Impact Centre Chrétien.</p>
                  <p>Pour créer un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>
                  <a href="${url}" class="button">Réinitialiser mon mot de passe</a>
                  <div class="warning">
                    <strong> Important :</strong> Ce lien est valide pendant 1 heure seulement. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                  </div>
                  <div class="footer">
                    <p>Cordialement,<br>L'équipe informatique (DSI)</p>
                    <p>iccdev@impactcentrechretien.eu</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
      } catch (error) {
        console.error(
          "Erreur lors de l'envoi de l'email de réinitialisation:",
          error
        );
        throw error;
      }
    },
  },
  /*   socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  }, */
});
