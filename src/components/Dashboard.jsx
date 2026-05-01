import React from 'react';
import { LayoutDashboard, FileText, History as HistoryIcon, PlusCircle, LogOut, ShieldCheck } from 'lucide-react';

const Dashboard = ({ user, onLogout, onNavigate }) => {
    return (
        <div className="dashboard-view animate-fade-in">
            <div className="dashboard-header">
                <div className="user-info">
                    <div className="avatar">{user?.name?.charAt(0) || 'U'}</div>
                    <div>
                        <h1>Hello, {user?.name || 'User'}</h1>
                        <p className="subtitle">Welcome to your risk analysis portal.</p>
                    </div>
                </div>
                <button onClick={onLogout} className="logout-btn">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="stats-grid-dashboard">
                <div className="glass-card stat-card">
                    <ShieldCheck className="stat-icon secure" />
                    <div className="stat-content">
                        <span className="stat-val">Secure</span>
                        <span className="stat-lbl">Underwriting Status</span>
                    </div>
                </div>
                <div className="glass-card stat-card">
                    <FileText className="stat-icon report" />
                    <div className="stat-content">
                        <span className="stat-val">Real-time</span>
                        <span className="stat-lbl">Risk Scoring</span>
                    </div>
                </div>
            </div>

            <div className="action-grid">
                <div className="glass-card action-card" onClick={() => onNavigate('calculator')}>
                    <div className="action-icon-bg calculator">
                        <PlusCircle size={32} />
                    </div>
                    <h3>New Analysis</h3>
                    <p>Start a deep-dive eligibility check for a new loan application.</p>
                    <button className="action-link">Launch Engine <ArrowRightSmall /></button>
                </div>

                <div className="glass-card action-card" onClick={() => onNavigate('history')}>
                    <div className="action-icon-bg history">
                        <HistoryIcon size={32} />
                    </div>
                    <h3>History</h3>
                    <p>Review and download reports from previous risk assessments.</p>
                    <button className="action-link">View Logs <ArrowRightSmall /></button>
                </div>
            </div>
        </div>
    );
};

const ArrowRightSmall = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
);

export default Dashboard;
