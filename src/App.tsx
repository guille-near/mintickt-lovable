import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import DiscoverEvents from "./pages/DiscoverEvents";
import PublicProfile from "./pages/PublicProfile";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/discover" element={<DiscoverEvents />} />
        <Route path="/@:username" element={<PublicProfile />} />
        <Route element={<AuthenticatedLayout />}>
          <Route path="/account" element={<Account />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;