const API_BASE_URL = 'https://taja-haat-backend.vercel.app';

export interface BackendUser {
  _id?: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string | null;
  subscriptionStatus: string;
  level: number;
  rating: number;
  image: string;
  role: 'farmer' | 'buyer';
}

export interface CreateUserRequest {
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string; // Required string (phone@gmail.com format)
  role: 'farmer' | 'buyer';
  image?: File;
}

class ApiService {
  private async uploadImage(file: File): Promise<string> {
    try {
      console.log('Starting image upload to ImgBB...', file.name);
      
      // Check if API key is available
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!apiKey) {
        console.warn('ImgBB API key not found, using placeholder image');
        const fileName = file.name.split('.')[0];
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(fileName)}&size=400&background=10b981&color=fff`;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }
      
      // Validate file size (max 32MB for ImgBB)
      const maxSize = 32 * 1024 * 1024; // 32MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 32MB.');
      }
      
      // Convert file to base64 for ImgBB API
      const base64 = await this.fileToBase64(file);
      
      // Using ImgBB API with your API key
      const formData = new FormData();
      formData.append('image', base64.split(',')[1]); // Remove data:image/... prefix
      formData.append('name', file.name.split('.')[0]); // Optional: set image name
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('ImgBB response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('ImgBB response:', data);
        
        if (data.success && data.data?.url) {
          console.log('Image uploaded successfully to ImgBB:', data.data.url);
          return data.data.url;
        } else {
          console.error('ImgBB upload failed:', data);
          throw new Error('ImgBB upload failed');
        }
      } else {
        const errorText = await response.text();
        console.error('ImgBB API error:', response.status, errorText);
        throw new Error(`ImgBB API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      // Fallback: return a placeholder with user's initials
      const fileName = file.name.split('.')[0];
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(fileName)}&size=400&background=10b981&color=fff`;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  async createUser(userData: CreateUserRequest): Promise<BackendUser> {
    try {
      console.log('Starting user creation process...', userData);
      let imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&size=400&background=10b981&color=fff`;
      
      // Upload image if provided
      if (userData.image) {
        console.log('Uploading image...', userData.image.name);
        imageUrl = await this.uploadImage(userData.image);
        console.log('Image uploaded successfully:', imageUrl);
      }

      const userPayload: Omit<BackendUser, '_id'> = {
        fullName: userData.fullName,
        address: userData.address,
        phoneNumber: userData.phoneNumber,
        email: userData.email, // This will be phone@gmail.com format
        subscriptionStatus: 'ফ্রি', // Free in Bengali
        level: 0,
        rating: 0,
        image: imageUrl,
        role: userData.role,
      };

      console.log('Sending user data to backend...', userPayload);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
      });

      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const createdUser = await response.json();
      console.log('User created successfully in backend:', createdUser);
      return createdUser;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async getUserByPhone(phoneNumber: string): Promise<BackendUser | null> {
    try {
      console.log('Searching for user with phone number:', phoneNumber);
      const response = await fetch(`${API_BASE_URL}/users`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      console.log('All users from backend:', users.map((u: BackendUser) => ({ phone: u.phoneNumber, name: u.fullName })));
      
      // Try to find user with exact match first
      let user = users.find((user: BackendUser) => user.phoneNumber === phoneNumber);
      
      if (!user) {
        // Try different phone number formats
        const normalizedInput = this.normalizePhoneNumber(phoneNumber);
        user = users.find((user: BackendUser) => this.normalizePhoneNumber(user.phoneNumber) === normalizedInput);
      }
      
      console.log('Found user:', user ? { phone: user.phoneNumber, name: user.fullName } : 'No user found');
      return user || null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Handle different input formats
    if (cleaned.startsWith('+880')) {
      return cleaned; // Already in correct format
    } else if (cleaned.startsWith('880')) {
      return '+' + cleaned; // Add + prefix
    } else if (cleaned.startsWith('01')) {
      return '+880' + cleaned.substring(1); // Convert 01XXXXXXXX to +8801XXXXXXXX
    } else if (cleaned.length === 10 && cleaned.startsWith('1')) {
      return '+880' + cleaned; // Convert 1XXXXXXXX to +8801XXXXXXXX
    } else {
      return '+880' + cleaned; // Default: prepend +880
    }
  }

  async updateUser(userId: string, updates: Partial<BackendUser>): Promise<BackendUser> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<BackendUser[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();
