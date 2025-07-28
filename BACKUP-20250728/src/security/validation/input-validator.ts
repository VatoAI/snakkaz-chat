// Comprehensive Input Validation

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

class InputValidator {
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }
      
      if (email.length > 254) {
        errors.push('Email is too long');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: email?.toLowerCase().trim()
    };
  }

  validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    
    if (!username) {
      errors.push('Username is required');
    } else {
      if (username.length < 3) {
        errors.push('Username must be at least 3 characters');
      }
      
      if (username.length > 30) {
        errors.push('Username must be less than 30 characters');
      }
      
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(username)) {
        errors.push('Username can only contain letters, numbers, hyphens, and underscores');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: username?.trim()
    };
  }

  validateMessage(message: string): ValidationResult {
    const errors: string[] = [];
    
    if (!message) {
      errors.push('Message cannot be empty');
    } else {
      if (message.length > 5000) {
        errors.push('Message is too long (max 5000 characters)');
      }
      
      // Check for potentially malicious content
      const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /onload=/gi,
        /onerror=/gi
      ];
      
      const hasDangerousContent = dangerousPatterns.some(pattern => pattern.test(message));
      if (hasDangerousContent) {
        errors.push('Message contains potentially dangerous content');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: this.sanitizeHtml(message)
    };
  }

  private sanitizeHtml(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  validateFileUpload(file: any): ValidationResult {
    const errors: string[] = [];
    
    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('File size exceeds 5MB limit');
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed. Only JPEG, PNG, GIF, and WebP are supported');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: file
    };
  }
}

export const inputValidator = new InputValidator();
