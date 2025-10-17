import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to_email, url_formulaire, object } = body;

    if (!to_email || !url_formulaire || !object) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "ICC Annuaire <no-reply@impactcentrechretien.eu>",
      to: [to_email],
      subject: object,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation sur l'Annuaire des compétences</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .container { background-color: #f9fafb; border-radius: 8px; padding: 24px; }
              .button { display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 16px 0; }
              .footer { margin-top: 24px; font-size: 14px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Bienvenue sur l'Annuaire des compétences d'ICC Belgique.</h2>
              <p>Bonjour,</p>
              <p>Vous êtes invité(e) à rejoindre notre annuaire dédié aux corps des métiers et compétences d'ICC Belgique. Pour créer votre profil, veuillez cliquer sur le bouton ci-dessous :</p>
              <a href="${url_formulaire}" class="button">Créer mon profil</a>
              <div class="footer">
                <p>Cordialement,<br>L'équipe informatique (DSI)</p>
                <p><i> Ce lien expirera dans 5 jours</i></p>
                <p>iccdev@impactcentrechretien.eu</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Une erreur improbable est arrivée." },
      { status: 500 }
    );
  }
}
