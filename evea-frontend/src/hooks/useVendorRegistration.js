import { useState, useCallback } from 'react';
import { registerVendorStep1, uploadVendorDocuments, registerVendorStep3 } from '../services/vendorAPI';

export const useVendorRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendorId, setVendorId] = useState(null);
  const [tempToken, setTempToken] = useState(null);

  const handleStep1 = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await registerVendorStep1(formData);
      setVendorId(response.data.vendorId);
      setTempToken(response.data.tempToken);
      
      // Store temporary data for registration process
      localStorage.setItem('registrationVendorId', response.data.vendorId);
      localStorage.setItem('registrationTempToken', response.data.tempToken);
      
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
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
        throw new Error('Vendor ID not found. Please start registration from step 1.');
      }

      // Create FormData object for file uploads
      const formData = new FormData();
      
      // Add text fields
      Object.keys(documentsData).forEach(key => {
        if (key !== 'files' && documentsData[key]) {
          if (typeof documentsData[key] === 'object') {
            formData.append(key, JSON.stringify(documentsData[key]));
          } else {
            formData.append(key, documentsData[key]);
          }
        }
      });

      // Add files
      if (documentsData.files) {
        Object.keys(documentsData.files).forEach(fileType => {
          const files = documentsData.files[fileType];
          if (files) {
            Array.from(files).forEach(file => {
              formData.append(fileType, file);
            });
          }
        });
      }

      const response = await uploadVendorDocuments(currentVendorId, formData);
      return response;
    } catch (err) {
      setError(err.message || 'Document upload failed');
      throw err;
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
        throw new Error('Vendor ID not found. Please start registration from step 1.');
      }

      const response = await registerVendorStep3(currentVendorId, { services: servicesData });
      
      // Clear temporary registration data
      localStorage.removeItem('registrationVendorId');
      localStorage.removeItem('registrationTempToken');
      
      return response;
    } catch (err) {
      setError(err.message || 'Service registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    vendorId,
    handleStep1,
    handleStep2,
    handleStep3,
    clearError
  };
};