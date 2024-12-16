import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import DiscoverEvents from "./pages/DiscoverEvents";
import PublicProfile from "./pages/PublicProfile";

function App() {
  console.log('🎯 [App] Rendering routes');
  
  // Add more detailed logging
  console.log('🎯 [App] Current pathname:', window.location.pathname);
  console.log('🎯 [App] Available routes:', [
    '/',
    '/auth',
    '/account',
    '/create-event',
    '/event/:eventId',
    '/discover',
    '/profile/:username'  // Changed from /profile/@:username to /profile/:username
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/discover" element={<DiscoverEvents />} />
        <Route path="/profile/:username" element={<PublicProfile />} />
      </Routes>
    </Router>
  );
}

export default App;