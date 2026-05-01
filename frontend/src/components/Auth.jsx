import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import * as authService from '../services/authService';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        user_email: '',
        user_password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!isLogin && formData.user_password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        
        try {
            if (isLogin) {
                const data = await authService.login(formData.user_email, formData.user_password);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                await authService.register(formData.name, formData.user_email, formData.user_password);
                setIsLogin(true);
                alert('Registration successful! Please login.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="glass-card auth-card">
                <div className="auth-header">
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Enter your credentials to access the engine' : 'Join the elite risk analysis platform'}</p>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Autofill Trap */}
                    <input type="text" name="prevent_autofill" style={{ display: 'none' }} tabIndex="-1" />
                    <input type="password" name="password_fake" style={{ display: 'none' }} tabIndex="-1" />
                    
                    {!isLogin && (
                        <div className="input-group">
                            <label><User size={16} /> Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                className="manual-input"
                                value={formData.name}
                                onChange={handleChange}
                                autoComplete="off"
                                required 
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <label><Mail size={16} /> Email Address</label>
                        <input 
                            type="email" 
                            name="user_email" 
                            className="manual-input"
                            value={formData.user_email}
                            onChange={handleChange}
                            autoComplete="new-off"
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label><Lock size={16} /> Password</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="user_password" 
                                className="manual-input password-field"
                                value={formData.user_password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required 
                            />
                            <button 
                                type="button" 
                                className="password-toggle" 
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label><Lock size={16} /> Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    name="confirmPassword" 
                                    className="manual-input password-field"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required 
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="calculate-btn submit-btn" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login' : 'Register')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-btn">
                            {isLogin ? 'Register Now' : 'Login instead'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
