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
  buyerName?: string;
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
  private static readonly ACCESS_TOKEN = 'EAAZBaVz0ZCRTkBP6UX3ggT8elNNZBVCneBTYII70LDixa4KELQcv6u430OvWR6eGXMCUZBkU0ZBXBp4A7jeU6r2QXFmMCYAb74ESyLNnnT0IyJZBYyMXwgAe4gLaeCMYRwhp9yCnik9usXqbnXbWAn3BBnsdvdi9pNClcLwAdMHSYgoAZBqhBDZBNyY9bYZCOqZA8W5xKUzpdBkFx7TQZAOf1VIcSjUvKkndV3D3tAMsUGRkeNKkZAjA6eU4z6cVmXJus6z8o093wZBgAyQUf6SMyUXCj0i8L';

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
    
    // Always use the specified number
    return '8801400505738';
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

👤 *Buyer:* ${orderData.buyerName || 'Customer'} (${orderData.buyerPhone})

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
      
      // Always send to the specified number
      const targetPhone = '8801400505738';
      
      // Try template message first (more reliable)
      console.log('Attempting template message first...');
      const templateSuccess = await this.sendTemplateMessage(targetPhone);
      if (templateSuccess) {
        console.log('Template message sent successfully');
        return true;
      }
      
      // Fallback to text message
      console.log('Template failed, trying text message...');
      const message = this.createOrderMessage(orderData);
      
      const payload: WhatsAppMessagePayload = {
        messaging_product: 'whatsapp',
        to: targetPhone,
        type: 'text',
        text: {
          body: message
        }
      };

      console.log('WhatsApp API payload:', {
        to: targetPhone,
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
      console.log('WhatsApp API response:', responseData);

      if (response.ok && responseData.messages) {
        console.log('WhatsApp message sent successfully');
        return true;
      } else {
        console.error('WhatsApp API error:', responseData);
        
        // Try fallback template method
        return await this.sendTemplateMessage(targetPhone);
      }
    } catch (error) {
      console.error('WhatsApp send error:', error);
      
      // Try fallback template method
      try {
        return await this.sendTemplateMessage('8801400505738');
      } catch (fallbackError) {
        console.error('WhatsApp template fallback failed:', fallbackError);
        return false;
      }
    }
  }

  /**
   * Send template message as primary method
   */
  static async sendTemplateMessage(phoneNumber: string): Promise<boolean> {
    try {
      console.log('Sending WhatsApp template message to:', phoneNumber);
      console.log('API URL:', this.API_URL);
      console.log('Access Token (first 50 chars):', this.ACCESS_TOKEN.substring(0, 50) + '...');
      
      const templatePayload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: 'hello_world',
          language: {
            code: 'en_US'
          }
        }
      };

      console.log('Template payload:', JSON.stringify(templatePayload, null, 2));

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templatePayload)
      });

      console.log('Template response status:', response.status);
      console.log('Template response headers:', response.headers);

      const responseData = await response.json();
      console.log('Template response data:', JSON.stringify(responseData, null, 2));

      if (response.ok) {
        if (responseData.messages && responseData.messages.length > 0) {
          console.log('✅ WhatsApp template message sent successfully!');
          console.log('Message ID:', responseData.messages[0].id);
          return true;
        } else {
          console.log('⚠️ Response OK but no messages array:', responseData);
          return false;
        }
      } else {
        console.error('❌ WhatsApp template error:', responseData);
        if (responseData.error) {
          console.error('Error details:', responseData.error);
        }
        return false;
      }
    } catch (error) {
      console.error('❌ WhatsApp template send error:', error);
      return false;
    }
  }

  /**
   * Send test message for demo purposes - exactly like the curl command
   */
  static async sendTestMessage(): Promise<boolean> {
    try {
      console.log('🧪 Sending test message exactly like curl command...');
      
      const curlPayload = {
        messaging_product: "whatsapp",
        to: "8801400505738",
        type: "template",
        template: {
          name: "hello_world",
          language: {
            code: "en_US"
          }
        }
      };

      console.log('Test payload:', JSON.stringify(curlPayload, null, 2));

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(curlPayload)
      });

      console.log('Test response status:', response.status);
      
      const responseData = await response.json();
      console.log('Test response data:', JSON.stringify(responseData, null, 2));

      if (response.ok && responseData.messages) {
        console.log('✅ Test message sent successfully!');
        return true;
      } else {
        console.error('❌ Test message failed:', responseData);
        return false;
      }
    } catch (error) {
      console.error('❌ Test message error:', error);
      return false;
    }
  }
}

export default WhatsAppService;
