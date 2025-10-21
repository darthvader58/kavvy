// src/pages/UpgradePage.tsx
import { useState } from 'react';
import type { Author } from '../types';

interface UpgradePageProps {
  author: Author;
}

type BillingCycle = 'monthly' | 'semi-annual' | 'annual';

export function UpgradePage({ author }: UpgradePageProps) {
  const [selectedPlan, setSelectedPlan] = useState<BillingCycle>('annual');

  const plans = [
    {
      id: 'monthly' as BillingCycle,
      name: 'Monthly',
      price: 14.99,
      billing: 'per month',
      savings: null,
      popular: false
    },
    {
      id: 'semi-annual' as BillingCycle,
      name: 'Semi-Annual',
      price: 79.99,
      billing: 'every 6 months',
      savings: 'Save $10',
      popular: false
    },
    {
      id: 'annual' as BillingCycle,
      name: 'Annual',
      price: 149.99,
      billing: 'per year',
      savings: 'Save $30 - Best Value',
      popular: true
    }
  ];

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: 'AI-Powered Proofreading',
      description: 'Advanced grammar, style, and consistency checking powered by cutting-edge AI technology'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: '3x Account Promotion',
      description: 'Triple the visibility with featured placement in publisher searches and recommendation feeds'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Premium Agent Access',
      description: 'Direct connection to verified literary agents and beta readers in our exclusive network'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
      title: 'Priority Support',
      description: '24/7 dedicated support team to help you navigate the publishing process'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: 'Advanced Analytics',
      description: 'Detailed insights into how publishers view and engage with your manuscripts'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
          <path d="M2 17L12 22L22 17"/>
          <path d="M2 12L12 17L22 12"/>
        </svg>
      ),
      title: 'Unlimited AI Suggestions',
      description: 'No limits on AI-powered writing suggestions and manuscript improvements'
    }
  ];

  return (
    <div className="main-container" style={{ gridTemplateColumns: '1fr', maxWidth: '1400px' }}>
      {/* Hero Section */}
      <div style={{ 
        gridColumn: '1 / -1', 
        /*background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',*/
        borderRadius: '16px',
        border: '3px solid var(--primary)',
        padding: '4rem 3rem',
        color: 'white',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-light)' }}>
          Upgrade to Kavvy Premium
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.95, maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 , color: 'var(--primary-light)'}}>
          Unlock powerful AI tools, premium publisher connections, and accelerate your path to publication
        </p>
      </div>

      {/* Pricing Cards */}
      <div style={{ 
        gridColumn: '1 / -1',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {plans.map(plan => (
          <div 
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            style={{
              background: selectedPlan === plan.id ? 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)' : 'var(--card-bg)',
              border: `3px solid ${selectedPlan === plan.id ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: '16px',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative',
              boxShadow: selectedPlan === plan.id ? '0 8px 24px var(--shadow)' : '0 2px 8px var(--shadow)',
              transform: selectedPlan === plan.id ? 'scale(1.05)' : 'scale(1)',
              color: selectedPlan === plan.id ? 'white' : 'var(--text)'
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent)',
                color: 'white',
                padding: '0.25rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                MOST POPULAR
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '0.5rem',
                color: selectedPlan === plan.id ? 'white' : 'var(--primary)'
              }}>
                {plan.name}
              </h3>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0' }}>
                ${plan.price}
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                opacity: 0.8,
                color: selectedPlan === plan.id ? 'white' : 'var(--text-light)'
              }}>
                {plan.billing}
              </div>
              {plan.savings && (
                <div style={{
                  marginTop: '1rem',
                  background: selectedPlan === plan.id ? 'rgba(255,255,255,0.2)' : 'var(--success)',
                  color: selectedPlan === plan.id ? 'white' : 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {plan.savings}
                </div>
              )}
            </div>

            {selectedPlan === plan.id && (
              <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                ✓ Buy
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div style={{ gridColumn: '1 / -1', marginBottom: '3rem' }}>
        <div className="widget" style={{ padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', color: 'var(--primary)', marginBottom: '3rem' }}>
            Premium Features
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '1.5rem',
                  background: 'var(--bg)',
                  borderRadius: '12px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ 
                  color: 'var(--primary)', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  {feature.icon}
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{feature.title}</h3>
                </div>
                <p style={{ 
                  color: 'var(--text-light)', 
                  margin: 0, 
                  lineHeight: 1.6,
                  fontSize: '0.95rem'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        gridColumn: '1 / -1',
        background: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 4px 16px var(--shadow)'
      }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '1rem' }}>
          Ready to take your writing career to the next level?
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Join thousands of authors who have upgraded to Kavvy Premium and found their perfect publisher
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <button 
            className="btn-primary" 
            style={{ 
              padding: '1rem 3rem', 
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Upgrade to Premium - ${plans.find(p => p.id === selectedPlan)?.price}
          </button>
          
          <button 
            className="btn-secondary"
            style={{ 
              padding: '1rem 2rem', 
              fontSize: '1rem'
            }}
          >
            Start Free Trial
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            ✓ Cancel anytime
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            ✓ No commitment
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            ✓ 3-day money-back guarantee
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ gridColumn: '1 / -1', marginTop: '3rem' }}>
        <div className="widget" style={{ padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '2rem' }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div>
              <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>Can I cancel my subscription?</h3>
              <p style={{ color: 'var(--text-light)', margin: 0 }}>
                Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>What payment methods do you accept?</h3>
              <p style={{ color: 'var(--text-light)', margin: 0 }}>
                We accept all major credit cards, PayPal, and various other payment methods depending on your region.
              </p>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>Is there a free trial?</h3>
              <p style={{ color: 'var(--text-light)', margin: 0 }}>
                Yes! We offer a 3-day free trial so you can experience all premium features before committing.
              </p>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>Can I switch plans later?</h3>
              <p style={{ color: 'var(--text-light)', margin: 0 }}>
                Absolutely. You can upgrade or downgrade your plan at any time from your account settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}