import { Facebook, Instagram, Twitter, Link } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1D1D1D] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Mintickt. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <Link size={16} />
                Terms
              </a>
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <Link size={16} />
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;