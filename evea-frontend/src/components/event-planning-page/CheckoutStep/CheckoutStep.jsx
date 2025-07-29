import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Lock, Shield } from 'lucide-react';

const CheckoutStep = ({ nextStep, prevStep, eventData }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const totalAmount = eventData.selectedVendors?.reduce((sum, vendor) => sum + (vendor.price || 0), 0) || 0;

  return (
    <div className="checkout-step" style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }}>
            Secure <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Checkout</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
            Complete your booking with secure payment
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', marginBottom: '40px' }}>
          {/* Payment Form */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} />
              Payment Information
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Payment Method</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  Credit/Debit Card
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  UPI
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>CVV</label>
                    <input type="text" placeholder="123" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Cardholder Name</label>
                  <input type="text" placeholder="John Doe" style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
              <Shield size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '14px', color: '#065f46' }}>Your payment is secured with 256-bit SSL encryption</span>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <h2 style={{ marginBottom: '24px' }}>Order Summary</h2>
            
            <div style={{ marginBottom: '16px' }}>
              {eventData.selectedVendors?.map((vendor, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span>{vendor.name}</span>
                  <span>₹{vendor.price?.toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>Platform Fee</span>
                <span>₹{Math.round(totalAmount * 0.05).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                <span>Total</span>
                <span>₹{(totalAmount + Math.round(totalAmount * 0.05)).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer' }}>
            <ArrowLeft size={16} />
            Back
          </button>
          
          <button onClick={nextStep} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}>
            <Lock size={16} />
            Complete Payment ₹{(totalAmount + Math.round(totalAmount * 0.05)).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStep;