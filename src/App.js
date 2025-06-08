import React, { useState, useEffect, useCallback } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AddCompetition from './components/AddCompetition';
import EditCompetition from './components/EditCompetition';
import NotVerifiedPage from './components/NotVerifiedPage';
import AnnouncementModal from './components/AnnouncementModal';
import { API_BASE_URL } from './utils/api';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('athlonet_token'));
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(false);
  const [competitions, setCompetitions] = useState([]);

  const [loginData, setLoginData] = useState({ contactEmail: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '', type: '', address: '', contactEmail: '', password: ''
  });

  const [competitionData, setCompetitionData] = useState({
    name: '', description: '', sport: '', startDate: '', endDate: '',
    location: '', isPrivate: false, status: 'upcoming'
  });

  const [editData, setEditData] = useState(null);
  const [announcementData, setAnnouncementData] = useState(null);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const fetchCompetitions = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/event/organizer/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setCompetitions(data.competitions);
      }
    } catch (err) {
      console.error('Error fetching competitions:', err);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('athlonet_token', token);
      const decoded = parseJwt(token);
      if (decoded?.organization?.id) {
        setUser({ id: decoded.organization.id });
        setCurrentPage('dashboard');
      }
    }
  }, [token]);

  useEffect(() => {
    if (user?.id && isVerified) {
      fetchCompetitions();
    }
  }, [user, isVerified, fetchCompetitions]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/organization/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setUser({ id: data.id, name: data.name });
        setIsVerified(data.isVerified);
        setLoginData({ contactEmail: '', password: '' });
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (err) {
      alert('Login error: ' + err.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/organization/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setRegisterData({
          name: '', type: '', address: '', contactEmail: '', password: ''
        });
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (err) {
      alert('Registration error: ' + err.message);
    }
    setLoading(false);
  };

  const handleAddCompetition = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/event/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...competitionData, organizer: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Event created successfully');
        fetchCompetitions();
        setCompetitionData({
          name: '', description: '', sport: '', startDate: '', endDate: '',
          location: '', isPrivate: false, status: 'upcoming'
        });
        setCurrentPage('dashboard');
      } else {
        alert(data.message || 'Event creation failed');
      }
    } catch (err) {
      alert('Error adding event: ' + err.message);
    }
    setLoading(false);
  };

  const handleEditCompetition = async () => {
    if (!editData || !editData._id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/event/edit/${editData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Event updated successfully');
        fetchCompetitions();
        setEditData(null);
        setCurrentPage('dashboard');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      alert('Error updating event: ' + err.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('athlonet_token');
    setToken(null);
    setUser(null);
    setIsVerified(null);
    setCurrentPage('login');
  };

  if (!token) {
    return (
      <AuthPage
        loginData={loginData} setLoginData={setLoginData}
        registerData={registerData} setRegisterData={setRegisterData}
        handleLogin={handleLogin} handleRegister={handleRegister}
        loading={loading}
      />
    );
  }

  if (isVerified === false) {
    return <NotVerifiedPage handleLogout={handleLogout} />;
  }

  if (currentPage === 'add-competition') {
    return (
      <AddCompetition
        competitionData={competitionData}
        setCompetitionData={setCompetitionData}
        handleAddCompetition={handleAddCompetition}
        loading={loading}
        setCurrentPage={setCurrentPage}
        handleLogout={handleLogout}
      />
    );
  }

  if (currentPage === 'edit-competition' && editData) {
    return (
      <EditCompetition
        editData={editData}
        setEditData={setEditData}
        handleEditCompetition={handleEditCompetition}
        loading={loading}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  return (
    <>
      <Dashboard
        competitions={competitions}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleLogout={handleLogout}
        setEditData={setEditData}
        setCurrentPageToEdit={() => setCurrentPage('edit-competition')}
        setAnnouncementData={setAnnouncementData}
      />
      {announcementData && (
        <AnnouncementModal
          competition={announcementData}
          token={token}
          onClose={() => setAnnouncementData(null)}
        />
      )}
    </>
  );
}

export default App;
