import React, { useState, useEffect, useCallback } from 'react';
import {
  Menu, X, Mail, Phone, MapPin, Github, Linkedin,
  Download, ExternalLink, Code, Briefcase, GraduationCap,
  Heart, Settings, LogIn, LogOut, Edit2, Trash2,
  Save, Eye, Upload, FileText, CheckCircle, AlertCircle, Lock, User, KeyRound, Shield
} from 'lucide-react';

const API = 'http://localhost:5000/api';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white font-semibold
      ${type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
    </div>
  );
}

function CVModal({ onClose }) {
  const cvViewUrl = `${API}/cv/view`;
  const cvDownloadUrl = `${API}/cv/download`;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <FileText className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-white">Muhammad Haris Khan — CV</h3>
          </div>
          <div className="flex items-center gap-3">
            <a href={cvDownloadUrl}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all text-sm">
              <Download size={16} /> Download CV
            </a>
            <a href={cvViewUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm hover:bg-purple-500/30 transition-all">
              <ExternalLink size={14} /> Open
            </a>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden rounded-b-2xl">
          {isMobile ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-6 p-8 text-center">
              <FileText className="text-purple-400" size={64} />
              <p className="text-gray-300 text-lg">Mobile pe PDF preview available nahi hai</p>
              <div className="flex flex-col gap-3 w-full max-w-xs">
                <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(cvViewUrl)}&embedded=true`} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold">
                  <Eye size={18} /> View CV
                </a>
                <a href={cvDownloadUrl}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-purple-400 text-purple-400 rounded-full font-semibold">
                  <Download size={18} /> Download CV
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(cvViewUrl)}&embedded=true`}
              className="w-full h-[75vh]"
              title="CV Preview"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN MODAL ────────────────────────────────────────────────────────
// Secret URL-based access: user visits /#admin-login to see this
function LoginModal({ onLogin, onClose }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onLogin(data.token);
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Shield className="text-purple-400" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Admin Access</h3>
            <p className="text-gray-500 text-xs">Restricted area — authorized only</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white"><X size={22} /></button>
        </div>

        <div className="my-5 border-t border-purple-500/10" />

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400"
              placeholder="admin@example.com"
            />
            <p className="text-xs text-gray-600 mt-1">Optional — for account recovery</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Lock size={16} />
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ token, portfolioData, onUpdate, onToast, onLogout, onTokenUpdate }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [personal, setPersonal] = useState(portfolioData.personalInfo || {});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '', description: '', score: '' });
  const [editingEdu, setEditingEdu] = useState(null);
  const [techSkills, setTechSkills] = useState((portfolioData.skills?.technical || []).join(', '));
  const [softSkills, setSoftSkills] = useState((portfolioData.skills?.soft || []).join(', '));
  const [hobbyForm, setHobbyForm] = useState({ name: '', icon: '⭐' });
  const [editingHobby, setEditingHobby] = useState(null);
  const [projForm, setProjForm] = useState({ title: '', description: '', tech: '', link: '', github: '' });
  const [editingProj, setEditingProj] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  // Account settings state
  const [credForm, setCredForm] = useState({ username: '', email: '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [adminInfo, setAdminInfo] = useState(null);

  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Fetch admin info when account tab opens
  useEffect(() => {
    if (activeTab === 'account') {
      fetch(`${API}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          setAdminInfo(data);
          setCredForm({ username: data.username || '', email: data.email || '' });
        })
        .catch(() => {});
    }
  }, [activeTab, token]);

  const apiFetch = async (url, options = {}) => {
    setLoading(true);
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      onUpdate();
      return data;
    } catch (err) {
      onToast(err.message, 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Image upload + personal info save (race condition fixed) ─────────────
  const savePersonal = async () => {
    setLoading(true);
    try {
      // Step 1: Upload image first if selected, capture new path
      let updatedPersonal = { ...personal };

      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        const res = await fetch(`${API}/portfolio/profile-image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
        const d = await res.json();
        if (!res.ok) {
          onToast(d.error || 'Image upload failed', 'error');
          setLoading(false);
          return;
        }
        // Use the new image path returned from backend directly
        updatedPersonal.image = d.image;
        setImageFile(null);
        setImagePreview(null);
      }

      // Step 2: Save personal info with correct (possibly new) image path
      const res = await fetch(`${API}/portfolio/personal-info`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedPersonal)
      });
      const d = await res.json();
      if (!res.ok) {
        onToast(d.error || 'Save failed', 'error');
        setLoading(false);
        return;
      }

      // Step 3: Refresh portfolio so home section image updates too
      await onUpdate();
      onToast('Personal info saved!', 'success');
    } catch (err) {
      onToast(err.message || 'Save failed', 'error');
    }
    setLoading(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const saveEdu = async () => {
    if (editingEdu) {
      const d = await apiFetch(`${API}/portfolio/education/${editingEdu}`, { method: 'PUT', headers, body: JSON.stringify(eduForm) });
      if (d) { onToast('Education updated!', 'success'); setEditingEdu(null); }
    } else {
      const d = await apiFetch(`${API}/portfolio/education`, { method: 'POST', headers, body: JSON.stringify(eduForm) });
      if (d) onToast('Education added!', 'success');
    }
    setEduForm({ degree: '', institution: '', year: '', description: '', score: '' });
  };

  const deleteEdu = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    const d = await apiFetch(`${API}/portfolio/education/${id}`, { method: 'DELETE', headers });
    if (d) onToast('Education deleted!', 'success');
  };

  const saveSkills = async () => {
    const d = await apiFetch(`${API}/portfolio/skills`, {
      method: 'PUT', headers,
      body: JSON.stringify({
        technical: techSkills.split(',').map(s => s.trim()).filter(Boolean),
        soft: softSkills.split(',').map(s => s.trim()).filter(Boolean)
      })
    });
    if (d) onToast('Skills updated!', 'success');
  };

  const saveHobby = async () => {
    if (editingHobby) {
      const d = await apiFetch(`${API}/portfolio/hobbies/${editingHobby}`, { method: 'PUT', headers, body: JSON.stringify(hobbyForm) });
      if (d) { onToast('Hobby updated!', 'success'); setEditingHobby(null); }
    } else {
      const d = await apiFetch(`${API}/portfolio/hobbies`, { method: 'POST', headers, body: JSON.stringify(hobbyForm) });
      if (d) onToast('Hobby added!', 'success');
    }
    setHobbyForm({ name: '', icon: '⭐' });
  };

  const deleteHobby = async (id) => {
    if (!window.confirm('Delete this hobby?')) return;
    const d = await apiFetch(`${API}/portfolio/hobbies/${id}`, { method: 'DELETE', headers });
    if (d) onToast('Hobby deleted!', 'success');
  };

  const saveProj = async () => {
    if (editingProj) {
      const d = await apiFetch(`${API}/portfolio/projects/${editingProj}`, { method: 'PUT', headers, body: JSON.stringify(projForm) });
      if (d) { onToast('Project updated!', 'success'); setEditingProj(null); }
    } else {
      const d = await apiFetch(`${API}/portfolio/projects`, { method: 'POST', headers, body: JSON.stringify(projForm) });
      if (d) onToast('Project added!', 'success');
    }
    setProjForm({ title: '', description: '', tech: '', link: '', github: '' });
  };

  const deleteProj = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const d = await apiFetch(`${API}/portfolio/projects/${id}`, { method: 'DELETE', headers });
    if (d) onToast('Project deleted!', 'success');
  };

  const uploadCV = async () => {
    if (!cvFile) return onToast('Please select a PDF file', 'error');
    const fd = new FormData();
    fd.append('cv', cvFile);
    setLoading(true);
    try {
      const res = await fetch(`${API}/cv/upload`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd
      });
      const d = await res.json();
      if (res.ok) { onToast('CV uploaded!', 'success'); setCvFile(null); onUpdate(); }
      else onToast(d.error, 'error');
    } catch { onToast('Upload failed', 'error'); }
    setLoading(false);
  };

  // Account: update credentials (username + email)
  const saveCredentials = async () => {
    if (!credForm.username.trim()) return onToast('Username cannot be empty', 'error');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/update-credentials`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(credForm)
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      // Update token if returned
      if (d.token) {
        localStorage.setItem('portfolio_token', d.token);
        onTokenUpdate(d.token);
      }
      setAdminInfo(prev => ({ ...prev, username: credForm.username, email: credForm.email }));
      onToast('Credentials updated!', 'success');
    } catch (err) {
      onToast(err.message, 'error');
    }
    setLoading(false);
  };

  // Account: change password
  const changePassword = async () => {
    if (!passForm.currentPassword || !passForm.newPassword) return onToast('All fields required', 'error');
    if (passForm.newPassword !== passForm.confirmPassword) return onToast('New passwords do not match', 'error');
    if (passForm.newPassword.length < 6) return onToast('Password must be at least 6 characters', 'error');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onToast('Password changed successfully!', 'success');
    } catch (err) {
      onToast(err.message, 'error');
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: '👤' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'hobbies', label: 'Hobbies', icon: '❤️' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'cv', label: 'CV', icon: '📄' },
    { id: 'account', label: 'Account', icon: '🔐' },
  ];

  const ic = "w-full px-3 py-2 bg-slate-700 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400 placeholder-gray-500";
  const bs = "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50";
  const bd = "flex items-center gap-1 px-3 py-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-all";
  const be = "flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-xs hover:bg-purple-500/30 transition-all";

  return (
    <div className="fixed inset-0 z-[998] bg-black/90 backdrop-blur-sm flex items-center justify-center overflow-auto">
      <div className="bg-slate-900 border border-purple-500/20 rounded-2xl w-full max-w-3xl max-h-[95vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <Settings className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-white">Admin Panel</h3>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="flex overflow-x border-b border-purple-500/20 px-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === t.id ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── PERSONAL TAB ── */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Personal Information</h4>

              {/* Image preview */}
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 border border-purple-500/20 rounded-xl">
                <img
                  src={imagePreview || (portfolioData.personalInfo?.image?.startsWith('/uploads')
                    ? `http://localhost:5000${portfolioData.personalInfo.image}`
                    : portfolioData.personalInfo?.image
                    || `https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff&size=80`)}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-400"
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff&size=80`; }}
                />
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-2">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-purple-500/20 file:text-purple-300 file:text-xs file:cursor-pointer"
                  />
                  {imageFile && <p className="text-xs text-green-400 mt-1">✓ Selected: {imageFile.name}</p>}
                  {imagePreview && <p className="text-xs text-purple-400 mt-0.5">Preview shown above — save to apply</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {['name','title','email','phone','location','github','linkedin'].map(field => (
                  <div key={field}>
                    <label className="block text-xs text-gray-400 mb-1 capitalize">{field}</label>
                    <input className={ic} value={personal[field] || ''} onChange={e => setPersonal({...personal, [field]: e.target.value})} placeholder={field} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Bio</label>
                  <textarea className={ic + ' h-20 resize-none'} value={personal.bio || ''} onChange={e => setPersonal({...personal, bio: e.target.value})} />
                </div>
              </div>
              <button className={bs} onClick={savePersonal} disabled={loading}><Save size={16} /> Save Personal Info</button>
            </div>
          )}

          {/* ── EDUCATION TAB ── */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">{editingEdu ? 'Edit' : 'Add'} Education</h4>
              <div className="grid grid-cols-2 gap-3">
                {[['degree','Degree'],['institution','Institution'],['year','Year'],['score','Score/CGPA']].map(([f,l]) => (
                  <div key={f}>
                    <label className="block text-xs text-gray-400 mb-1">{l}</label>
                    <input className={ic} value={eduForm[f]} onChange={e => setEduForm({...eduForm, [f]: e.target.value})} placeholder={l} />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Description</label>
                  <textarea className={ic + ' h-16 resize-none'} value={eduForm.description} onChange={e => setEduForm({...eduForm, description: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3">
                <button className={bs} onClick={saveEdu} disabled={loading}><Save size={16} /> {editingEdu ? 'Update' : 'Add'}</button>
                {editingEdu && <button className={bd} onClick={() => { setEditingEdu(null); setEduForm({degree:'',institution:'',year:'',description:'',score:''}); }}>Cancel</button>}
              </div>
              <div className="space-y-3">
                {(portfolioData.education || []).map(edu => (
                  <div key={edu._id} className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">{edu.degree}</p>
                        <p className="text-purple-300 text-sm">{edu.institution} · {edu.year}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className={be} onClick={() => { setEditingEdu(edu._id); setEduForm({degree:edu.degree,institution:edu.institution,year:edu.year,description:edu.description,score:edu.score}); }}><Edit2 size={12} /> Edit</button>
                        <button className={bd} onClick={() => deleteEdu(edu._id)}><Trash2 size={12} /> Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SKILLS TAB ── */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">Skills</h4>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Technical Skills (comma separated)</label>
                <textarea className={ic + ' h-24 resize-none'} value={techSkills} onChange={e => setTechSkills(e.target.value)} placeholder="React.js, Node.js, MongoDB..." />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Soft Skills (comma separated)</label>
                <textarea className={ic + ' h-20 resize-none'} value={softSkills} onChange={e => setSoftSkills(e.target.value)} placeholder="Problem Solving, Team Work..." />
              </div>
              <button className={bs} onClick={saveSkills} disabled={loading}><Save size={16} /> Save Skills</button>
            </div>
          )}

          {/* ── HOBBIES TAB ── */}
          {activeTab === 'hobbies' && (
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">{editingHobby ? 'Edit' : 'Add'} Hobby</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Hobby Name</label>
                  <input className={ic} value={hobbyForm.name} onChange={e => setHobbyForm({...hobbyForm, name: e.target.value})} placeholder="Reading" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Emoji Icon</label>
                  <input className={ic} value={hobbyForm.icon} onChange={e => setHobbyForm({...hobbyForm, icon: e.target.value})} placeholder="📚" />
                </div>
              </div>
              <div className="flex gap-3">
                <button className={bs} onClick={saveHobby} disabled={loading}><Save size={16} /> {editingHobby ? 'Update' : 'Add'}</button>
                {editingHobby && <button className={bd} onClick={() => { setEditingHobby(null); setHobbyForm({name:'',icon:'⭐'}); }}>Cancel</button>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(portfolioData.hobbies || []).map(h => (
                  <div key={h._id} className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-white">{h.icon} {h.name}</span>
                    <div className="flex gap-2">
                      <button className={be} onClick={() => { setEditingHobby(h._id); setHobbyForm({name:h.name,icon:h.icon}); }}><Edit2 size={12} /></button>
                      <button className={bd} onClick={() => deleteHobby(h._id)}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">{editingProj ? 'Edit' : 'Add'} Project</h4>
              <div className="space-y-3">
                {[['title','Project Title'],['description','Description'],['tech','Tech Stack (comma separated)'],['link','Live Demo URL'],['github','GitHub URL']].map(([f,l]) => (
                  <div key={f}>
                    <label className="block text-xs text-gray-400 mb-1">{l}</label>
                    {f === 'description'
                      ? <textarea className={ic + ' h-16 resize-none'} value={projForm[f]} onChange={e => setProjForm({...projForm, [f]: e.target.value})} placeholder={l} />
                      : <input className={ic} value={projForm[f]} onChange={e => setProjForm({...projForm, [f]: e.target.value})} placeholder={l} />
                    }
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className={bs} onClick={saveProj} disabled={loading}><Save size={16} /> {editingProj ? 'Update' : 'Add'}</button>
                {editingProj && <button className={bd} onClick={() => { setEditingProj(null); setProjForm({title:'',description:'',tech:'',link:'',github:''}); }}>Cancel</button>}
              </div>
              <div className="space-y-3">
                {(portfolioData.projects || []).map(p => (
                  <div key={p._id} className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">{p.title}</p>
                        <p className="text-gray-400 text-xs mt-1">{(p.tech || []).join(', ')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className={be} onClick={() => { setEditingProj(p._id); setProjForm({title:p.title,description:p.description,tech:(p.tech||[]).join(', '),link:p.link,github:p.github}); }}><Edit2 size={12} /> Edit</button>
                        <button className={bd} onClick={() => deleteProj(p._id)}><Trash2 size={12} /> Del</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CV TAB ── */}
          {activeTab === 'cv' && (
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg">CV Management</h4>
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5">
                <p className="text-gray-300 text-sm mb-4">Upload your CV (PDF only, max 10MB). Visitors can view and download it.</p>
                <input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files[0])} className="text-sm text-gray-400 mb-3 block" />
                {cvFile && <p className="text-xs text-green-400 mb-3">Selected: {cvFile.name}</p>}
                <button className={bs} onClick={uploadCV} disabled={loading || !cvFile}><Upload size={16} /> Upload CV</button>
              </div>
              <div className="flex gap-3 mt-4">
                <a href={`${API}/cv/view`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-all">
                  <Eye size={16} /> Preview Current CV
                </a>
                <a href={`${API}/cv/download`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg text-sm hover:bg-green-500/30 transition-all">
                  <Download size={16} /> Download Current CV
                </a>
              </div>
            </div>
          )}

          {/* ── ACCOUNT TAB ── */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg flex items-center gap-2"><Shield size={20} className="text-purple-400" /> Account Settings</h4>

              {/* Current info display */}
              {adminInfo && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <User size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{adminInfo.username}</p>
                    <p className="text-gray-400 text-sm">{adminInfo.email || 'No email set'}</p>
                  </div>
                </div>
              )}

              {/* Update username & email */}
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 space-y-4">
                <h5 className="text-white font-semibold flex items-center gap-2"><User size={16} className="text-purple-400" /> Update Login Info</h5>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Username</label>
                  <input className={ic} value={credForm.username} onChange={e => setCredForm({...credForm, username: e.target.value})} placeholder="admin" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email</label>
                  <input type="email" className={ic} value={credForm.email} onChange={e => setCredForm({...credForm, email: e.target.value})} placeholder="admin@example.com" />
                </div>
                <button className={bs} onClick={saveCredentials} disabled={loading}><Save size={16} /> Update Username & Email</button>
              </div>

              {/* Change password */}
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5 space-y-4">
                <h5 className="text-white font-semibold flex items-center gap-2"><KeyRound size={16} className="text-purple-400" /> Change Password</h5>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Current Password</label>
                  <input type="password" className={ic} value={passForm.currentPassword} onChange={e => setPassForm({...passForm, currentPassword: e.target.value})} placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">New Password</label>
                  <input type="password" className={ic} value={passForm.newPassword} onChange={e => setPassForm({...passForm, newPassword: e.target.value})} placeholder="Min 6 characters" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Confirm New Password</label>
                  <input type="password" className={ic} value={passForm.confirmPassword} onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})} placeholder="Repeat new password" />
                </div>
                <button className={bs} onClick={changePassword} disabled={loading}><Lock size={16} /> Change Password</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── MAIN PORTFOLIO COMPONENT ─────────────────────────────────────────────────
export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCV, setShowCV] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_token'));
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch(`${API}/portfolio`);
      const data = await res.json();
      setPortfolio(data);
    } catch (err) {
      showToast('Could not connect to backend. Make sure server is running on port 5000.', 'error');
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

  // ── FIX 2: Listen for #admin-login hash to show login for admin only ────────
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin-login') {
        if (!token) setShowLogin(true);
        else setShowAdmin(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [token]);

  const handleLogin = (t) => {
    setToken(t);
    localStorage.setItem('portfolio_token', t);
    setShowLogin(false);
    setShowAdmin(true);
    // Clear hash from URL
    window.history.replaceState(null, '', window.location.pathname);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('portfolio_token');
    setShowAdmin(false);
  };

  const handleTokenUpdate = (newToken) => {
    setToken(newToken);
    localStorage.setItem('portfolio_token', newToken);
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-purple-300 text-lg">Loading portfolio...</p>
      </div>
    </div>
  );

  if (!portfolio) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center px-4">
      <div>
        <p className="text-red-400 text-xl font-bold mb-2">⚠️ Backend not connected</p>
        <p className="text-gray-400">Make sure your Node.js server is running on port 5000</p>
        <code className="block mt-4 text-sm text-purple-300 bg-slate-800 px-4 py-2 rounded-lg">cd portfolio-backend && npm install && npm start</code>
      </div>
    </div>
  );

  const { personalInfo, education, skills, hobbies, projects } = portfolio;
  const navItems = ['home', 'about', 'education', 'skills', 'projects', 'contact'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showCV && <CVModal onClose={() => setShowCV(false)} />}
      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => { setShowLogin(false); window.history.replaceState(null, '', window.location.pathname); }} />}
      {showAdmin && token && (
        <AdminPanel
          token={token}
          portfolioData={portfolio}
          onUpdate={fetchPortfolio}
          onToast={showToast}
          onLogout={handleLogout}
          onTokenUpdate={handleTokenUpdate}
        />
      )}

      {/* ── NAVBAR — No login button visible to public ── */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{personalInfo?.name}</div>
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button key={item} onClick={() => scrollToSection(item)}
                  className={`capitalize transition-colors ${activeSection === item ? 'text-purple-400' : 'text-gray-300 hover:text-purple-400'}`}>{item}</button>
              ))}
              {/* Admin button only shows if already logged in */}
              {token && (
                <button onClick={() => setShowAdmin(true)} className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-all">
                  <Settings size={15} /> Admin
                </button>
              )}
            </div>
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button key={item} onClick={() => scrollToSection(item)} className="block w-full text-left capitalize text-gray-300 hover:text-purple-400 py-2">{item}</button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── HOME SECTION ── */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                Hi, I'm <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{personalInfo?.name}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-purple-300 mb-6">{personalInfo?.title}</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl">{personalInfo?.bio}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button onClick={() => scrollToSection('contact')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                  Get In Touch
                </button>
                <button onClick={() => setShowCV(true)}
                  className="px-8 py-3 border-2 border-purple-400 text-purple-400 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-all flex items-center gap-2">
                  <FileText size={20} /> View CV
                </button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50"></div>
                <img
                  src={personalInfo?.image?.startsWith('/uploads')
                    ? `http://localhost:5000${personalInfo.image}?t=${Date.now()}`
                    : personalInfo?.image}
                  alt={personalInfo?.name}
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover object-[center_25%] border-4 border-purple-400 shadow-2xl"
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personalInfo?.name||'H')}&background=7c3aed&color=fff&size=320`; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">About Me</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Mail className="text-purple-400 mb-4" size={32} />, label: 'Email', value: personalInfo?.email },
              { icon: <Phone className="text-purple-400 mb-4" size={32} />, label: 'Phone', value: personalInfo?.phone },
              { icon: <MapPin className="text-purple-400 mb-4" size={32} />, label: 'Location', value: personalInfo?.location },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all">
                {item.icon}
                <h3 className="text-xl font-semibold text-white mb-2">{item.label}</h3>
                <p className="text-gray-300">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION SECTION ── */}
      <section id="education" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
            <GraduationCap className="text-purple-400" size={40} /> Education
          </h2>
          <div className="space-y-8">
            {(education || []).map((edu, i) => (
              <div key={edu._id || i} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-white mb-2 md:mb-0">{edu.degree}</h3>
                  <span className="text-purple-400 font-semibold">{edu.year}</span>
                </div>
                <p className="text-xl text-purple-300 mb-3">{edu.institution}</p>
                <p className="text-gray-300">{edu.description}</p>
                <p className="text-gray-300">{edu.score}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS SECTION ── */}
      <section id="skills" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
            <Code className="text-purple-400" size={40} /> Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[{label:'Technical Skills',items:skills?.technical||[]},{label:'Soft Skills',items:skills?.soft||[]}].map((g,i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
                <h3 className="text-2xl font-semibold text-white mb-6">{g.label}</h3>
                <div className="flex flex-wrap gap-3">
                  {g.items.map((s,j) => (
                    <span key={j} className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 rounded-full text-sm font-semibold">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center flex items-center justify-center gap-3">
              <Heart className="text-pink-400" size={32} /> Hobbies & Interests
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(hobbies || []).map((hobby, i) => (
                <div key={hobby._id || i} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all text-center">
                  <div className="text-4xl mb-3">{hobby.icon}</div>
                  <p className="text-white font-semibold">{hobby.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS SECTION ── */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
            <Briefcase className="text-purple-400" size={40} /> Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(projects || []).map((p, i) => (
              <div key={p._id || i} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
                <h3 className="text-xl font-semibold text-white mb-3">{p.title}</h3>
                <p className="text-gray-300 mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(p.tech || []).map((t, j) => <span key={j} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">{t}</span>)}
                </div>
                <div className="flex gap-4">
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"><ExternalLink size={18} /> Demo</a>}
                  {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"><Github size={18} /> Code</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section id="contact" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Let's Work Together</h2>
          <p className="text-gray-300 text-lg mb-8">I'm always open to discussing new projects, creative ideas, or opportunities.</p>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <a href={`mailto:${personalInfo?.email}`} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Mail size={20} /> Send Email
            </a>
            {personalInfo?.github && <a href={personalInfo.github} target="_blank" rel="noreferrer" className="px-8 py-3 border-2 border-purple-400 text-purple-400 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-all flex items-center gap-2">
              <Github size={20} /> GitHub
            </a>}
            {personalInfo?.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="px-8 py-3 border-2 border-purple-400 text-purple-400 rounded-full font-semibold hover:bg-purple-400 hover:text-white transition-all flex items-center gap-2">
              <Linkedin size={20} /> LinkedIn
            </a>}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 py-8 px-4 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2026 {personalInfo?.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
