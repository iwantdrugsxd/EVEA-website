import { useState, useCallback } from 'react';
import { registerVendorStep1, uploadVendorDocuments, registerVendorStep3, getRegistrationStatus } from '../services/vendorAPI';

export const useVendorRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendorId, setVendorId] = useState(() => {
    return localStorage.getItem('registrationVendorId') || null;
  });
  const [tempToken, setTempToken] = useState(() => {
    return localStorage.getItem('registrationTempToken') || null;
  });

  const handleStep1 = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await registerVendorStep1(formData);
      
      const newVendorId = response.data.vendorId;
      const newTempToken = response.data.tempToken;
      
      setVendorId(newVendorId);
      setTempToken(newTempToken);
      
      // Store for persistence across page reloads
      localStorage.setItem('registrationVendorId', newVendorId);
      localStorage.setItem('registrationTempToken', newTempToken);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStep2 = useCallback(async (documentsData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentVendorId = vendorId || localStorage.getItem('registrationVendorId');
      if (!currentVendorId) {
        throw new Error('Registration session expired. Please start from step 1.');
      }

      // Create FormData object for file uploads
      const formData = new FormData();
      
      // Add text fields
      if (documentsData.registrationNumber) {
        formData.append('registrationNumber', documentsData.registrationNumber);
      }
      if (documentsData.gstNumber) {
        formData.append('gstNumber', documentsData.gstNumber);
      }
      if (documentsData.panNumber) {
        formData.append('panNumber', documentsData.panNumber);
      }
      if (documentsData.bankDetails) {
        formData.append('bankDetails', JSON.stringify(documentsData.bankDetails));
      }

      // Add files
      if (documentsData.files) {
        Object.entries(documentsData.files).forEach(([fileType, file]) => {
          if (file) {
            formData.append(fileType, file);
          }
        });
      }

      const response = await uploadVendorDocuments(currentVendorId, formData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Document upload failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  const handleStep3 = useCallback(async (servicesData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentVendorId = vendorId || localStorage.getItem('registrationVendorId');
      if (!currentVendorId) {
        throw new Error('Registration session expired. Please start from step 1.');
      }

      const response = await registerVendorStep3(currentVendorId, servicesData);
      
      // Clear temporary registration data on successful completion
      localStorage.removeItem('registrationVendorId');
      localStorage.removeItem('registrationTempToken');
      setVendorId(null);
      setTempToken(null);
      
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Service registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  const checkRegistrationStatus = useCallback(async () => {
    if (!vendorId) return null;
    
    try {
      const response = await getRegistrationStatus(vendorId);
      return response.data;
    } catch (err) {
      console.error('Failed to check registration status:', err);
      return null;
    }
  }, [vendorId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetRegistration = useCallback(() => {
    setVendorId(null);
    setTempToken(null);
    setError(null);
    localStorage.removeItem('registrationVendorId');
    localStorage.removeItem('registrationTempToken');
  }, []);

  return {
    isLoading,
    error,
    vendorId,
    tempToken,
    handleStep1,
    handleStep2,
    handleStep3,
    checkRegistrationStatus,
    clearError,
    resetRegistration
  };
};