// WhatsApp Cloud API Service
interface WhatsAppOrderData {
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  totalAmount: number;
  deliveryLocation: string;
  farmerPhone: string;
  buyerPhone: string;
}

interface WhatsAppMessagePayload {
  messaging_product: string;
  to: string;
  type: string;
  text: {
    body: string;
  };
}

export class WhatsAppService {
  private static readonly API_URL = 'https://graph.facebook.com/v22.0/914167725102556/messages';
  private static readonly ACCESS_TOKEN = 'EAAZBaVz0ZCRTkBPxL0ihmXqhZAjqXXpeIpgFPNZC0FHtRRa9aWKZAR0SjUHtpg2PT0cZASZA08di3jtjqAOebUQfiEo53a5aDNrVJinDQhCwoJzLRp7koGkRphj8cu1n4KxWHCZCNMU3tFLBZAxVaJa4cTz5eVyvZCC9jKYVZA73iYip4EBqZBS4SD6klZA5SSg3f2bHhUrMVJyRA8yPwZCaK9kf1F4ZAOEwZAdenquZBXJgRCMxzghC318CagZBs5YDqZAfOYTuvOVTS7a9yq1dW6a3rHo3g3YxDeW';

  /**
   * Format phone number for WhatsApp API (must include country code without +)
   * Bangladesh numbers: 880 + 10 digits (without leading 0)
   */
  private static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/[^\d]/g, '');
    
    // If starts with 01 (Bangladesh local format), convert to international
    if (cleaned.startsWith('01') && cleaned.length === 11) {
      return '880' + cleaned.substring(1); // 880 + remove first 0
    }
    
    // If already starts with 880, use as is
    if (cleaned.startsWith('880') && cleaned.length === 13) {
      return cleaned;
    }
    
    // Default fallback - assume Bangladesh number
    return '8801400505738'; // Demo number
  }

  /**
   * Create order notification message for farmer
   */
  private static createOrderMessage(orderData: WhatsAppOrderData): string {
    return `🚨 *New Order Alert!*

📦 *Product:* ${orderData.productName} (${orderData.quantity} ${orderData.unit})

💰 *Price:* ৳${orderData.price} per ${orderData.unit}
💵 *Total Amount:* ৳${orderData.totalAmount}

📍 *Delivery Location:* ${orderData.deliveryLocation}

👤 *Buyer:* ${orderData.buyerPhone}

🔗 *Manage Order:* https://taja-haat.vercel.app/farmer-dashboard

Please log in to your farmer dashboard to accept or reject this order.

---
*Taja Haat - Fresh from Farm to You* 🌱`;
  }

  /**
   * Send WhatsApp message using Meta Cloud API
   */
  static async sendOrderNotification(orderData: WhatsAppOrderData): Promise<boolean> {
    try {
      console.log('Sending WhatsApp notification:', orderData);
      
      const formattedPhone = this.formatPhoneNumber(orderData.farmerPhone);
      const message = this.createOrderMessage(orderData);
      
      const payload: WhatsAppMessagePayload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          body: message
        }
      };

      console.log('WhatsApp API payload:', {
        to: formattedPhone,
        messageLength: message.length
      });

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('WhatsApp message sent successfully:', responseData);
        return true;
      } else {
        console.error('WhatsApp API error:', response.status, responseData);
        return false;
      }
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      return false;
    }
  }

  /**
   * Send test message for demo purposes
   */
  static async sendTestMessage(): Promise<boolean> {
    const testOrderData: WhatsAppOrderData = {
      productName: 'Fresh Tomatoes',
      quantity: 10,
      unit: 'kg',
      price: 50,
      totalAmount: 500,
      deliveryLocation: 'Dhaka, Mirpur-1',
      farmerPhone: '01400505738', // Demo farmer phone
      buyerPhone: '01700000000'   // Demo buyer phone
    };

    return await this.sendOrderNotification(testOrderData);
  }
}

export default WhatsAppService;
