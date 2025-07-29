import React from 'react';
import { ArrowLeft, ArrowRight, Check, Edit, Calendar, MapPin, Users } from 'lucide-react';

const ReviewStep = ({ nextStep, prevStep, eventData }) => {
  return (
    <div className="review-step" style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }}>
            Review Your <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Event</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
            Review all details before finalizing your booking
          </p>
        </div>

        <div style={{ display: 'grid', gap: '24px', marginBottom: '40px' }}>
          {/* Event Details */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} />
                Event Details
              </h2>
              <button style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>
                <Edit size={16} />
                Edit
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Event Type</h4>
                <p style={{ color: '#6b7280' }}>{eventData.eventType || 'Not specified'}</p>
              </div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Date & Time</h4>
                <p style={{ color: '#6b7280' }}>{eventData.eventDetails?.date || 'Not specified'}</p>
              </div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Location</h4>
                <p style={{ color: '#6b7280' }}>{eventData.eventDetails?.location || 'Not specified'}</p>
              </div>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Guests</h4>
                <p style={{ color: '#6b7280' }}>{eventData.eventDetails?.guests || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Selected Vendors */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '16px' }}>Selected Vendors ({eventData.selectedVendors?.length || 0})</h2>
            {eventData.selectedVendors?.length > 0 ? (
              <div style={{ display: 'grid', gap: '12px' }}>
                {eventData.selectedVendors.map((vendor, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <div>
                      <h4>{vendor.name}</h4>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>{vendor.category}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: '600' }}>{vendor.priceLabel}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                        <Check size={14} />
                        <span style={{ fontSize: '12px' }}>Selected</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#6b7280' }}>No vendors selected</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer' }}>
            <ArrowLeft size={16} />
            Back
          </button>
          
          <button onClick={nextStep} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
            Proceed to Checkout
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;