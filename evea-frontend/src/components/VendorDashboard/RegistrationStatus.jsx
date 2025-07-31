import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle, FileText, Eye, Download } from 'lucide-react';

const RegistrationStatus = ({ vendor }) => {
  if (!vendor) return <div>Loading...</div>;

  const getStatusInfo = () => {
    const statusConfig = {
      'pending_documents': {
        title: 'Documents Required',
        description: 'Please upload all required documents to proceed',
        color: 'warning',
        icon: <AlertTriangle size={32} />,
        action: 'Upload Documents'
      },
      'pending_review': {
        title: 'Under Review',
        description: 'Your application is being reviewed by our team',
        color: 'info',
        icon: <Clock size={32} />,
        action: 'Track Progress'
      },
      'approved': {
        title: 'Approved',
        description: 'Your vendor account has been approved and is active',
        color: 'success',
        icon: <CheckCircle size={32} />,
        action: 'View Dashboard'
      },
      'rejected': {
        title: 'Action Required',
        description: 'Your application needs some updates before approval',
        color: 'error',
        icon: <XCircle size={32} />,
        action: 'Update Application'
      }
    };

    return statusConfig[vendor.registrationStatus] || statusConfig['pending_documents'];
  };

  const statusInfo = getStatusInfo();
  const documents = vendor.verification?.documents || {};

  const documentsList = [
    { key: 'businessRegistration', name: 'Business Registration', required: true },
    { key: 'gstCertificate', name: 'GST Certificate', required: false },
    { key: 'panCard', name: 'PAN Card', required: true },
    { key: 'bankStatement', name: 'Bank Statement', required: true },
    { key: 'identityProof', name: 'Identity Proof', required: true }
  ];

  return (
    <div className="registration-status">
      <div className="status-header">
        <div className={`status-icon ${statusInfo.color}`}>
          {statusInfo.icon}
        </div>
        <div className="status-content">
          <h2>{statusInfo.title}</h2>
          <p>{statusInfo.description}</p>
        </div>
      </div>

      {/* Registration Progress */}
      <div className="registration-progress">
        <h3>Registration Progress</h3>
        <div className="progress-steps">
          <div className={`progress-step ${vendor.profileCompletion >= 25 ? 'completed' : 'pending'}`}>
            <div className="step-circle">
              {vendor.profileCompletion >= 25 ? <CheckCircle size={16} /> : '1'}
            </div>
            <span>Basic Information</span>
          </div>
          
          <div className={`progress-step ${vendor.profileCompletion >= 75 ? 'completed' : 'pending'}`}>
            <div className="step-circle">
              {vendor.profileCompletion >= 75 ? <CheckCircle size={16} /> : '2'}
            </div>
            <span>Documents Verification</span>
          </div>
          
          <div className={`progress-step ${vendor.profileCompletion >= 100 ? 'completed' : 'pending'}`}>
            <div className="step-circle">
              {vendor.profileCompletion >= 100 ? <CheckCircle size={16} /> : '3'}
            </div>
            <span>Services Setup</span>
          </div>
        </div>
      </div>

      {/* Documents Status */}
      <div className="documents-status">
        <h3>Document Verification Status</h3>
        <div className="documents-list">
          {documentsList.map((doc) => {
            const documentData = documents[doc.key];
            const hasDocument = !!documentData?.driveFileId;
            const isVerified = documentData?.verified || false;
            
            return (
              <div key={doc.key} className="document-item">
                <div className="document-info">
                  <FileText size={20} />
                  <div className="document-details">
                    <span className="document-name">
                      {doc.name}
                      {doc.required && <span className="required">*</span>}
                    </span>
                    {documentData?.fileName && (
                      <small className="file-name">{documentData.fileName}</small>
                    )}
                  </div>
                </div>
                
                <div className="document-status">
                  {!hasDocument ? (
                    <div className="status-badge missing">
                      <XCircle size={16} />
                      Not Uploaded
                    </div>
                  ) : !isVerified ? (
                    <div className="status-badge pending">
                      <Clock size={16} />
                      Under Review
                    </div>
                  ) : (
                    <div className="status-badge verified">
                      <CheckCircle size={16} />
                      Verified
                    </div>
                  )}
                  
                  {hasDocument && (
                    <div className="document-actions">
                      <button className="action-btn" title="View Document">
                        <Eye size={14} />
                      </button>
                      <button className="action-btn" title="Download">
                        <Download size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Notes */}
      {vendor.adminNotes && vendor.adminNotes.length > 0 && (
        <div className="admin-notes">
          <h3>Admin Notes</h3>
          <div className="notes-list">
            {vendor.adminNotes.map((note, index) => (
              <div key={index} className="note-item">
                <div className="note-content">
                  <p>{note.note}</p>
                  <small>
                    By {note.addedBy} on {new Date(note.addedAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="status-actions">
        {vendor.registrationStatus === 'pending_documents' && (
          <button className="btn btn-primary">
            Complete Registration
          </button>
        )}
        
        {vendor.registrationStatus === 'rejected' && (
          <button className="btn btn-warning">
            Update Application
          </button>
        )}
        
        {vendor.registrationStatus === 'approved' && (
          <button className="btn btn-success">
            Manage Services
          </button>
        )}
      </div>
    </div>
  );
};

export default RegistrationStatus;