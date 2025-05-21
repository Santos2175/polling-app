import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginForm from './pages/Auth/LoginForm';
import SignUpForm from './pages/Auth/SignUpForm';
import Home from './pages/Dashboard/Home';
import Bookmarks from './pages/Dashboard/Bookmarks';
import CreatePoll from './pages/Dashboard/CreatePoll';
import MyPolls from './pages/Dashboard/MyPolls';
import VotedPolls from './pages/Dashboard/VotedPolls';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path='/' element={<Root />} />
            <Route path='/login' exact element={<LoginForm />} />
            <Route path='/sign-up' exact element={<SignUpForm />} />
            <Route path='/dashboard' exact element={<Home />} />
            <Route path='/bookmarked-polls' exact element={<Bookmarks />} />
            <Route path='/create-poll' exact element={<CreatePoll />} />
            <Route path='/my-polls' exact element={<MyPolls />} />
            <Route path='/voted-polls' exact element={<VotedPolls />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptions={{
          style: {
            className: '',
            fontSize: '13px',
          },
        }}
      />
    </UserProvider>
  );
}

export default App;

// Define root component to handle initial redirect
const Root = () => {
  // Check if token exists in local storage
  const isAuthenticated = !!localStorage.getItem('token');

  // Redirect to dashboard if authenticated, else to login
  return isAuthenticated ? (
    <Navigate to='/dashboard' />
  ) : (
    <Navigate to='/login' />
  );
};
