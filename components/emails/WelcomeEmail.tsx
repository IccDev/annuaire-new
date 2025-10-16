import * as React from 'react';

interface WelcomeEmailProps {
  userName: string;
  annuaireUrl: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userName, annuaireUrl }) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bienvenue sur l'Annuaire ICC</title>
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
          .header h2 {
            color: #1e293b;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 6px;
            margin: 16px 0;
          }
          .button { 
            display: inline-block; 
            background-color: #10b981; 
            color: white !important;
            text-decoration: none; 
            padding: 12px 24px; 
            border-radius: 6px; 
            margin: 16px 0;
            text-align: center;
            font-weight: 500;
          }
          .button:hover {
            background-color: #059669;
          }
          .footer { 
            margin-top: 24px; 
            font-size: 14px; 
            color: #666;
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
          }
          .highlight {
            background-color: #d1fae5;
            padding: 2px 6px;
            border-radius: 4px;
            color: #065f46;
            font-weight: 500;
          }
        ` }} />
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h2>Bienvenue sur l'Annuaire ICC ! </h2>
          </div>
          
          <div className="content">
            <p>Bonjour <strong>{userName}</strong>,</p>
            
            <p>
              Félicitations ! Votre compte a été créé avec succès sur 
              <span className="highlight">l'Annuaire des compétences d'ICC Belgique</span>.
            </p>
            
            <p>
              Vous faites maintenant partie de notre communauté et pouvez accéder à toutes les fonctionnalités de la plateforme :
            </p>
            
            <ul style={{ marginLeft: '20px', color: '#475569' }}>
              <li>Consulter les profils des membres</li>
              <li>Publier et consulter des annonces</li>
              <li>Mettre à jour votre profil professionnel</li>
              <li>Rechercher des compétences spécifiques</li>
            </ul>
            
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <a href={annuaireUrl} className="button">
                Accéder à l'annuaire
              </a>
            </div>
            
            <p style={{ fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>
              Pour compléter votre profil professionnel, connectez-vous et rendez-vous dans votre espace personnel.
            </p>
          </div>
          
          <div className="footer">
            <p>
              <strong>Besoin d'aide ?</strong><br />
              N'hésitez pas à nous contacter à <a href="mailto:iccdev@impactcentrechretien.eu">iccdev@impactcentrechretien.eu</a>
            </p>
            <p>
              Cordialement,<br />
              <strong>L'équipe DSI - Impact Centre Chrétien</strong>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};
