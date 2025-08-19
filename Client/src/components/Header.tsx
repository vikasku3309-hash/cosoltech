import { Phone, Mail, Facebook, Instagram, Twitter, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <>
      {/* Top Bar */}
      <motion.div 
        className="bg-primary text-primary-foreground py-2 px-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto flex justify-between items-center text-sm">
          <motion.div 
            className="flex items-center space-x-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+91 7860552888 | +91 7860551888</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info.cosoltech@gmail.com</span>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Facebook className="h-4 w-4 cursor-pointer hover:text-blue-200 transition-all duration-300 hover:scale-125" />
            <Instagram className="h-4 w-4 cursor-pointer hover:text-pink-200 transition-all duration-300 hover:scale-125" />
            <Twitter className="h-4 w-4 cursor-pointer hover:text-blue-200 transition-all duration-300 hover:scale-125" />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.nav 
        className="bg-background shadow-md py-4 px-4"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
          >
            <img 
              src="/logo.png" 
              alt="Complete Solution Technology" 
              className="h-12 w-auto hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMxRjJBMzciLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+";
              }}
            />
          </motion.div>
          
          <motion.div 
            className="hidden lg:flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              { href: "/", text: "Home" },
              { href: "/#about", text: "About Us" },
              { href: "/#services", text: "Our Services" },
              { href: "/job-apply", text: "Job Apply Form" },
              { href: "/#contact", text: "Contact Us" },
              { href: "/finance", text: "FINANCE" },
              { href: "/delivery-riders", text: "DELIVERY RIDERS" },
              { href: "/what-we-do", text: "What We Do" }
            ].map((link, index) => (
              <motion.a 
                key={link.href}
                href={link.href} 
                className="text-foreground hover:text-primary transition-all duration-300 story-link relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                {link.text}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Button 
              asChild
              variant="outline" 
              size="sm"
              className="hidden lg:flex items-center space-x-2 hover:scale-105 transition-transform duration-300"
            >
              <a href="/admin/login">
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </a>
            </Button>
            <Button className="lg:hidden hover:scale-105 transition-transform duration-300">Menu</Button>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
};

export default Header;