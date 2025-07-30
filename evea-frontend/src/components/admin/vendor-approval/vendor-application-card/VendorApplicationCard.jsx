import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Calendar, Clock, CheckCircle, 
  AlertTriangle, Eye, FileText, Download, XCircle 
} from 'lucide-react';
import './VendorApplicationCard.css';

const VendorApplicationCard = ({ vendor, onApprove, onReject, onViewDetails }) => {
  const [documentStates, setDocumentStates] = useState(vendor.documents);

  const handleDocumentVerification = (docType, verified) => {
    setDocumentStates(prev => ({
      ...prev,
      [docType]: { ...prev[docType], verified }
    }));
  };

  const allDocsVerified = Object.values(documentStates).every(doc => doc.verified);
  const verifiedDocsCount = Object.values(documentStates).filter(doc => doc.verified).length;
  const totalDocsCount = Object.keys(documentStates).length;

  return (
    <div className="vendor-application-card">
      <div className="application-header">
        <div className="vendor-basic-info">
          <div className="vendor-avatar">
            {vendor.ownerName.charAt(0)}
          </div>
          <div className="vendor-details">
            <h3>{vendor.businessName}</h3>
            <p className="owner-name">{vendor.ownerName}</p>
            <div className="vendor-meta">
              <span className="category">{vendor.subcategory}</span>
              <span className="location">
                <MapPin size={14} />
                {vendor.location.split(',')[0]}
              </span>
            </div>
          </div>
        </div>
        
        <div className="application-status">
          <span className={`status-badge ${vendor.status}`}>
            {vendor.status === 'pending_review' && <Clock size={16} />}
            {vendor.status === 'approved' && <CheckCircle size={16} />}
            {vendor.status === 'rejected' && <XCircle size={16} />}
            {vendor.status.replace('_', ' ').toUpperCase()}
          </span>
          <div className="application-id">#{vendor.id}</div>
        </div>
      </div>

      <div className="application-content">
        <div className="contact-info">
          <div className="contact-item">
            <Mail size={16} />
            <span>{vendor.email}</span>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <span>{vendor.phone}</span>
          </div>
          <div className="contact-item">
            <Calendar size={16} />
            <span>Applied: {new Date(vendor.submittedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="business-details">
          <div className="detail-row">
            <span className="label">GST Number:</span>
            <span className="value">{vendor.gstNumber}</span>
          </div>
          <div className="detail-row">
            <span className="label">PAN Number:</span>
            <span className="value">{vendor.panNumber}</span>
          </div>
          <div className="detail-row">
            <span className="label">Registration:</span>
            <span className="value">{vendor.registrationNumber}</span>
          </div>
        </div>

        <div className="documents-verification">
          <div className="section-header">
            <h4>Document Verification</h4>
            <span className="verification-progress">
              {verifiedDocsCount}/{totalDocsCount} verified
            </span>
          </div>
          
          <div className="documents-grid">
            {Object.entries(documentStates).map(([docType, doc]) => (
              <div key={docType} className="document-item">
                <div className="doc-info">
                  <FileText size={16} />
                  <span>{docType.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                </div>
                <div className="doc-actions">
                  <button 
                    className="view-doc-btn"
                    onClick={() => console.log('View document:', docType)}
                    title="View Document"
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    className="download-doc-btn"
                    onClick={() => console.log('Download document:', docType)}
                    title="Download Document"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    className={`verify-btn ${doc.verified ? 'verified' : 'unverified'}`}
                    onClick={() => handleDocumentVerification(docType, !doc.verified)}
                    title={doc.verified ? 'Mark as Unverified' : 'Mark as Verified'}
                  >
                    {doc.verified ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="verification-status">
            {allDocsVerified ? (
              <div className="all-verified">
                <CheckCircle size={16} />
                <span>All documents verified</span>
              </div>
            ) : (
              <div className="pending-verification">
                <AlertTriangle size={16} />
                <span>{totalDocsCount - verifiedDocsCount} documents pending verification</span>
              </div>
            )}
          </div>
        </div>

        <div className="bank-details">
          <h4>Bank Details</h4>
          <div className="bank-info">
            <div className="bank-item">
              <span className="bank-label">Account Holder:</span>
              <span className="bank-value">{vendor.bankDetails.accountHolderName}</span>
            </div>
            <div className="bank-item">
              <span className="bank-label">Account Number:</span>
              <span className="bank-value">****{vendor.bankDetails.accountNumber.slice(-4)}</span>
            </div>
            <div className="bank-item">
              <span className="bank-label">IFSC Code:</span>
              <span className="bank-value">{vendor.bankDetails.ifscCode}</span>
            </div>
            <div className="bank-item">
              <span className="bank-label">Bank Name:</span>
              <span className="bank-value">{vendor.bankDetails.bankName}</span>
            </div>
          </div>
        </div>
      </div>

      {vendor.status === 'pending_review' && (
        <div className="application-actions">
          <button 
            className="view-details-btn"
            onClick={() => onViewDetails(vendor)}
          >
            <Eye size={16} />
            View Full Details
          </button>
          <button 
            className="reject-btn"
            onClick={() => onReject(vendor)}
            disabled={!allDocsVerified}
            title={!allDocsVerified ? 'Verify all documents before rejecting' : 'Reject Application'}
          >
            <XCircle size={16} />
            Reject
          </button>
          <button 
            className="approve-btn"
            onClick={() => onApprove(vendor)}
            disabled={!allDocsVerified}
            title={!allDocsVerified ? 'Verify all documents before approving' : 'Approve Application'}
          >
            <CheckCircle size={16} />
            Approve
          </button>
        </div>
      )}

      {vendor.status === 'approved' && (
        <div className="status-info approved">
          <CheckCircle size={16} />
          <span>Application approved and vendor credentials sent</span>
        </div>
      )}

      {vendor.status === 'rejected' && (
        <div className="status-info rejected">
          <XCircle size={16} />
          <span>Application rejected with feedback sent to vendor</span>
        </div>
      )}
    </div>
  );
};

export default VendorApplicationCard;