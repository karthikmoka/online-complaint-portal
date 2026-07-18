import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const AuthPortal = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setToken, setUser, triggerSystemAlert } = useContext(AppContext);
  const navigate = useNavigate();

  const handleAuthTransaction = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    const endpointSuffix = isLoginView ? 'login' : 'register';
    const payload = isLoginView ? { email, password } : { name, email, password, role };
    
    // DIRECT MULTI-TUNNEL PROBE TO BYPASS IP LOCKS WITHOUT EXTERNAL SERVICES
    const operationalTunnels = [
      `http://localhost:5000/api/v1/auth/${endpointSuffix}`,
      `http://127.0.0{endpointSuffix}`
    ];

    let success = false;
    let errorMsg = '';

    for (const url of operationalTunnels) {
      if (success) break;
      try {
        const response = await axios.post(url, payload, { timeout: 3500 });
        if (response.data && response.data.success) {
          success = true;
          if (isLoginView) {
            setToken(response.data.token);
            setUser(response.data.user);
            triggerSystemAlert('success', 'Authorization successful. Welcome back.');
            navigate('/dashboard');
          } else {
            triggerSystemAlert('success', '🎉 Account Created Successfully! Please Sign In now.');
            setIsLoginView(true);
            setName('');
            setPassword('');
          }
          break;
        }
      } catch (error) {
        errorMsg = error.response?.data?.message || 'Gateway node threshold timeout.';
      }
    }

    if (!success) {
      setLocalError(errorMsg || 'Connection failure. Make sure backend server.js is running on port 5000.');
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', paddingTop: '60px' }}>
      <div className="container text-center mb-4">
        <div className="d-flex justify-content-center align-items-center gap-2 mb-1">
          <span style={{ fontSize: '28px' }}>🏛️</span>
          <h5 className="m-0 fw-bold text-secondary text-uppercase tracking-wider" style={{ fontSize: '14px' }}>National Grievance Redressal Portal</h5>
        </div>
        <h2 className="fw-extrabold text-dark border-bottom pb-2 d-inline-block px-4" style={{ borderColor: '#0d6efd' }}>Online Complaint Registration & Management System</h2>
      </div>

      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card shadow-lg p-4 bg-white border-0 rounded-3" style={{ borderTop: '5px solid #0a2540' }}>
          <h4 className="text-center text-dark fw-bold mb-3">
            {isLoginView ? '🔐 Secure Gateway Sign In' : '📝 Citizen Identity Registration'}
          </h4>
          
          {localError && <div className="alert alert-danger py-2 small text-center fw-semibold">{localError}</div>}
          
          <form onSubmit={handleAuthTransaction}>
            {!isLoginView && (
              <div className="mb-3">
                <label className="form-label small fw-bold text-dark">Full Legal Name</label>
                <input type="text" className="form-control gov-input-field" placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Official Email Address</label>
              <input type="email" className="form-control gov-input-field" placeholder="example@domain.gov" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Security Account Password</label>
              <input type="password" className="form-control gov-input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {!isLoginView && (
              <div className="mb-4">
                <label className="form-label small fw-bold text-dark">Classification Clearance Group</label>
                <select className="form-select gov-input-field" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="Customer">Customer (Ordinary Citizen)</option>
                  <option value="Agent">Department Officer / Grievance Agent</option>
                  <option value="Admin">Central Platform Admin Authority</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm" style={{ backgroundColor: '#0a2540', borderColor: '#0a2540' }} disabled={loading}>
              {loading ? 'Validating Enclaves...' : isLoginView ? 'Authorize Access' : 'Register Legal Account'}
            </button>

            <div className="text-center mt-3">
              <button type="button" className={`btn btn-sm w-100 fw-bold ${isLoginView ? 'btn-outline-success' : 'btn-outline-secondary'}`} onClick={() => { setIsLoginView(!isLoginView); setLocalError(''); }}>
                {isLoginView ? '✨ Create New Citizen Account (Sign Up)' : 'Already Have an Account? Authorization Panel'}
              </button>
            </div>
          </form>
        </div>
        <div className="text-center mt-4 text-muted small">
          🛡️ Secure encrypted portal network infrastructure. All access logs recorded.
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;
