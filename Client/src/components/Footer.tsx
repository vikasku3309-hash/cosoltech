import { Phone, Mail, Facebook, Instagram, Twitter, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Complete Solution Technology</h3>
            <p className="text-sm opacity-90 mb-4">
              Your trusted partner in financial and business onboarding services. 
              We specialize in providing seamless solutions for digital payments, 
              account openings, and hiring support.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:opacity-75" />
              <Instagram className="h-5 w-5 cursor-pointer hover:opacity-75" />
              <Twitter className="h-5 w-5 cursor-pointer hover:opacity-75" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:opacity-75">Home</a></li>
              <li><a href="#about" className="hover:opacity-75">About Us</a></li>
              <li><a href="#services" className="hover:opacity-75">Our Services</a></li>
              <li><a href="#contact" className="hover:opacity-75">Contact Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm">
              <li>QR Onboarding</li>
              <li>Account Opening</li>
              <li>Delivery Partners Hiring</li>
              <li>Financial Services</li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <div>
                  <span>+91 7860552888</span><br/>
                  <span>+91 7860551888</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info.cosoltech@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Office Address:</p>
                  <p>SHEELA Enclave, Zuarinagar</p>
                  <p>GOA 403726</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="text-sm">
              <h5 className="font-semibold mb-2">Complete Solution Technology (Cosoltech)</h5>
              <p>370-Naka Hindola</p>
              <p>Lucknow, UP - 226004</p>
            </div>
            <div className="text-sm">
              <h5 className="font-semibold mb-2">Registered Office:</h5>
              <p>S-25 Rampur Bhagan</p>
              <p>Ayodhya - 224001</p>
            </div>
          </div>
          <div className="text-center text-sm">
            <p>&copy; 2024 Complete Solution Technology. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;