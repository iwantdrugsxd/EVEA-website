const vendorReviewSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VendorService'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  rating: {
    overall: { type: Number, min: 1, max: 5, required: true },
    quality: { type: Number, min: 1, max: 5 },
    timeliness: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },
  
  review: {
    title: String,
    content: String,
    pros: [String],
    cons: [String]
  },
  
  images: [String], // Drive file IDs
  
  isVerified: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  
  vendorResponse: {
    content: String,
    respondedAt: Date
  }
}, {
  timestamps: true
});

vendorReviewSchema.index({ vendorId: 1, rating: -1 });

module.exports = mongoose.model('VendorReview', vendorReviewSchema);