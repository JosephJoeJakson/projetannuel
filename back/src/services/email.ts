import Mailjet from 'node-mailjet';

interface EmailData {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables?: Record<string, any>;
}

interface MailjetConfig {
  apiKey: string;
  apiSecret: string;
  senderEmail: string;
  senderName: string;
  replyToEmail?: string;
  isEnabled: boolean;
}

class EmailService {
  private mailjet: any = null;
  private config: MailjetConfig | null = null;

  async initialize() {
    try {
      const apiKey = process.env.MAILJET_API_KEY;
      const apiSecret = process.env.MAILJET_API_SECRET;
      const senderEmail = process.env.MAILJET_SENDER_EMAIL || 'contact@asmanissieux.fr';
      const senderName = process.env.MAILJET_SENDER_NAME || 'AudelWeiss';
      const replyToEmail = process.env.MAILJET_REPLY_TO_EMAIL;
      const isEnabled = process.env.MAILJET_ENABLED === 'true';

      if (!isEnabled) {
        return false;
      }

      if (!apiKey || !apiSecret) {
        return false;
      }

      this.config = {
        apiKey,
        apiSecret,
        senderEmail,
        senderName,
        replyToEmail,
        isEnabled
      };

      this.mailjet = new Mailjet({
        apiKey: this.config.apiKey,
        apiSecret: this.config.apiSecret
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.mailjet || !this.config) {
      return false;
    }

    try {
      const request = this.mailjet.post('send', { version: 'v3.1' });

      const emailRequest = {
        Messages: [
          {
            From: {
              Email: this.config.senderEmail,
              Name: this.config.senderName
            },
            To: [
              {
                Email: emailData.to,
                Name: emailData.toName || emailData.to
              }
            ],
            Subject: emailData.subject,
            HTMLPart: emailData.htmlContent,
            TextPart: emailData.textContent || this.stripHtml(emailData.htmlContent),
            ...(this.config.replyToEmail && {
              ReplyTo: {
                Email: this.config.replyToEmail
              }
            })
          }
        ]
      };

      const response = await request.request(emailRequest);

      return true;
    } catch (error) {
      return false;
    }
  }

  async sendOrderConfirmation(order: any, user: any): Promise<boolean> {
    try {
      const siteName = process.env.SITE_NAME || 'AudelWeiss';
      const siteUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      const firstName = user.firstName || user.username || 'Client';
      const lastName = user.lastName || '';
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      
      const subject = `Confirmation de votre commande #${order.id} - ${siteName}`;
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de commande</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
        .content { padding: 20px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .btn:hover { background: #7C3AED; }
        .order-details { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Merci pour votre commande !</h1>
            <p>Commande #${order.id}</p>
        </div>
        
        <div class="content">
            <p>Bonjour ${fullName},</p>
            
            <p>Nous avons bien reçu votre commande du <strong>${new Date(order.createdAt).toLocaleDateString('fr-FR')}</strong> et nous vous en remercions.</p>
            
            <div class="order-details">
                <h3>Récapitulatif de votre commande</h3>
                <p><strong>Numéro de commande :</strong> ${order.id}</p>
                <p><strong>Date :</strong> ${new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                <p><strong>Montant total :</strong> ${order.total.toFixed(2)} €</p>
            </div>
            
            <p>Nous traitons votre commande et vous tiendrons informé de son avancement.</p>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="${siteUrl}/dashboard" class="btn">Suivre ma commande</a>
            </p>
            
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        </div>
        
        <div class="footer">
            <p>Cordialement,<br>L'équipe ${siteName}</p>
            <p><a href="${siteUrl}">${siteUrl}</a></p>
        </div>
    </div>
</body>
</html>`;

      const textContent = `Merci pour votre commande ${order.id}

Bonjour ${fullName},

Nous avons bien reçu votre commande du ${new Date(order.createdAt).toLocaleDateString('fr-FR')} et nous vous en remercions.

Récapitulatif de votre commande :
- Numéro de commande : ${order.id}
- Date : ${new Date(order.createdAt).toLocaleDateString('fr-FR')}
- Montant total : ${order.total.toFixed(2)} €

Nous traitons votre commande et vous tiendrons informé de son avancement.

Suivre ma commande : ${siteUrl}/dashboard

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe ${siteName}
${siteUrl}`;

      return await this.sendEmail({
        to: user.email,
        toName: `${user.firstName} ${user.lastName}`,
        subject,
        htmlContent,
        textContent
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la confirmation de commande:', error);
      return false;
    }
  }

  async sendOrderStatusUpdate(order: any, user: any, status: string): Promise<boolean> {
    try {
      const siteName = process.env.SITE_NAME || 'AudelWeiss';
      const siteUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      const firstName = user.firstName || user.username || 'Client';
      const lastName = user.lastName || '';
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      
      let subject = '';
      let statusText = '';
      
      switch (status) {
        case 'shipped':
          subject = `Votre commande #${order.id} a été expédiée - ${siteName}`;
          statusText = 'expédiée';
          break;
        case 'delivered':
          subject = `Votre commande #${order.id} a été livrée - ${siteName}`;
          statusText = 'livrée';
          break;
        default:
          console.warn(`Statut non géré: ${status}`);
          return false;
      }
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Mise à jour de commande</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px; }
        .content { padding: 20px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .btn:hover { background: #7C3AED; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Votre commande a été ${statusText} !</h1>
            <p>Commande #${order.id}</p>
        </div>
        
        <div class="content">
            <p>Bonjour ${fullName},</p>
            
            <p>Excellente nouvelle ! Votre commande du <strong>${new Date(order.createdAt).toLocaleDateString('fr-FR')}</strong> a été ${statusText}.</p>
            
            ${status === 'shipped' ? '<p>Vous devriez la recevoir dans les prochains jours.</p>' : '<p>Nous espérons que vous êtes satisfait de votre achat.</p>'}
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="${siteUrl}/dashboard" class="btn">Suivre ma commande</a>
            </p>
            
            <p>Merci de votre confiance !</p>
        </div>
        
        <div class="footer">
            <p>Cordialement,<br>L'équipe ${siteName}</p>
            <p><a href="${siteUrl}">${siteUrl}</a></p>
        </div>
    </div>
</body>
</html>`;

      return await this.sendEmail({
        to: user.email,
        toName: `${user.firstName} ${user.lastName}`,
        subject,
        htmlContent
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la mise à jour de statut:', error);
      return false;
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}

export default new EmailService(); 