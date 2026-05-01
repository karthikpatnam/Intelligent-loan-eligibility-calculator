import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import History from './components/History';
import * as loanService from './services/loanService';
import * as authService from './services/authService';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as ReTooltip, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Info, PieChart as PieIcon, TrendingDown, HelpCircle, ChevronRight, Activity, Check } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('auth'); // auth, dashboard, calculator, history
  const [formData, setFormData] = useState({
    income: '', existingEmi: '', requestedAmount: '', tenure: '',
    creditScore: '', latePayments: '', hasCreditMix: false, jobTenure: '',
    netTakeHomePay: '', downPayment: '', assetValue: '', age: '',
    residencyType: '', employmentType: '', hasExistingLoan: false
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const stages = [
    "Initializing Neural Risk Engine...",
    "Scanning Credit History...",
    "Analyzing FOIR Ratios...",
    "Verifying Stability...",
    "Calculating Capacity...",
    "Finalizing Report..."
  ];

  const handleLogin = (userData) => {
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('auth');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (value === '' ? '' : (isNaN(value) ? value : parseFloat(value)))
    }));
  };

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setResult(null);
    setIsSubmitted(true);
    setLoadingStage(0);
    
    try {
      for (let i = 0; i < stages.length; i++) {
        setLoadingStage(i);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      const data = await loanService.calculateLoan(formData);
      setResult(data);

      // Save to history (non-blocking)
      loanService.saveHistory({
        ...formData,
        ...data,
        timestamp: new Date()
      }).catch(hErr => console.error("History Save Failed:", hErr));
      
    } catch (err) {
      console.error("Analysis Error:", err);
      const msg = err.response?.data?.message || "Check your network connection and try again.";
      alert(`Analysis failed: ${msg}`);
      setIsSubmitted(false);
    }
    setLoading(false);
  };

  const formatCurrency = (val) => {
    // NaN Shield: Force conversion to number and default to 0 if invalid
    const num = Number(val);
    const safeVal = isNaN(num) || !isFinite(num) ? 0 : num;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(safeVal);
  };
  const handleDone = () => {
    // Reset calculator state and return home
    setView('dashboard');
    setIsSubmitted(false);
    setResult(null);
    setCurrentStep(1);
    setFormData({
      income: '',
      requestedAmount: '',
      tenure: '',
      creditScore: '',
      latePayments: '',
      hasCreditMix: false,
      jobTenure: '',
      netTakeHomePay: '',
      hasExistingLoan: false,
      existingEmi: 0,
      downPayment: '',
      assetValue: '',
      age: '',
      residencyType: '',
      employmentType: ''
    });
  };

  if (view === 'auth') return <Auth onLogin={handleLogin} />;
  if (view === 'dashboard') return <Dashboard user={user} onLogout={handleLogout} onNavigate={setView} />;
  if (view === 'history') return (
    <History 
      onBack={() => setView('dashboard')} 
      onViewResult={(item) => {
        setResult(item);
        setFormData({
          income: item.income || '',
          existingEmi: item.existingEmi || 0,
          requestedAmount: item.requestedAmount || '',
          tenure: item.tenure || '',
          creditScore: item.creditScore || '',
          latePayments: item.latePayments || 0,
          hasCreditMix: item.hasCreditMix || false,
          jobTenure: item.jobTenure || '',
          netTakeHomePay: item.netTakeHomePay || '',
          downPayment: item.downPayment || '',
          assetValue: item.assetValue || '',
          age: item.age || '',
          residencyType: item.residencyType || '',
          employmentType: item.employmentType || '',
          hasExistingLoan: item.existingEmi > 0
        });
        setIsSubmitted(true);
        setView('calculator');
      }} 
    />
  );

  // Calculator View logic follows...
  if (view === 'calculator') {
    if (!isSubmitted || loading) {
      return (
        <div className="glass-card main-container expanded-form">
          <button className="back-btn" onClick={() => setView('dashboard')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Dashboard
          </button>
          {loading ? (
            <div className="loading-overlay">
              <div className="neural-loader">
                <div className="loader-ring"></div>
                <div className="loader-content">
                  <h3>Deep Analysis in Progress</h3>
                  <p className="stage-text">{stages[loadingStage]}</p>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${((loadingStage + 1) / stages.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <header>
                <h1>Loan Intelligence Engine</h1>
                <p className="subtitle">Global precision underwriting with real-time risk scoring.</p>
              </header>

              <div className="wizard-stepper">
                {[1,2,3,4].map((step) => (
                  <React.Fragment key={step}>
                    <div className={`step-indicator ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                      <div className="step-number">{currentStep > step ? '✓' : step}</div>
                    </div>
                    {step < 4 && <div className={`step-line ${currentStep > step ? 'active' : ''}`}></div>}
                  </React.Fragment>
                ))}
              </div>

              <form onSubmit={handleCalculate} className="manual-form">
                {currentStep === 1 && (
                  <section className="form-section animate-slide-in">
                    <h3 className="section-title">Identity & Stability</h3>
                    <div className="input-grid-4">
                      <div className="input-group">
                        <label>Applicant Age</label>
                        <input type="number" name="age" className="manual-input" value={formData.age} onChange={handleInputChange} required />
                      </div>
                      <div className="input-group">
                        <label>Job Tenure (Years)</label>
                        <input type="number" name="jobTenure" className="manual-input" value={formData.jobTenure} onChange={handleInputChange} required />
                      </div>
                      <div className="input-group">
                        <label>Employment Type</label>
                        <select name="employmentType" className="manual-input" value={formData.employmentType} onChange={handleInputChange} required>
                          <option value="">Select Type</option>
                          <option value="Salaried">Salaried</option>
                          <option value="Self-employed">Self-employed</option>
                        </select>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 2 && (
                  <section className="form-section animate-slide-in">
                    <h3 className="section-title">Financial Capacity</h3>
                    <div className="input-grid-2">
                      <div className="input-group">
                        <label>Gross Monthly Income (₹)</label>
                        <input type="number" name="income" className="manual-input" value={formData.income} onChange={handleInputChange} required />
                      </div>
                      <div className="input-group">
                        <label>Do you have any existing loans?</label>
                        <div className="binary-toggle-group">
                          <button 
                            type="button" 
                            className={`toggle-option ${formData.hasExistingLoan ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, hasExistingLoan: true})}
                          >Yes</button>
                          <button 
                            type="button" 
                            className={`toggle-option ${!formData.hasExistingLoan ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, hasExistingLoan: false, existingEmi: 0})}
                          >No</button>
                        </div>
                      </div>
                      {formData.hasExistingLoan && (
                        <div className="input-group animate-fade-in full-width">
                          <label>Total Monthly EMI Outflow (₹)</label>
                          <input 
                            type="number" 
                            name="existingEmi" 
                            className="manual-input" 
                            value={formData.existingEmi} 
                            onChange={handleInputChange} 
                            placeholder="Sum of all current EMIs"
                            required 
                          />
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {currentStep === 3 && (
                  <section className="form-section animate-slide-in">
                    <h3 className="section-title">Credit Health</h3>
                    <div className="input-grid-4">
                      <div className="input-group">
                        <label>Credit Score (300-900)</label>
                        <input type="number" name="creditScore" className="manual-input" value={formData.creditScore} onChange={handleInputChange} required />
                      </div>
                      <div className="input-group">
                        <label>Late Payments (2yrs)</label>
                        <input type="number" name="latePayments" className="manual-input" value={formData.latePayments} onChange={handleInputChange} />
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 4 && (
                  <section className="form-section animate-slide-in">
                    <h3 className="section-title">Loan Details</h3>
                    <div className="input-grid-4">
                      <div className="input-group">
                        <label>Loan Requested (₹)</label>
                        <input type="number" name="requestedAmount" className="manual-input" value={formData.requestedAmount} onChange={handleInputChange} required />
                      </div>
                      <div className="input-group">
                        <label>Tenure (Months)</label>
                        <input type="number" name="tenure" className="manual-input" value={formData.tenure} onChange={handleInputChange} required />
                      </div>
                    </div>
                  </section>
                )}

                <div className="wizard-controls">
                  {currentStep > 1 && (
                    <button type="button" className="wizard-btn back" onClick={() => setCurrentStep(prev => prev - 1)}>Previous</button>
                  )}
                  {currentStep < 4 ? (
                    <button type="button" className="wizard-btn continue" onClick={() => setCurrentStep(prev => prev + 1)}>Continue</button>
                  ) : (
                    <button type="submit" className="calculate-btn submit-btn">Analyze Eligibility</button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="glass-card result-container result-expanded">
        <div className="result-actions-top">
          <button className="back-btn" onClick={() => setIsSubmitted(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Return to Input
          </button>
          <button className="download-btn-small" onClick={() => window.print()}>Save PDF</button>
        </div>

        {result && (
          <div className="analysis-view animate-fade-in">
            <div className={`eligibility-banner ${result.status === 'Rejected' ? 'not-eligible' : 'eligible'}`}>
              <div className="banner-content">
                <div className="banner-title-row">
                  <Activity size={24} className="banner-icon" />
                  <h2>{result.status === 'Rejected' ? 'NOT ELIGIBLE' : 'ELIGIBLE FOR LOAN'}</h2>
                </div>
                <p>{result.status === 'Rejected' ? 'Request cannot be fulfilled based on current underwriting rules.' : 'Profile meets core criteria for the requested amount.'}</p>
              </div>
              <div className="banner-score">
                <span className="score-label">Risk Level</span>
                <span className={`score-value ${result.riskLevel.toLowerCase()}`}>{result.riskLevel}</span>
              </div>
            </div>

            <div className="analysis-grid">
              <div className="analysis-column-main">
                <div className="max-amount-card">
                  <div className="card-header">
                    <span className="label">Maximum Borrowing Capacity</span>
                    <div className="info-tooltip-container">
                      <Info size={14} />
                      <span className="tooltip-text">Based on your FOIR (Debt-to-Income) limit and existing liabilities.</span>
                    </div>
                  </div>
                  <span className="value">{formatCurrency(result.maxEligibleAmount)}</span>
                  <div className="max-emi-hint">
                    Monthly EMI: <strong>{formatCurrency(result.emiForMaxAmount)}</strong>
                  </div>
                </div>

                <div className="stats-detail-grid">
                  <div className="detail-stat">
                    <div className="stat-label">
                      <span>FOIR Utilization</span>
                      <HelpCircle size={12} />
                    </div>
                    <div className="stat-progress">
                      <div className="progress-bg">
                        <div className="progress-fill" style={{ width: `${result.foirUsed}%`, background: result.foirUsed > 50 ? '#ef4444' : '#10b981' }}></div>
                      </div>
                      <span className="progress-val">{result.foirUsed}%</span>
                    </div>
                  </div>
                  <div className="detail-stat">
                    <div className="stat-label">
                      <span>LTV Ratio</span>
                      <HelpCircle size={12} />
                    </div>
                    <div className="stat-progress">
                      <div className="progress-bg">
                        <div className="progress-fill" style={{ width: `${result.ltv}%`, background: result.ltv > 80 ? '#f59e0b' : '#10b981' }}></div>
                      </div>
                      <span className="progress-val">{result.ltv}%</span>
                    </div>
                  </div>
                </div>

                <div className="risk-scorecard">
                  <h3>Underwriting Verdict</h3>
                  <ul className="risk-reasons-list">
                    {result.riskReasons.map((reason, i) => (
                      <li key={i} className="risk-reason-item">
                        <div className={`status-dot ${result.status === 'Rejected' ? 'red' : 'green'}`}></div>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="what-if-teaser">
                  <div className="teaser-content">
                    <h4>What-If Scenario Analysis</h4>
                    <p>Lowering your tenure to {Math.round(formData.tenure * 0.75)} months could reduce total interest by {formatCurrency(result.totalInterest * 0.2)}.</p>
                  </div>
                  <ChevronRight size={20} />
                </div>
              </div>

              <div className="analysis-column-side">
                <div className="chart-card">
                  <div className="chart-header">
                    <TrendingDown size={18} />
                    <span>Amortization Schedule</span>
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={result.schedule} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="month" hide />
                        <YAxis hide />
                        <ReTooltip 
                          contentStyle={{ 
                            background: '#1e293b', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '12px' 
                          }}
                          labelStyle={{ color: '#94a3b8' }}
                        />
                        <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBal)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-footer">Outstanding Balance over Time</div>
                </div>

                <div className="chart-card">
                  <div className="chart-header">
                    <PieIcon size={18} />
                    <span>Cost Breakdown</span>
                  </div>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Principal', value: Number(formData.requestedAmount) },
                            { name: 'Interest', value: Number(result.totalInterest) }
                          ]}
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={8}
                          dataKey="value"
                          stroke="none"
                          cx="50%"
                          cy="50%"
                        >
                          <Cell key="cell-0" fill="#6366f1" />
                          <Cell key="cell-1" fill="#ec4899" />
                        </Pie>
                        <ReTooltip 
                          contentStyle={{ 
                            background: '#1e293b', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff'
                          }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          align="center"
                          height={40} 
                          iconType="circle"
                          wrapperStyle={{ paddingTop: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="total-cost-box">
                    <div className="cost-row">
                      <span>Total Repayment</span>
                      <strong>{formatCurrency(result.totalRepayment)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="done-action-row" style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={handleDone} className="wizard-btn continue done-btn">
                <Check size={20} />
                Finish & Save to History
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default App;