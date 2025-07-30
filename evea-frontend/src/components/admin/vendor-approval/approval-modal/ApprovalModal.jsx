import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, X } from 'lucide-react';
import './ApprovalModal.css';

const ApprovalModal = ({ vendor, action, onClose, onComplete }) => {
  const [approvalMessage, setApprovalMessage] = useState(
    action === 'approve' 
      ? 'Congratulations! Your vendor application has been approved. You can now start receiving bookings through our platform.'
      : ''
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (action === 'reject' && !approvalMessage.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (action === 'approve') {
      console.log('Sending approval email to:', vendor.email);
      console.log('Email contains: Username and temporary password');
      
      alert(`✅ Vendor approved successfully!\n\nEmail sent to ${vendor.email} with:\n- Username: ${vendor.email}\n- Temporary Password: EVEA@123\n- Login URL: https://vendor.evea.com/login`);
      
    } else if (action === 'reject') {
      alert(`❌ Vendor application rejected.\n\nRejection email sent to ${vendor.email} with reason:\n"${approvalMessage}"`);
    }
    
    setIsProcessing(false);
    onComplete(vendor.id, action);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="approval-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {action === 'approve' ? 'Approve Vendor Application' : 'Reject Vendor Application'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="vendor-summary">
            <div className="vendor-info">
              <div className="vendor-avatar">
                {vendor.ownerName.charAt(0)}
              </div>
              <div className="vendor-details">
                <h3>{vendor.businessName}</h3>
                <p>{vendor.ownerName}</p>
                <p className="vendor-email">{vendor.email}</p>
              </div>
            </div>
          </div>

          <div className="approval-form">
            <div className="form-group">
              <label>
                {action === 'approve' ? 'Approval Message' : 'Rejection Reason *'}
              </label>
              <textarea
                value={approvalMessage}
                onChange={(e) => setApprovalMessage(e.target.value)}
                placeholder={
                  action === 'approve' 
                    ? 'Enter approval message (optional)'
                    : 'Please provide a detailed reason for rejection'
                }
                rows="4"
                required={action === 'reject'}
              />
            </div>

            {action === 'approve' && (
              <div className="credentials-info">
                <h4>Login Credentials to be sent:</h4>
                <div className="credentials-grid">
                  <div className="credential-item">
                    <span className="credential-label">Username:</span>
                    <span className="credential-value">{vendor.email}</span>
                  </div>
                  <div className="credential-item">
                    <span className="credential-label">Temporary Password:</span>
                    <span className="credential-value">EVEA@123</span>
                  </div>
                  <div className="credential-item">
                    <span className="credential-label">Login URL:</span>
                    <span className="credential-value">https://vendor.evea.com/login</span>
                  </div>
                </div>
                <div className="security-note">
                  <p><strong>Security Note:</strong> The vendor will be required to change their password on first login.</p>
                </div>
              </div>
            )}

            {action === 'reject' && (
              <div className="rejection-info">
                <h4>What happens next:</h4>
                <ul>
                  <li>Vendor will receive an email with the rejection reason</li>
                  <li>They can address the issues and reapply</li>
                  <li>Application status will be updated to "Rejected"</li>
                  <li>Documents will be moved to rejected folder</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className={`action-btn ${action}`}
            onClick={handleSubmit}
            disabled={isProcessing || (action === 'reject' && !approvalMessage.trim())}
          >
            {isProcessing ? (
              <>
                <Clock size={16} className="spinning" />
                Processing...
              </>
            ) : (
              <>
                {action === 'approve' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {action === 'approve' ? 'Approve & Send Credentials' : 'Reject Application'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;