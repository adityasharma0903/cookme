import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import MobileNav from './components/MobileNav/MobileNav';
import Home from './pages/Home/Home';
import Recipes from './pages/Recipes/Recipes';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import Creators from './pages/Creators/Creators';
import CreatorProfile from './pages/CreatorProfile/CreatorProfile';
import Contact from './pages/Contact/Contact';
// import Categories from './pages/Categories/Categories';
import Trending from './pages/Trending/Trending';
import Login from './pages/Auth/Login';
import GoogleSuccess from './pages/Auth/GoogleSuccess';
import EditProfile from './pages/Profile/EditProfile';
import Saved from './pages/Saved/Saved';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import CreatorDashboard from './pages/CreatorDashboard/CreatorDashboard';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import Collaborator from './pages/Collaborator/Collaborator';


// Protected route for admin
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Protected route for creator
// Dashboard router that serves different dashboards based on role
function DashboardRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'creator') return <CreatorDashboard />;
  if (user.role === 'user') return <UserDashboard />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/creator/:id" element={<CreatorProfile />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/categories" element={<Categories />} /> */}
          <Route path="/trending" element={<Trending />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/auth/google/success" element={<GoogleSuccess />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/collaborate" element={<Collaborator />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const hideNavFooterPaths = ['/login', '/register', '/admin', '/dashboard'];

function App() {
  const location = useLocation();
  const hideNavFooter = hideNavFooterPaths.some(p => location.pathname.startsWith(p));

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <AnimatedRoutes />
      {!hideNavFooter && <MobileNav />}
      {!hideNavFooter && <Footer />}
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppWrapper;
