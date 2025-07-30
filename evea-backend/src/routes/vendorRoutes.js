const express = require('express');
const router = express.Router();
const multer = require('multer');
const { vendorAuth, adminAuth } = require('../middleware/auth');
const {
  registerVendorStep1,
  uploadDocuments,
  registerVendorStep3,
  loginVendor,
  getVendorProfile,
  updateVendorProfile,
  getVendorServices,
  createVendorService,
  updateVendorService,
  deleteVendorService,
  getDashboardStats,
  getRegistrationStatus,
  resendVerificationEmail
} = require('../controllers/vendorController');

const {
  getAllVendorApplications,
  getVendorApplicationById,
  approveVendorApplication,
  rejectVendorApplication,
  updateDocumentVerification
} = require('../controllers/adminController');

// Configure multer for file uploads (temporary storage before Drive)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only specific file types
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
});

// ==================== VENDOR REGISTRATION ROUTES ====================

// Step 1: Basic business information
router.post('/register/step1', registerVendorStep1);

// Step 2: Document uploads
router.post('/register/step2/:vendorId', 
  upload.fields([
    { name: 'businessRegistration', maxCount: 1 },
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 }
  ]),
  uploadDocuments
);

// Step 3: Services and packages
router.post('/register/step3/:vendorId', registerVendorStep3);

// Check registration status
router.get('/register/status/:vendorId', getRegistrationStatus);

// Resend verification email
router.post('/register/resend-verification/:vendorId', resendVerificationEmail);

// ==================== VENDOR AUTHENTICATION ROUTES ====================

// Vendor login
router.post('/login', loginVendor);

// Vendor logout
router.post('/logout', vendorAuth, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==================== VENDOR DASHBOARD ROUTES ====================

// Get vendor profile
router.get('/profile', vendorAuth, getVendorProfile);

// Update vendor profile
router.put('/profile', vendorAuth, updateVendorProfile);

// Get dashboard statistics
router.get('/dashboard/stats', vendorAuth, getDashboardStats);

// ==================== VENDOR SERVICES ROUTES ====================

// Get all services for a vendor
router.get('/services', vendorAuth, getVendorServices);

// Create new service
router.post('/services', 
  vendorAuth, 
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
    { name: 'portfolio', maxCount: 15 }
  ]),
  createVendorService
);

// Update existing service
router.put('/services/:serviceId', 
  vendorAuth,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
    { name: 'portfolio', maxCount: 15 }
  ]),
  updateVendorService
);

// Delete service
router.delete('/services/:serviceId', vendorAuth, deleteVendorService);

// ==================== ADMIN ROUTES ====================

// Get all vendor applications
router.get('/admin/applications', adminAuth, getAllVendorApplications);

// Get specific vendor application
router.get('/admin/applications/:vendorId', adminAuth, getVendorApplicationById);

// Approve vendor application
router.post('/admin/applications/:vendorId/approve', adminAuth, approveVendorApplication);

// Reject vendor application
router.post('/admin/applications/:vendorId/reject', adminAuth, rejectVendorApplication);

// Update document verification status
router.put('/admin/applications/:vendorId/documents/:documentType', adminAuth, updateDocumentVerification);

// ==================== PUBLIC ROUTES ====================

// Get vendor services for marketplace (public)
router.get('/marketplace/services', require('../controllers/marketplaceController').getMarketplaceServices);

// Get vendor details for marketplace (public)
router.get('/marketplace/vendor/:vendorId', require('../controllers/marketplaceController').getVendorDetails);

// Search vendors (public)
router.get('/marketplace/search', require('../controllers/marketplaceController').searchVendors);

module.exports = router;