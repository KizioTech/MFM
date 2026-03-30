import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Mail, Phone, Instagram } from "lucide-react";

// Eagerly import every image in src/assets so Vite processes filenames with spaces correctly
const assetModules = import.meta.glob("@/assets/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
}) as Record<string, { default: string }>;

/** Resolve an asset filename to its processed URL, or return "" if not found */
function asset(filename: string): string {
  const hit = Object.entries(assetModules).find(([path]) =>
    path.endsWith("/" + filename)
  );
  return hit ? hit[1].default : "";
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  filename: string;
  description: string;
  qualifications?: string[];
  achievements?: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const teamMembers: TeamMember[] = [
  {
    name: "Banken Mtsiriza",
    role: "Chief Executive Officer",
    filename: "banken mtsiriza.jpg",
    description:
      "Banken is the driving force behind Mountain Fashion, with a keen eye for storytelling that bridges Malawian culture with global fashion narratives.",
    qualifications: [
      "Bachelor of Education in Human Ecology",
      "Experienced in teaching fashion and design.",
    ],
    achievements: ["Founder of Mountain Fashion Magazine"],
  },
  {
    name: "Lekeleni Chinkhota",
    role: "Chief Editor",
    filename: "lekeleni chinkhota.jpg",
    description:
      "Lekeleni is the chief editor of Mountain Fashion Magazine, shaping the voice and vision of every issue.",
    qualifications: [
      "Bachelor of Arts in Language and Communication Studies",
      "Experienced in writing and editing.",
    ],
  },
  {
    name: "Blessings Mtsiriza",
    role: "Business & Financial Manager",
    filename: "blessings mtsiriza.jpg",
    description:
      "Blessings manages the business and financial operations of Mountain Fashion, ensuring sustainable growth with strong financial leadership.",
    qualifications: [
      "Bachelor of Education (Business Studies)",
      "Experienced in business and financial management.",
    ],
    achievements: [
      "Secondary school teacher in business studies, mathematics, and computer studies.",
    ],
  },
  {
    name: "Onika Malinki Mbewe",
    role: "Creative & Fashion Advisor",
    filename: "onika mbewe.jpg",
    description:
      "A fashion expert with global experience in teaching fashion and design in institutions of higher learning. Fashion designer and consultant.",
  },
  {
    name: "Josaphat Makawa",
    role: "IT Manager",
    filename: "kizio.jpg",
    description:
      "Josaphat manages our IT infrastructure and ensures our digital platforms run smoothly.",
    qualifications: [
      "Fourth Year Student | BSc Mathematics – University of Malawi",
      "Self-taught web developer with a passion for technology and computer science.",
    ],
    achievements: [
      "Founder of JMC | Math & Academics – tech-based learning for mathematics and software tools.",
    ],
  },
  {
    name: "Fyabupe Nkumbwa",
    role: "Model",
    filename: "fyabupe nkumbwa.jpg",
    description:
      "Fyabupe is a passionate fashion enthusiast and Creative Arts student majoring in Fashion Design and Drama. She believes fashion is a powerful medium for self-expression.",
    qualifications: [
      "First Year Student | BA Creative Arts – University of Malawi",
    ],
  },
  {
    name: "Linda Saka",
    role: "Model",
    filename: "linda saka.jpg",
    description:
      "Linda is a passionate fashion enthusiast and Fashion Design student dedicated to her craft.",
    qualifications: [
      "First Year Student | BA Fashion and Design – University of Malawi",
    ],
  },
  {
    name: "Limbani Longwe",
    role: "Photography & Graphic Design Intern",
    filename: "limbani longwe.jpg",
    description:
      "Limbani is a photography and graphic design intern at Mountain Fashion Magazine, bringing a fresh visual eye to every project.",
    qualifications: [
      "First Year Student | BA Fashion and Design – University of Malawi",
    ],
  },
];

// ─── Team Card ────────────────────────────────────────────────────────────────

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgSrc = asset(member.filename);

  const initials = member.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div
      className={`relative bg-card rounded-xl cursor-pointer transition-all duration-500 flex flex-col items-center p-4 border ${
        expanded ? "border-border shadow-md ring-1 ring-primary/20" : "border-transparent hover:border-border hover:shadow-sm"
      }`}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className={`relative overflow-hidden rounded-full transition-all duration-500 ring-2 ring-primary/10 ${expanded ? "w-32 h-32 mb-4" : "w-28 h-28 mb-3 group-hover:scale-105"}`}>
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            alt={member.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-editorial-heading text-2xl text-muted-foreground/40">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Name + role */}
      <h3 className="text-editorial-heading text-center text-base md:text-lg text-foreground leading-tight">
        {member.name}
      </h3>
      <p className="font-sans text-center text-[10px] md:text-xs font-semibold tracking-widest uppercase text-primary mt-1">
        {member.role}
      </p>

      {/* Expandable details */}
      <div
        className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-[40rem] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className="space-y-4 font-sans text-sm text-foreground/80 text-center">
          <p className="leading-relaxed">{member.description}</p>

          {member.qualifications && member.qualifications.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-foreground/40 mb-2">
                Qualifications
              </p>
              <ul className="space-y-1.5 flex flex-col items-center">
                {member.qualifications.map((q, i) => (
                  <li key={i} className="text-xs max-w-[90%]">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {member.achievements && member.achievements.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-foreground/40 mb-2">
                Achievements
              </p>
              <ul className="space-y-1.5 flex flex-col items-center">
                {member.achievements.map((a, i) => (
                  <li key={i} className="text-xs max-w-[90%] text-primary font-medium">
                    ★ {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <header className="paper-grain bg-deep-brown py-16 md:py-24 px-4 text-center">
        <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">
          Our Story
        </span>
        <h1 className="text-editorial-heading text-4xl md:text-6xl text-primary-foreground mt-2 mb-3">
          About MFM
        </h1>
        <p className="font-sans text-sm text-primary-foreground/70 max-w-lg mx-auto">
          Celebrating African fashion culture from the heart of Malawi
        </p>
      </header>

      {/* ── Editorial body ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="prose prose-lg max-w-none font-sans text-foreground/80 space-y-6">
          <p className="text-lg leading-relaxed">
            <span className="text-editorial-heading text-5xl float-left mr-3 mt-1 leading-none text-primary">
              M
            </span>
            ountain Fashion Magazine is Malawi's premier social editorial
            platform, dedicated to elevating African fashion, heritage, and
            creativity. We believe that fashion is more than clothing — it is
            culture, identity, and community woven together.
          </p>

          <h2 className="text-editorial-heading text-2xl text-foreground mt-10 mb-4">
            Our Mission
          </h2>
          <p>
            We bridge the gap between Malawian heritage and contemporary global
            fashion. Through curated editorial content, designer spotlights, and
            community engagement, we amplify the voices of African creatives who
            are reshaping the fashion landscape.
          </p>

          <h2 className="text-editorial-heading text-2xl text-foreground mt-10 mb-4">
            The Altitude System
          </h2>
          <p>
            Our unique content structure — The Peak, The Plateau, The Foothills,
            and Heritage Lab — ensures every reader finds their place on the
            mountain. From haute couture to street style, from seasoned
            designers to emerging talent, every altitude tells a story worth
            sharing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10">
            {[
              {
                title: "The Peak",
                desc: "Couture, gala fashion, and high-end designer showcases.",
              },
              {
                title: "The Plateau",
                desc: "Modern professional wear and elevated daily style.",
              },
              {
                title: "The Foothills",
                desc: "Streetwear, emerging talent, and fresh voices.",
              },
              {
                title: "Heritage Lab",
                desc: "Textile history and the roots of Malawian craft.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="p-6 border border-border rounded-sm">
                <h3 className="text-editorial-heading text-lg font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-editorial-heading text-2xl text-foreground mt-10 mb-4">
            Based in Lilongwe
          </h2>
          <p>
            Founded in the vibrant capital of Malawi, Mountain Fashion Magazine
            draws inspiration from the iconic Mount Mulanje and the rich
            cultural tapestry of our nation. We are proud to call Lilongwe home
            and to share Malawian creativity with the world.
          </p>
        </div>
      </section>

      {/* ── Team Section ── */}
      <section className="border-t border-border bg-muted/20 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-sans text-xs font-medium tracking-widest uppercase text-primary">
              The People
            </span>
            <h2 className="text-editorial-heading text-3xl md:text-5xl text-foreground mt-2 mb-4">
              Meet Our Visionaries
            </h2>
            <p className="font-sans text-sm text-foreground/60 max-w-md mx-auto">
              The creative minds shaping Mountain Fashion Magazine and
              celebrating Malawian style.{" "}
              <span className="italic">Tap any card to learn more.</span>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>
      {/* ── Contact Section ── */}
      <section className="py-16 md:py-24 px-4 max-w-5xl mx-auto text-center" id="contact">
        <h2 className="text-editorial-heading text-3xl md:text-5xl text-foreground mb-4">Get In Touch</h2>
        <p className="font-sans text-sm md:text-base text-foreground/70 max-w-2xl mx-auto mb-12">
          Ready to collaborate, share your story, or have questions about fashion in Malawi? We'd love to hear from you.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 border border-border bg-card rounded-sm flex flex-col items-center">
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-editorial-heading text-lg font-semibold mb-2">Email Us</h3>
            <a href="mailto:mount.fas.magazine@gmail.com" className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
              mount.fas.magazine@gmail.com
            </a>
          </div>
          <div className="p-6 border border-border bg-card rounded-sm flex flex-col items-center">
            <Phone className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-editorial-heading text-lg font-semibold mb-2">Call Us</h3>
            <a href="tel:+265885157566" className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
              +265 885 157 566
            </a>
          </div>
          <div className="p-6 border border-border bg-card rounded-sm flex flex-col items-center">
            <Instagram className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-editorial-heading text-lg font-semibold mb-2">Follow Us</h3>
            <a href="https://www.instagram.com/mountainmagazine265?igsh=YmNuZnNncnE0cjE0" target="_blank" rel="noreferrer" className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
              @MountainMagazine265
            </a>
          </div>
        </div>
      </section>
      <NewsletterSignup />
      <Footer />
    </div>
  );
};

export default AboutPage;