import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ChevronDown, User, LogOut, Bookmark, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const archiveLinks = [
  { label: "The Peak", href: "/archives/peak", desc: "Couture & Gala" },
  { label: "The Plateau", href: "/archives/plateau", desc: "Modern Professional" },
  { label: "The Foothills", href: "/archives/foothills", desc: "Streetwear & Emerging" },
  { label: "Heritage Lab", href: "/archives/heritage", desc: "Textile History" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [archivesOpen, setArchivesOpen] = useState(false);
  const [mobileArchivesOpen, setMobileArchivesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  const isArchivesActive = location.pathname.startsWith("/archives");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setArchivesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMobileArchivesOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Mountain Fashion Magazine" className="h-9 md:h-12 w-auto object-contain" />
            <div className="flex flex-col items-start">
              <span className="text-editorial-heading text-lg md:text-xl font-bold text-foreground tracking-wide leading-none">
                MOUNTAIN
              </span>
              <span className="text-[9px] md:text-[10px] lg:text-xs tracking-[0.15em] md:tracking-[0.3em] text-muted-foreground font-sans uppercase mt-1">
                Fashion Magazine
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>

            {/* Archives Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setArchivesOpen(!archivesOpen)}
                className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  isArchivesActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Archives
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${archivesOpen ? "rotate-180" : ""}`} />
              </button>
              {archivesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-background border border-border rounded-md shadow-lg py-2 animate-fade-up">
                  {archiveLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setArchivesOpen(false)}
                      className={`block px-4 py-2.5 hover:bg-accent transition-colors ${
                        location.pathname === link.href ? "text-primary" : "text-foreground"
                      }`}
                    >
                      <span className="text-sm font-medium">{link.label}</span>
                      <span className="block text-xs text-muted-foreground">{link.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === "/about" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              About
            </Link>

            <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>

            {/* Auth / User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-48 bg-background border border-border rounded-md shadow-lg py-2 animate-fade-up">
                    <p className="px-4 py-2 text-xs font-sans text-muted-foreground truncate border-b border-border">
                      {user.email}
                    </p>
                    <Link
                      to="/mood-board"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-sans text-foreground hover:bg-accent transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                      Mood Board
                    </Link>
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-sans text-foreground hover:bg-accent transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-sans text-foreground hover:bg-accent transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-foreground p-2 -mr-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col md:hidden animate-fade-up">
          <div className="flex items-center justify-between h-16 px-4">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
              <span className="text-editorial-heading text-lg font-bold text-foreground">MOUNTAIN</span>
            </Link>
            <button
              className="text-foreground p-2"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-start flex-1 gap-8 px-6 pt-12 pb-20 overflow-y-auto">
            <Link
              to="/"
              className={`text-editorial-heading text-2xl font-medium transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>

            {/* Mobile Archives Accordion */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setMobileArchivesOpen(!mobileArchivesOpen)}
                className={`flex items-center gap-2 text-editorial-heading text-2xl font-medium transition-colors hover:text-primary ${
                  isArchivesActive ? "text-primary" : "text-foreground"
                }`}
              >
                Archives
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileArchivesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileArchivesOpen && (
                <div className="flex flex-col items-center gap-3 mt-4">
                  {archiveLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`text-lg font-sans transition-colors hover:text-primary ${
                        location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`text-editorial-heading text-2xl font-medium transition-colors hover:text-primary ${
                location.pathname === "/about" ? "text-primary" : "text-foreground"
              }`}
            >
              About
            </Link>

            <div className="altitude-divider w-24 my-2" />

            {user ? (
              <>
                <Link
                  to="/mood-board"
                  className="flex items-center gap-2 text-editorial-heading text-xl font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Bookmark className="w-5 h-5" />
                  Mood Board
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-sans"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-6 py-3 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-sm hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
