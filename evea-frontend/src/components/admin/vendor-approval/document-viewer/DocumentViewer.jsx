// src/components/admin/vendor-approval/document-viewer/DocumentViewer.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, Download, ZoomIn, ZoomOut, RotateCw, 
  ChevronLeft, ChevronRight, FileText, Image,
  Check, AlertTriangle, Eye, Maximize2
} from 'lucide-react';
import './DocumentViewer.css';

const DocumentViewer = ({ 
  isOpen, 
  onClose, 
  documents, 
  currentDocumentIndex = 0,
  onVerify,
  vendorName 
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentDocumentIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(currentDocumentIndex);
      setZoom(1);
      setRotation(0);
    }
  }, [isOpen, currentDocumentIndex]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex]);

  if (!isOpen || !documents || documents.length === 0) {
    return null;
  }

  const currentDocument = documents[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : documents.length - 1));
    setZoom(1);
    setRotation(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < documents.length - 1 ? prev + 1 : 0));
    setZoom(1);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = currentDocument.url;
    link.download = currentDocument.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerify = (verified) => {
    if (onVerify) {
      onVerify(currentDocument.id, verified);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getDocumentIcon = (type) => {
    const fileType = type.toLowerCase();
    if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
      return <Image size={20} />;
    }
    return <FileText size={20} />;
  };

  const isImageDocument = (type) => {
    const fileType = type.toLowerCase();
    return fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg');
  };

  return (
    <div className={`document-viewer-overlay ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="document-viewer">
        {/* Header */}
        <div className="viewer-header">
          <div className="document-info">
            <div className="document-icon">
              {getDocumentIcon(currentDocument.type)}
            </div>
            <div className="document-details">
              <h3>{currentDocument.name}</h3>
              <p>{vendorName} • {currentDocument.type} • {currentDocument.size}</p>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="document-navigation">
              <button 
                className="nav-btn"
                onClick={handlePrevious}
                disabled={documents.length <= 1}
                title="Previous Document"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="nav-indicator">
                {currentIndex + 1} of {documents.length}
              </span>
              <button 
                className="nav-btn"
                onClick={handleNext}
                disabled={documents.length <= 1}
                title="Next Document"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className="viewer-controls">
              <button 
                className="control-btn"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="zoom-indicator">{Math.round(zoom * 100)}%</span>
              <button 
                className="control-btn"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button 
                className="control-btn"
                onClick={handleRotate}
                title="Rotate"
              >
                <RotateCw size={18} />
              </button>
              <button 
                className="control-btn"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                className="control-btn"
                onClick={handleDownload}
                title="Download"
              >
                <Download size={18} />
              </button>
            </div>
            
            <button className="close-btn" onClick={onClose} title="Close">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="viewer-content">
          <div className="document-container">
            {isImageDocument(currentDocument.type) ? (
              <img
                src={currentDocument.url}
                alt={currentDocument.name}
                className="document-image"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : (
              <iframe
                src={currentDocument.url}
                className="document-iframe"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease'
                }}
                title={currentDocument.name}
              />
            )}
            
            {/* Fallback for failed loads */}
            <div className="document-fallback" style={{ display: 'none' }}>
              <div className="fallback-content">
                <FileText size={48} />
                <h3>Preview not available</h3>
                <p>This document type cannot be previewed in the browser.</p>
                <button className="download-fallback-btn" onClick={handleDownload}>
                  <Download size={16} />
                  Download to view
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="viewer-footer">
          <div className="document-status">
            <div className={`status-indicator ${currentDocument.verified ? 'verified' : 'unverified'}`}>
              {currentDocument.verified ? (
                <>
                  <Check size={16} />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} />
                  <span>Pending Verification</span>
                </>
              )}
            </div>
            
            {currentDocument.verifiedBy && (
              <span className="verified-by">
                Verified by {currentDocument.verifiedBy} on {currentDocument.verifiedDate}
              </span>
            )}
          </div>
          
          <div className="verification-actions">
            {!currentDocument.verified && (
              <>
                <button 
                  className="verify-btn reject"
                  onClick={() => handleVerify(false)}
                >
                  <X size={16} />
                  Reject
                </button>
                <button 
                  className="verify-btn approve"
                  onClick={() => handleVerify(true)}
                >
                  <Check size={16} />
                  Verify Document
                </button>
              </>
            )}
            
            {currentDocument.verified && (
              <button 
                className="verify-btn unverify"
                onClick={() => handleVerify(false)}
              >
                <AlertTriangle size={16} />
                Mark Unverified
              </button>
            )}
          </div>
        </div>

        {/* Document Thumbnails */}
        {documents.length > 1 && (
          <div className="document-thumbnails">
            {documents.map((doc, index) => (
              <button
                key={doc.id}
                className={`thumbnail ${index === currentIndex ? 'active' : ''} ${doc.verified ? 'verified' : ''}`}
                onClick={() => setCurrentIndex(index)}
                title={doc.name}
              >
                <div className="thumbnail-icon">
                  {getDocumentIcon(doc.type)}
                </div>
                <span className="thumbnail-name">{doc.name.substring(0, 20)}...</span>
                {doc.verified && (
                  <div className="verified-badge">
                    <Check size={12} />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;