import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

const DESCRIPTIONS = [
  'Zbiranje',
  'Sestanek',
  'Tečaj',
  'Konferenca',
  'Druženje'
];

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: DESCRIPTIONS[0], start_time: '', end_time: '' });

  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (session) fetchEvents();
    if (session) fetchNotifications();
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage('Napaka pri prijavi: ' + error.message);
    else setMessage('Prijava uspešna!');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage('Napaka pri registraciji: ' + error.message);
    else {
      setMessage('Registracija uspešna, preveri email!');
      setIsRegister(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setMessage('');
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*').order('start_time', { ascending: true });
    if (error) setMessage('Napaka pri pridobivanju dogodkov!');
    else setEvents(data);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) {
      setMessage('Izpolni vsa polja!');
      return;
    }
    const { error } = await supabase.from('events').insert([{ 
      ...newEvent, 
      created_by: session.user.id 
    }]);
    if (error) setMessage('Napaka pri dodajanju dogodka!');
    else {
      setMessage('Dogodek dodan!');
      setNewEvent({ title: '', description: DESCRIPTIONS[0], start_time: '', end_time: '' });
      fetchEvents();
    }
  };

  const handleRegisterEvent = async (eventId) => {
    const { error } = await supabase.from('registrations').insert([{
      event_id: eventId,
      user_id: session.user.id
    }]);
    if (error) { setMessage('Napaka pri registraciji!'); return; }
    await supabase.from('notifications').insert([{
      user_id: session.user.id,
      message: `Prijava na dogodek uspešna!`
    }]);
    setMessage('Prijava uspešna in obvestilo poslano!');
    fetchNotifications();
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', session?.user?.id);
    if (!error) setNotifications(data || []);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>{isRegister ? 'Registracija' : 'Prijava'}</h2>
        {!session && (
          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            <input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" autoFocus /><br/>
            <input className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Geslo" type="password" /><br/>
            <button className="btn" type="submit">{isRegister ? 'Registracija' : 'Prijava'}</button>
          </form>
        )}
        {!session && (
          <button className="link-btn" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Nazaj na prijavo' : 'Ustvari račun'}
          </button>
        )}
        {session && (
          <>
            <h3>Dogodki</h3>
            <form onSubmit={handleCreateEvent} className="event-form">
              <input
                className="input"
                placeholder="Naslov"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <select
                className="input"
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              >
                {DESCRIPTIONS.map(desc => (
                  <option key={desc} value={desc}>{desc}</option>
                ))}
              </select>
              <input
                className="input"
                type="datetime-local"
                value={newEvent.start_time}
                onChange={e => setNewEvent({ ...newEvent, start_time: e.target.value })}
              />
              <input
                className="input"
                type="datetime-local"
                value={newEvent.end_time}
                onChange={e => setNewEvent({ ...newEvent, end_time: e.target.value })}
              />
              <button className="btn" type="submit">Ustvari dogodek</button>
            </form>
            <ul className="events">
              {events.map(ev => (
                <li key={ev.id}>
                  <b>{ev.title}</b> ({ev.description})<br />
                  {ev.start_time?.replace('T', ' ').slice(0, 16)} - {ev.end_time?.replace('T', ' ').slice(0, 16)}
                  <button className="btn-sm" onClick={() => handleRegisterEvent(ev.id)}>Prijavi se</button>
                </li>
              ))}
            </ul>
            <h3>Obvestila</h3>
            <ul className="notifications">
              {notifications.map(n => <li key={n.id}>{n.message}</li>)}
            </ul>
            <button className="btn-logout" onClick={logout}>Odjava</button>
          </>
        )}
        {message && <div className="msg">{message}</div>}
      </div>
    </div>
  );
}

export default App;
