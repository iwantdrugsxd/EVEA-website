// utils/helpers.js
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// ==================== ID GENERATION ====================

/**
 * Generate unique vendor ID
 * @returns {string} Formatted vendor ID (e.g., VEN-2024-001234)
 */
const generateVendorId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `VEN-${year}-${randomNum}`;
};

/**
 * Generate unique registration ID
 * @returns {string} Formatted registration ID (e.g., REG-20240101-ABC123)
 */
const generateRegistrationId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `REG-${date}-${randomStr}`;
};

/**
 * Generate unique service ID
 * @returns {string} Formatted service ID (e.g., SRV-ABC123DEF)
 */
const generateServiceId = () => {
  const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SRV-${randomStr}`;
};

/**
 * Generate unique booking reference
 * @returns {string} Formatted booking reference (e.g., BK240101001)
 */
const generateBookingReference = () => {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `BK${date}${randomNum}`;
};

// ==================== STRING UTILITIES ====================

/**
 * Generate URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Generate random string
 * @param {number} length - Length of random string
 * @param {string} charset - Character set to use
 * @returns {string} Random string
 */
const generateRandomString = (length = 8, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// ==================== VALIDATION HELPERS ====================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
const isValidIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  return phoneRegex.test(cleanPhone);
};

/**
 * Validate PAN number
 * @param {string} pan - PAN number to validate
 * @returns {boolean} Is valid PAN
 */
const isValidPAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan?.toUpperCase());
};

/**
 * Validate GST number
 * @param {string} gst - GST number to validate
 * @returns {boolean} Is valid GST
 */
const isValidGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst?.toUpperCase());
};

/**
 * Validate IFSC code
 * @param {string} ifsc - IFSC code to validate
 * @returns {boolean} Is valid IFSC
 */
const isValidIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc?.toUpperCase());
};

/**
 * Validate Indian PIN code
 * @param {string} pincode - PIN code to validate
 * @returns {boolean} Is valid PIN code
 */
const isValidPincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// ==================== FORMATTING HELPERS ====================

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
const formatPhone = (phone) => {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  
  return phone;
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount, currency = '₹') => {
  if (typeof amount !== 'number') return `${currency}0`;
  
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string} Formatted date
 */
const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    time: { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  };
  
  return dateObj.toLocaleDateString('en-IN', options[format]);
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ==================== DATA SANITIZATION ====================

/**
 * Sanitize string input
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (!str) return '';
  
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Sanitize object by removing undefined/null values
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

// ==================== FILE UTILITIES ====================

/**
 * Get file extension
 * @param {string} filename - Filename
 * @returns {string} File extension
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase().slice(1);
};

/**
 * Check if file type is allowed
 * @param {string} filename - Filename
 * @param {Array} allowedTypes - Array of allowed extensions
 * @returns {boolean} Is file type allowed
 */
const isAllowedFileType = (filename, allowedTypes = ['jpg', 'jpeg', 'png', 'pdf']) => {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
};

/**
 * Generate unique filename
 * @param {string} originalName - Original filename
 * @param {string} prefix - Prefix for filename
 * @returns {string} Unique filename
 */
const generateUniqueFilename = (originalName, prefix = '') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const extension = getFileExtension(originalName);
  const baseName = path.basename(originalName, `.${extension}`);
  
  return `${prefix}${prefix ? '_' : ''}${baseName}_${timestamp}_${random}.${extension}`;
};

// ==================== ARRAY UTILITIES ====================

/**
 * Remove duplicates from array
 * @param {Array} arr - Array with potential duplicates
 * @returns {Array} Array without duplicates
 */
const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};

/**
 * Chunk array into smaller arrays
 * @param {Array} arr - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Array of chunks
 */
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array randomly
 * @param {Array} arr - Array to shuffle
 * @returns {Array} Shuffled array
 */
const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ==================== PASSWORD UTILITIES ====================

/**
 * Generate strong password
 * @param {number} length - Password length
 * @returns {string} Generated password
 */
const generateStrongPassword = (length = 12) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  const categories = [
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    '!@#$%^&*'
  ];
  
  // Add one character from each category
  categories.forEach(category => {
    password += category.charAt(Math.floor(Math.random() * category.length));
  });
  
  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} Password strength analysis
 */
const checkPasswordStrength = (password) => {
  const analysis = {
    score: 0,
    feedback: [],
    strength: 'weak'
  };
  
  if (!password) return analysis;
  
  // Length check
  if (password.length >= 8) analysis.score += 2;
  else analysis.feedback.push('Use at least 8 characters');
  
  if (password.length >= 12) analysis.score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) analysis.score += 1;
  else analysis.feedback.push('Include lowercase letters');
  
  if (/[A-Z]/.test(password)) analysis.score += 1;
  else analysis.feedback.push('Include uppercase letters');
  
  if (/\d/.test(password)) analysis.score += 1;
  else analysis.feedback.push('Include numbers');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) analysis.score += 2;
  else analysis.feedback.push('Include special characters');
  
  // Common patterns check
  if (!/(.)\1{2,}/.test(password)) analysis.score += 1;
  else analysis.feedback.push('Avoid repeating characters');
  
  // Determine strength
  if (analysis.score >= 7) analysis.strength = 'strong';
  else if (analysis.score >= 5) analysis.strength = 'medium';
  else analysis.strength = 'weak';
  
  return analysis;
};

// ==================== TIME UTILITIES ====================

/**
 * Get time ago string
 * @param {Date|string} date - Date to compare
 * @returns {string} Time ago string
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

/**
 * Check if date is business day
 * @param {Date} date - Date to check
 * @returns {boolean} Is business day
 */
const isBusinessDay = (date = new Date()) => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday to Friday
};

/**
 * Add business days to date
 * @param {Date} date - Starting date
 * @param {number} days - Number of business days to add
 * @returns {Date} New date
 */
const addBusinessDays = (date, days) => {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      addedDays++;
    }
  }
  
  return result;
};

// ==================== ERROR HANDLING ====================

/**
 * Create standardized error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Error code
 * @param {Object} details - Additional error details
 * @returns {Object} Error response object
 */
const createErrorResponse = (message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) => {
  return {
    success: false,
    message,
    error: {
      code,
      statusCode,
      timestamp: new Date().toISOString(),
      ...(details && { details })
    }
  };
};

/**
 * Create standardized success response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Success response object
 */
const createSuccessResponse = (data = null, message = 'Success') => {
  return {
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString()
  };
};

// ==================== GEOCODING UTILITIES ====================

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - Latitude 1
 * @param {number} lon1 - Longitude 1
 * @param {number} lat2 - Latitude 2
 * @param {number} lon2 - Longitude 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// ==================== EXPORTS ====================

module.exports = {
  // ID Generation
  generateVendorId,
  generateRegistrationId,
  generateServiceId,
  generateBookingReference,
  
  // String Utilities
  generateSlug,
  capitalizeWords,
  generateRandomString,
  truncateText,
  
  // Validation
  isValidEmail,
  isValidIndianPhone,
  isValidPAN,
  isValidGST,
  isValidIFSC,
  isValidPincode,
  
  // Formatting
  formatPhone,
  formatCurrency,
  formatDate,
  formatFileSize,
  
  // Data Sanitization
  sanitizeString,
  sanitizeObject,
  
  // File Utilities
  getFileExtension,
  isAllowedFileType,
  generateUniqueFilename,
  
  // Array Utilities
  removeDuplicates,
  chunkArray,
  shuffleArray,
  
  // Password Utilities
  generateStrongPassword,
  checkPasswordStrength,
  
  // Time Utilities
  getTimeAgo,
  isBusinessDay,
  addBusinessDays,
  
  // Error Handling
  createErrorResponse,
  createSuccessResponse,
  
  // Geocoding
  calculateDistance
};