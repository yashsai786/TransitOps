import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
      {/* Top Navigation Bar with No Sidebar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Semantic Footer */}
      <Footer />
    </div>
  );
};

