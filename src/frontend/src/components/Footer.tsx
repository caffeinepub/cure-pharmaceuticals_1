import { FlaskConical } from "lucide-react";

interface FooterProps {
  onNavigate: (page: "home" | "products" | "contact" | "admin") => void;
  adminUnlocked: boolean;
}

export function Footer({ onNavigate, adminUnlocked }: FooterProps) {
  const year = new Date().getFullYear();

  const quickLinks: {
    label: string;
    page: "home" | "products" | "contact" | "admin";
  }[] = [
    { label: "Home", page: "home" },
    { label: "Products", page: "products" },
    { label: "Contact", page: "contact" },
    ...(adminUnlocked
      ? [{ label: "Admin Panel", page: "admin" as const }]
      : []),
  ];

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary-foreground/20 rounded-lg p-1.5">
                <FlaskConical className="h-5 w-5" />
              </div>
              <div className="font-bold text-lg">Cure Pharmaceuticals</div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your trusted partner for quality pharmaceutical products. Licensed
              and reliable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm tracking-widest uppercase mb-4 text-primary-foreground/60">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.page)}
                    className="text-primary-foreground/80 hover:text-primary-foreground text-sm capitalize transition-colors"
                    data-ocid="footer.nav.link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm tracking-widest uppercase mb-4 text-primary-foreground/60">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>📧 curepharmaa@outlook.com</li>
              <li>📱 +44 7492 497781</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-primary-foreground/50">
          <span>© {year} Cure Pharmaceuticals. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
