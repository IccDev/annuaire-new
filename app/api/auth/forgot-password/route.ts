import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est requise." },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Ne pas révéler que l'utilisateur n'existe pas pour des raisons de sécurité
      return NextResponse.json({ 
        success: true, 
        message: "Si un compte avec cette adresse email existe, vous recevrez un email de réinitialisation." 
      });
    }

    // Générer un token de réinitialisation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 heure

    // Stocker le token dans la table verification
    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: email,
        value: token,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Créer l'URL de réinitialisation
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    // Envoyer l'email
    await resend.emails.send({
      from: "ICC Annuaire <no-reply@impactcentrechretien.eu>",
      to: [email],
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
              <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
              <div class="warning">
                <strong>⚠️ Important :</strong> Ce lien est valide pendant 1 heure seulement. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
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

    return NextResponse.json({ 
      success: true, 
      message: "Email de réinitialisation envoyé avec succès." 
    });

  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email de réinitialisation." },
      { status: 500 }
    );
  }
}
