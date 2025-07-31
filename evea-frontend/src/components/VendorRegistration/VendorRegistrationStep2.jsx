// evea-frontend/src/components/VendorRegistration/VendorRegistrationStep2.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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

const VendorRegistrationStep2 = ({ vendorId, onNext, onBack }) => {
  const { registerStep2 } = useAuth();
  
  const [files, setFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Document requirements configuration
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
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    if (Object.keys(files).length === 0) {
      setErrors({ submit: 'Please upload at least one document' });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const result = await registerStep2(vendorId, files);
      
      if (result.success) {
        console.log('✅ Documents uploaded successfully');
        setSuccessMessage('Documents uploaded successfully! Moving to final step...');
        
        // Move to next step after showing success message
        setTimeout(() => {
          onNext();
        }, 2000);
      } else {
        console.log('❌ Document upload failed:', result.message);
        setErrors({ submit: result.message || 'Document upload failed' });
      }
    } catch (error) {
      console.error('❌ Document upload error:', error);
      setErrors({ submit: 'Upload failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const FileUploadArea = ({ docType, requirement }) => {
    const file = files[docType];
    const error = errors[docType];
    const progress = uploadProgress[docType];
    const isUploaded = file && progress === 100;

    return (
      <div className={`file-upload-area ${error ? 'error' : ''} ${isUploaded ? 'uploaded' : ''}`}>
        <div className="upload-header">
          <div className="upload-info">
            <h4 className="upload-title">
              {requirement.title}
              {requirement.required && <span className="required">*</span>}
            </h4>
            <p className="upload-description">{requirement.description}</p>
            <p className="upload-requirements">
              Accepted: {requirement.allowedTypes.join(', ').toUpperCase()} | 
              Max size: {requirement.maxSize}MB
            </p>
          </div>
        </div>

        {!file ? (
          <div className="upload-zone">
            <input
              type="file"
              id={`file-${docType}`}
              accept={requirement.allowedTypes.map(type => `.${type}`).join(',')}
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  handleFileUpload(docType, selectedFile);
                }
              }}
              className="file-input"
              disabled={loading}
            />
            <label htmlFor={`file-${docType}`} className="upload-label">
              <Upload size={32} />
              <span className="upload-text">
                <strong>Click to upload</strong> or drag and drop
              </span>
            </label>
          </div>
        ) : (
          <div className="uploaded-file">
            <div className="file-info">
              <FileText size={24} />
              <div className="file-details">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
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
                <span className="progress-text">{progress}%</span>
              </div>
            ) : (
              <div className="file-actions">
                <button
                  type="button"
                  className="action-btn view-btn"
                  onClick={() => {
                    // Preview file functionality
                    const url = URL.createObjectURL(file);
                    window.open(url, '_blank');
                  }}
                  title="Preview file"
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  className="action-btn remove-btn"
                  onClick={() => handleFileRemove(docType)}
                  title="Remove file"
                  disabled={loading}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {isUploaded && (
              <div className="upload-success">
                <CheckCircle size={20} />
                <span>Ready to upload</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="upload-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  const getUploadedCount = () => {
    return Object.keys(files).length;
  };

  const getRequiredCount = () => {
    return Object.values(documentRequirements).filter(req => req.required).length;
  };

  return (
    <div className="vendor-registration-step2">
      <div className="registration-container">
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
              disabled={loading || getUploadedCount() === 0}
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