// VendorRegistrationStep2.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useParams } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Eye,
  Download
} from 'lucide-react';
import './VendorRegistrationStep2.css';

const VendorRegistrationStep2 = ({ vendorId: propVendorId, onNext, onBack }) => {
  const { registerStep2 } = useAuth();
  const location = useLocation();
  const { vendorId: paramVendorId } = useParams();
  
  const [files, setFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // FIXED: Enhanced vendor ID resolution with better fallback chain
  const getVendorId = () => {
    // Priority order: URL params > component props > location state > localStorage > sessionStorage
    const sources = {
      urlParam: paramVendorId,
      componentProp: propVendorId,
      locationState: location.state?.vendorId,
      localStorage: localStorage.getItem('registrationVendorId'),
      sessionStorage: sessionStorage.getItem('registrationVendorId'),
      // Check for vendor data object in localStorage
      vendorDataId: (() => {
        try {
          const vendorData = JSON.parse(localStorage.getItem('vendorRegistrationData') || '{}');
          return vendorData.vendorId || vendorData._id;
        } catch (e) {
          return null;
        }
      })()
    };
    
    console.log('🔍 Vendor ID Resolution Sources:', sources);
    
    // Return first valid ID found
    const finalId = sources.urlParam || 
                   sources.componentProp || 
                   sources.locationState || 
                   sources.localStorage || 
                   sources.sessionStorage ||
                   sources.vendorDataId;
    
    console.log('✅ Final vendor ID selected:', finalId);
    return finalId;
  };
  
  const finalVendorId = getVendorId();

  // Enhanced error handling and ID persistence
  useEffect(() => {
    if (!finalVendorId) {
      console.error('❌ CRITICAL: No vendor ID found anywhere!');
      
      // Try to extract from current URL if it's in the path
      const pathParts = window.location.pathname.split('/');
      const possibleId = pathParts[pathParts.length - 1];
      
      if (possibleId && possibleId.length === 24) { // MongoDB ObjectId length
        console.log('🔄 Found potential vendor ID in URL path:', possibleId);
        localStorage.setItem('registrationVendorId', possibleId);
        window.location.reload(); // Reload to pick up the ID
        return;
      }
      
      setErrors({ 
        submit: 'Registration session lost. Please restart from Step 1.' 
      });
    } else {
      // Ensure the ID is stored in localStorage for future steps
      localStorage.setItem('registrationVendorId', finalVendorId);
      console.log('💾 Vendor ID saved to localStorage:', finalVendorId);
    }
  }, [finalVendorId]);

  // Document requirements configuration - matches your backend expectations
  const documentRequirements = {
    businessRegistration: {
      title: 'Business Registration Certificate',
      description: 'Shop Act License, MSME Certificate, or Company Registration',
      required: true,
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 5 // MB
    },
    gstCertificate: {
      title: 'GST Certificate',
      description: 'GST Registration Certificate (if applicable)',
      required: false,
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 5
    },
    panCard: {
      title: 'PAN Card',
      description: 'PAN Card of the business owner',
      required: true,
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 2
    },
    bankStatement: {
      title: 'Bank Statement',
      description: 'Recent bank statement (last 3 months)',
      required: true,
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 10
    },
    identityProof: {
      title: 'Identity Proof',
      description: 'Aadhaar Card, Driving License, or Passport',
      required: true,
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 5
    }
  };

  const handleFileUpload = (docType, file) => {
    console.log(`📎 File upload started: ${docType} - ${file.name}`);
    
    const requirement = documentRequirements[docType];
    
    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!requirement.allowedTypes.includes(fileExtension)) {
      setErrors(prev => ({
        ...prev,
        [docType]: `Only ${requirement.allowedTypes.join(', ').toUpperCase()} files are allowed`
      }));
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > requirement.maxSize) {
      setErrors(prev => ({
        ...prev,
        [docType]: `File size must be less than ${requirement.maxSize}MB`
      }));
      return;
    }

    // Clear any existing error
    setErrors(prev => ({ ...prev, [docType]: '' }));

    // Update files state
    setFiles(prev => ({
      ...prev,
      [docType]: file
    }));

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [docType]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = (prev[docType] || 0) + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, [docType]: 100 };
        }
        return { ...prev, [docType]: newProgress };
      });
    }, 100);

    console.log(`✅ File prepared for upload: ${docType}`);
  };

  const handleFileRemove = (docType) => {
    console.log(`🗑️ Removing file: ${docType}`);
    
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docType];
      return newFiles;
    });
    
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[docType];
      return newProgress;
    });
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[docType];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    // FIXED: Always check vendor ID first
    if (!finalVendorId) {
      newErrors.submit = 'Vendor ID is missing. Please restart registration.';
      hasErrors = true;
    }

    // Check required documents
    Object.entries(documentRequirements).forEach(([docType, requirement]) => {
      if (requirement.required && !files[docType]) {
        newErrors[docType] = `${requirement.title} is required`;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📄 Starting document upload process');
    console.log('📁 Files to upload:', Object.keys(files));
    console.log('👥 Using vendor ID:', finalVendorId);
    
    // FIXED: Better validation and error handling
    if (!validateForm()) {
      console.error('❌ Form validation failed');
      return;
    }

    if (!finalVendorId) {
      setErrors({ 
        submit: 'Vendor ID is missing. Please restart registration from Step 1.' 
      });
      return;
    }

    if (Object.keys(files).length === 0) {
      setErrors({ 
        submit: 'Please upload at least one document before continuing.' 
      });
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      console.log('🚀 Submitting documents to backend...');
      
      const result = await registerStep2(finalVendorId, files);
      
      console.log('📡 Upload result:', result);
      
      if (result.success) {
        setSuccessMessage('Documents uploaded successfully!');
        
        // Store progress
        localStorage.setItem('registrationStep', '2');
        
        setTimeout(() => {
          console.log('✅ Moving to Step 3...');
          if (onNext) {
            onNext(finalVendorId);
          }
        }, 1500);
        
      } else {
        throw new Error(result.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      setErrors({ 
        submit: error.message || 'Upload failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getUploadedCount = () => {
    return Object.keys(files).length;
  };

  const getRequiredCount = () => {
    return Object.values(documentRequirements).filter(req => req.required).length;
  };

  // File Upload Area Component
  const FileUploadArea = ({ docType, requirement }) => {
    const hasFile = files[docType];
    const hasError = errors[docType];
    const progress = uploadProgress[docType];

    return (
      <div className={`file-upload-area ${hasError ? 'error' : ''}`}>
        <div className="upload-header">
          <h4>{requirement.title}</h4>
          <span className={`requirement-badge ${requirement.required ? 'required' : 'optional'}`}>
            {requirement.required ? 'Required' : 'Optional'}
          </span>
        </div>
        
        <p className="upload-description">{requirement.description}</p>
        
        {!hasFile ? (
          <label className="upload-label">
            <input
              type="file"
              accept={requirement.allowedTypes.map(type => 
                type === 'pdf' ? '.pdf' : `.${type}`
              ).join(',')}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFileUpload(docType, file);
              }}
              className="file-input"
            />
            <div className="upload-content">
              <Upload size={32} />
              <span>Click to upload or drag and drop</span>
              <small>
                Max {requirement.maxSize}MB • {requirement.allowedTypes.join(', ').toUpperCase()}
              </small>
            </div>
          </label>
        ) : (
          <div className="uploaded-file">
            <div className="file-info">
              <FileText size={24} />
              <div className="file-details">
                <span className="file-name">{files[docType].name}</span>
                <span className="file-size">
                  {(files[docType].size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            </div>
            
            {progress < 100 ? (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span>{progress}%</span>
              </div>
            ) : (
              <div className="file-actions">
                <CheckCircle size={20} className="success-icon" />
                <button
                  type="button"
                  onClick={() => handleFileRemove(docType)}
                  className="remove-btn"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}
        
        {hasError && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{hasError}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="vendor-registration-step2">
      <div className="registration-container">
        {/* FIXED: Enhanced debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            background: finalVendorId ? '#e6fffa' : '#fef2f2', 
            padding: '15px', 
            margin: '10px 0', 
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'monospace',
            border: `2px solid ${finalVendorId ? '#38b2ac' : '#f56565'}`
          }}>
            <strong>🔧 Debug Panel:</strong><br/>
            URL Param ID: {paramVendorId || 'undefined'}<br/>
            Component Prop ID: {propVendorId || 'undefined'}<br/>
            Location State ID: {location.state?.vendorId || 'undefined'}<br/>
            localStorage ID: {localStorage.getItem('registrationVendorId') || 'undefined'}<br/>
            sessionStorage ID: {sessionStorage.getItem('registrationVendorId') || 'undefined'}<br/>
            <strong>Final Selected ID: {finalVendorId || '❌ MISSING'}</strong><br/>
            Current URL: {window.location.pathname}
          </div>
        )}

        <div className="registration-header">
          <h1>Document Upload</h1>
          <p>Step 2 of 3: Upload Required Documents</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '66%' }}></div>
          </div>
          <div className="upload-summary">
            <span>
              {getUploadedCount()} of {Object.keys(documentRequirements).length} documents uploaded
              ({getRequiredCount()} required)
            </span>
          </div>
        </div>

        {successMessage && (
          <div className="success-banner">
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-section">
            <div className="section-header">
              <h3>Required Documents</h3>
              <p>Please upload the following documents to verify your business</p>
            </div>

            <div className="documents-grid">
              {Object.entries(documentRequirements).map(([docType, requirement]) => (
                <FileUploadArea 
                  key={docType} 
                  docType={docType} 
                  requirement={requirement} 
                />
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="form-section">
            <div className="info-box">
              <h4>📋 Important Notes:</h4>
              <ul>
                <li>All documents should be clear and readable</li>
                <li>File formats accepted: PDF, JPG, JPEG, PNG</li>
                <li>Maximum file size varies by document type</li>
                <li>Documents will be verified by our team</li>
                <li>You will be notified once verification is complete</li>
              </ul>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button 
              type="button" 
              className="back-btn"
              onClick={onBack}
              disabled={loading}
            >
              <ArrowLeft size={20} />
              <span>Back to Business Info</span>
            </button>

            <button 
              type="submit" 
              className="next-step-btn"
              disabled={loading || !finalVendorId}
            >
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  <span>Uploading Documents...</span>
                </div>
              ) : (
                <div className="button-content">
                  <span>Continue to Services</span>
                  <ArrowRight size={20} />
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="help-section">
          <h4>Need Help?</h4>
          <p>
            If you're having trouble uploading documents or have questions about 
            the required documents, please contact our support team at{' '}
            <a href="mailto:support@evea.com">support@evea.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationStep2;