import { Github, MessageCircle, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { ChainStatus } from "../ChainStatus";
import { Logo } from "../Logo";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const Footer = () => {
  const footerLinks = {
    product: [
      { label: "Markets", path: "/markets" },
      { label: "Create Market", path: "/create" },
      { label: "Analytics", path: "/analytics" },
      { label: "Agents", path: "/agents" },
    ],
    developers: [
      { label: "Documentation", path: "/developers" },
      { label: "API Reference", path: "/developers#api" },
      { label: "SDKs", path: "/developers#sdk" },
      { label: "Changelog", path: "/changelog" },
    ],
    company: [
      { label: "About", path: "/about" },
      { label: "Roadmap", path: "/roadmap" },
      { label: "Team", path: "/team" },
      { label: "Careers", path: "/careers" },
    ],
    legal: [
      { label: "Terms of Service", path: "/legal#terms" },
      { label: "Privacy Policy", path: "/legal#privacy" },
      { label: "Risk Disclosure", path: "/legal#risk" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-background-secondary">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="mb-12 p-8 rounded-2xl glass gradient-bg">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-foreground-secondary mb-6">
              Get the latest updates on new markets, features, and protocol improvements.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-surface/50 border-border focus-glow"
              />
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-foreground-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Developers</h4>
            <ul className="space-y-2">
              {footerLinks.developers.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-foreground-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-foreground-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-foreground-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Logo className="h-8 w-auto" animated={false} />
            <span className="text-sm text-foreground-muted">
              © 2024 Blink Markets. Built on Linera.
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hover-scale">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover-scale">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover-scale">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chain Status */}
        <div className="mt-8 flex justify-center">
          <ChainStatus />
        </div>

        {/* Powered by Linera */}
        <div className="mt-8 text-center">
          <a
            href="https://linera.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-sm text-foreground-secondary hover:text-primary transition-colors"
          >
            <span>Powered by</span>
            <span className="font-bold gradient-text">Linera</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
