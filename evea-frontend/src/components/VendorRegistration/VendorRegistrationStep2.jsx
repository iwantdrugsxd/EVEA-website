import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, Trash2, Eye } from 'lucide-react';

const VendorRegistrationStep2 = ({ onNext, onPrevious, isLoading }) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    gstNumber: '',
    panNumber: '',
    bankDetails: {
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: ''
    },
    files: {
      businessRegistration: null,
      gstCertificate: null,
      panCard: null,
      bankStatement: null,
      identityProof: null
    }
  });

  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  const documentRequirements = {
    businessRegistration: {
      title: 'Business Registration Certificate',
      required: true,
      description: 'Shop Act License, Trade License, or Business Registration Certificate',
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 5 // MB
    },
    gstCertificate: {
      title: 'GST Certificate',
      required: false,
      description: 'GST Registration Certificate (if applicable)',
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 5
    },
    panCard: {
      title: 'PAN Card',
      required: true,
      description: 'Personal/Company PAN Card copy',
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 2
    },
    bankStatement: {
      title: 'Bank Statement',
      required: true,
      description: 'Recent bank statement (last 3 months)',
      allowedTypes: ['pdf'],
      maxSize: 10
    },
    identityProof: {
      title: 'Identity Proof',
      required: true,
      description: 'Aadhaar Card, Driving License, or Passport',
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 5
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate PAN number
    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'Invalid PAN number format';
    }

    // Validate bank details
    if (!formData.bankDetails.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }
    
    if (!formData.bankDetails.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }
    
    if (!formData.bankDetails.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankDetails.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code format';
    }

    // Validate required documents
    Object.keys(documentRequirements).forEach(docType => {
      const requirement = documentRequirements[docType];
      if (requirement.required && !formData.files[docType]) {
        newErrors[docType] = `${requirement.title} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    const errorKey = field.split('.').pop();
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleFileUpload = (docType, file) => {
    const requirement = documentRequirements[docType];
    
    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!requirement.allowedTypes.includes(fileExtension)) {
      setErrors(prev => ({
        ...prev,
        [docType]: `Only ${requirement.allowedTypes.join(', ')} files are allowed`
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

    // Update form data
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [docType]: file
      }
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
  };

  const handleFileRemove = (docType) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [docType]: null
      }
    }));
    setUploadProgress(prev => ({ ...prev, [docType]: 0 }));
    setErrors(prev => ({ ...prev, [docType]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext(formData);
    }
  };

  const FileUploadArea = ({ docType, requirement }) => {
    const file = formData.files[docType];
    const error = errors[docType];
    const progress = uploadProgress[docType];

    return (
      <div className={`file-upload-area ${error ? 'error' : ''}`}>
        <div className="upload-header">
          <div>
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
          <div className="upload-dropzone">
            <input
              type="file"
              id={`file-${docType}`}
              accept={requirement.allowedTypes.map(type => `.${type}`).join(',')}
              onChange={(e) => e.target.files[0] && handleFileUpload(docType, e.target.files[0])}
              className="file-input"
            />
            <label htmlFor={`file-${docType}`} className="upload-label">
              <Upload size={32} />
              <span className="upload-text">
                Click to upload or drag and drop
              </span>
            </label>
          </div>
        ) : (
          <div className="uploaded-file">
            <div className="file-info">
              <File size={20} />
              <div className="file-details">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
              <div className="file-actions">
                <button
                  type="button"
                  className="action-btn view"
                  onClick={() => {
                    const url = URL.createObjectURL(file);
                    window.open(url, '_blank');
                  }}
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  className="action-btn remove"
                  onClick={() => handleFileRemove(docType)}
                >
                  <Trash2 size={16} />
                </button>
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
              <div className="upload-success">
                <CheckCircle size={16} />
                <span>Upload complete</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="vendor-registration-step">
      <div className="step-header">
        <h2 className="step-title">Verification & Documents</h2>
        <p className="step-description">
          Upload required documents for business verification and compliance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        {/* Business Details */}
        <div className="form-section">
          <h3 className="section-title">Business Registration Details</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Business Registration Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="REG123456789"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="GSTIN (if applicable)"
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
              />
            </div>

            <div className="form-group">
              <label className="form-label">PAN Number *</label>
              <input
                type="text"
                className={`form-input ${errors.panNumber ? 'error' : ''}`}
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
              />
              {errors.panNumber && <span className="error-message">{errors.panNumber}</span>}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="form-section">
          <h3 className="section-title">Bank Account Details</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Account Holder Name *</label>
              <input
                type="text"
                className={`form-input ${errors.accountHolderName ? 'error' : ''}`}
                placeholder="As per bank records"
                value={formData.bankDetails.accountHolderName}
                onChange={(e) => handleInputChange('bankDetails.accountHolderName', e.target.value)}
              />
              {errors.accountHolderName && <span className="error-message">{errors.accountHolderName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Account Number *</label>
              <input
                type="text"
                className={`form-input ${errors.accountNumber ? 'error' : ''}`}
                placeholder="Enter account number"
                value={formData.bankDetails.accountNumber}
                onChange={(e) => handleInputChange('bankDetails.accountNumber', e.target.value)}
              />
              {errors.accountNumber && <span className="error-message">{errors.accountNumber}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">IFSC Code *</label>
              <input
                type="text"
                className={`form-input ${errors.ifscCode ? 'error' : ''}`}
                placeholder="ABCD0123456"
                value={formData.bankDetails.ifscCode}
                onChange={(e) => handleInputChange('bankDetails.ifscCode', e.target.value.toUpperCase())}
              />
              {errors.ifscCode && <span className="error-message">{errors.ifscCode}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Bank Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter bank name"
                value={formData.bankDetails.bankName}
                onChange={(e) => handleInputChange('bankDetails.bankName', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter branch name"
                value={formData.bankDetails.branch}
                onChange={(e) => handleInputChange('bankDetails.branch', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Document Uploads */}
        <div className="form-section">
          <h3 className="section-title">Document Uploads</h3>
          <p className="section-description">
            Please upload clear, legible copies of the required documents
          </p>
          
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

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onPrevious}
          >
            Previous Step
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Uploading Documents...' : 'Continue to Services'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorRegistrationStep2;