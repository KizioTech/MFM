import { Link } from "react-router-dom";
import { Mail, Phone, Instagram } from "lucide-react";

const Footer = () => {
   const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-deep-brown text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Mountain Fashion Magazine" className="h-10 md:h-12 w-auto object-contain" />
              <div className="flex flex-col items-start">
                <span className="text-editorial-heading text-xl md:text-2xl font-bold text-primary-foreground tracking-wide leading-none">
                  MOUNTAIN
                </span>
                <span className="text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.3em] text-primary-foreground/60 font-sans uppercase mt-1">
                  Fashion Magazine
                </span>
              </div>
            </div>
            <p className="font-sans text-sm text-primary-foreground/70 max-w-sm leading-relaxed">
              Blending Malawian heritage with modern fashion. A social editorial platform for the modern African fashion enthusiast.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-primary-foreground/60 mb-4">The Archives</h4>
            <ul className="space-y-2 font-sans text-sm">
              <li><Link to="/archives/peak" className="text-primary-foreground/70 hover:text-primary transition-colors">The Peak</Link></li>
              <li><Link to="/archives/plateau" className="text-primary-foreground/70 hover:text-primary transition-colors">The Plateau</Link></li>
              <li><Link to="/archives/foothills" className="text-primary-foreground/70 hover:text-primary transition-colors">The Foothills</Link></li>
              <li><Link to="/archives/heritage" className="text-primary-foreground/70 hover:text-primary transition-colors">Heritage Lab</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-primary-foreground/60 mb-4">Magazine</h4>
            <ul className="space-y-2 font-sans text-sm">
              <li><Link to="/" className="text-primary-foreground/70 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-primary-foreground/70 hover:text-primary transition-colors">About MFM</Link></li>
              <li><Link to="/mood-board" className="text-primary-foreground/70 hover:text-primary transition-colors">Mood Board</Link></li>
              <li><Link to="/auth" className="text-primary-foreground/70 hover:text-primary transition-colors">Sign In / Join</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-semibold tracking-widest uppercase text-primary-foreground/60 mb-4">Contact Us</h4>
            <ul className="space-y-3 font-sans text-sm">
              <li>
                <a href="mailto:mount.fas.magazine@gmail.com" className="text-primary-foreground/70 hover:text-primary transition-colors flex items-center break-all">
                  <Mail className="w-4 h-4 mr-3 shrink-0" />
                  <span>mount.fas.magazine@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+265885157566" className="text-primary-foreground/70 hover:text-primary transition-colors flex items-center">
                  <Phone className="w-4 h-4 mr-3 shrink-0" />
                  <span>+265 885 157 566</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/mountainmagazine265?igsh=YmNuZnNncnE0cjE0" target="_blank" rel="noreferrer" className="text-primary-foreground/70 hover:text-primary transition-colors flex items-center break-all">
                  <Instagram className="w-4 h-4 mr-3 shrink-0" />
                  <span>@MountainMagazine265</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="altitude-divider mt-12 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-primary-foreground/50">
          <p>© {currentYear} Mountain Fashion Magazine. All rights reserved.</p>
          <p>Lilongwe, Malawi — Celebrating African Fashion Culture</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
