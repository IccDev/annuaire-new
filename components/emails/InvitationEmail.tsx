import * as React from 'react';

interface InvitationEmailProps {
  url_formulaire: string;
}

export const InvitationEmail: React.FC<InvitationEmailProps> = ({ url_formulaire }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invitation à l'Annuaire ICC</title>
        <style dangerouslySetInnerHTML={{ __html: `
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .container { 
            background-color: #f9fafb; 
            border-radius: 8px; 
            padding: 24px; 
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
          }
          .button { 
            display: inline-block; 
            background-color: #1e293b; 
            color: white !important;
            text-decoration: none; 
            padding: 12px 24px; 
            border-radius: 6px; 
            margin: 16px 0;
            text-align: center;
          }
          .button:hover {
            background-color: #334155;
          }
          .footer { 
            margin-top: 24px; 
            font-size: 14px; 
            color: #666;
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
          }
        ` }} />
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h2 style={{ color: '#1e293b', fontSize: '24px', marginBottom: '16px' }}>Bienvenue à l'Annuaire ICC</h2>
          </div>
          <p>Bonjour,</p>
          <p>Vous avez été invité(e) à rejoindre l'annuaire ICC. Pour créer votre profil, veuillez cliquer sur le bouton ci-dessous :</p>
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <a href={url_formulaire} className="button">Créer mon profil</a>
          </div>
          <div className="footer">
            <p>Cordialement,<br />L'équipe ICC Annuaire</p>
          </div>
        </div>
      </body>
    </html>
  );
};