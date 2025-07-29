import React from 'react';
import { ArrowLeft, ArrowRight, Layout, Palette, Settings } from 'lucide-react';

const EventCanvasStep = ({ nextStep, prevStep, eventData }) => {
  return (
    <div className="event-canvas-step" style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }}>
            Design Your <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Event Canvas</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
            Visualize and customize your event layout
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <Layout size={24} />
            <h2>Event Layout Designer</h2>
          </div>
          
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '60px', textAlign: 'center', marginBottom: '24px' }}>
            <Palette size={48} style={{ margin: '0 auto 16px', color: '#6b7280' }} />
            <h3 style={{ marginBottom: '8px' }}>Canvas Coming Soon</h3>
            <p style={{ color: '#6b7280' }}>Interactive event design tools will be available here</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', border: '2px solid #e5e7eb', borderRadius: '12px' }}>
              <Settings size={20} style={{ marginBottom: '8px' }} />
              <h4>Layout Options</h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Choose your venue layout</p>
            </div>
            <div style={{ padding: '16px', border: '2px solid #e5e7eb', borderRadius: '12px' }}>
              <Palette size={20} style={{ marginBottom: '8px' }} />
              <h4>Color Themes</h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Select color combinations</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <button onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', border: '2px solid #e5e7eb', borderRadius: '12px', background: 'white', cursor: 'pointer' }}>
            <ArrowLeft size={16} />
            Back
          </button>
          
          <button onClick={nextStep} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
            Continue to Review
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCanvasStep;