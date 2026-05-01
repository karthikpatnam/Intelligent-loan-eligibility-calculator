import React, { useState, useEffect } from 'react';
import { Calendar, IndianRupee, Activity, ChevronRight, Search, FileDown } from 'lucide-react';
import * as loanService from '../services/loanService';

const History = ({ onBack, onViewResult }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await loanService.getHistory();
                setHistory(data);
            } catch (err) {
                console.error('Failed to fetch history', err);
            }
            setLoading(false);
        };
        fetchHistory();
    }, []);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredHistory = history.filter(item => 
        item.status?.toLowerCase().includes(filter.toLowerCase()) ||
        item.requestedAmount?.toString().includes(filter)
    );

    return (
        <div className="history-view animate-fade-in">
            <div className="history-header">
                <button onClick={onBack} className="back-btn">
                    <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back to Dashboard
                </button>
                <h1>Assessment History</h1>
            </div>

            <div className="history-controls">
                <div className="search-bar">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Filter by status or amount..." 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading history...</div>
            ) : filteredHistory.length === 0 ? (
                <div className="empty-state">
                    <Activity size={48} />
                    <h3>No records found</h3>
                    <p>Start your first analysis to see it here.</p>
                </div>
            ) : (
                <div className="history-list">
                    {filteredHistory.map((item, index) => (
                        <div key={index} className="glass-card history-item" onClick={() => onViewResult(item)}>
                            <div className="item-main">
                                <div className="item-date">
                                    <Calendar size={14} />
                                    {formatDate(item.timestamp)}
                                </div>
                                <div className="item-amount">
                                    <IndianRupee size={16} />
                                    <span>{formatCurrency(item.requestedAmount)}</span>
                                </div>
                                <div className="item-meta">
                                    <span>{item.tenure} Months</span>
                                    {item.interestRate && <span className="rate-badge">{item.interestRate}% APR</span>}
                                </div>
                            </div>
                            
                            <div className="item-details">
                                <div className={`status-pill ${item.status?.toLowerCase().replace(' ', '-')}`}>
                                    {item.status}
                                </div>
                                <div className="risk-score">
                                    Risk: <span className={item.riskLevel?.toLowerCase()}>{item.riskLevel}</span>
                                </div>
                            </div>

                            <div className="item-actions">
                                <button className="view-report-btn" title="Download Report" onClick={(e) => { e.stopPropagation(); window.print(); }}>
                                    <FileDown size={18} />
                                </button>
                                <ChevronRight size={18} className="expand-icon" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
