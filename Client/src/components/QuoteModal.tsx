import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints } from "@/lib/api";
import { Trophy, Users, MapPin, Building2 } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuoteModal = ({ isOpen, onClose }: QuoteModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    subject: "Quote Request",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post(endpoints.contact.submit, formData);
      
      toast({
        title: "Quote Request Sent!",
        description: "Thank you for your interest. We'll send you a detailed quote soon."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        subject: "Quote Request",
        message: ""
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send quote request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const partnerLogos = [
    { name: "Zomato", url: "/images/partners/zomato.png" },
    { name: "Swiggy", url: "/images/partners/swiggy.png" },
    { name: "Amazon", url: "/images/partners/amazon.png" },
    { name: "Flipkart", url: "/images/partners/flipkart.png" },
    { name: "BigBasket", url: "/images/partners/bigbasket.png" },
    { name: "Grofers", url: "/images/partners/grofers.png" },
    { name: "Ola", url: "/images/partners/ola.png" },
    { name: "Uber", url: "/images/partners/uber.png" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary text-center">
            Get a Quote from Complete Solution Technology
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Achievements */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">Why Choose Us?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                <div className="text-2xl font-bold text-primary">20+</div>
                <div className="text-sm text-gray-600">Awards</div>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="flex flex-col items-center">
                <Building2 className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="h-8 w-8 text-red-500 mb-2" />
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Pan India Partners</div>
              </div>
            </div>
          </div>

          {/* Partner Logos */}
          <div className="bg-white p-6 rounded-lg border">
            <h4 className="text-lg font-semibold text-center mb-4">Our Trusted Partners</h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 items-center">
              {partnerLogos.map((partner, index) => (
                <div key={index} className="flex items-center justify-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <img 
                    src={partner.url} 
                    alt={partner.name}
                    className="max-h-8 max-w-16 object-contain grayscale hover:grayscale-0 transition-all"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      e.currentTarget.style.display = 'none';
                      const textSpan = document.createElement('span');
                      textSpan.textContent = partner.name;
                      textSpan.className = 'text-xs font-medium text-gray-600';
                      e.currentTarget.parentNode?.appendChild(textSpan);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quote Form */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-bold text-primary mb-6">Request Your Quote</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  name="name"
                  placeholder="Your Name *" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
                <Input 
                  name="email"
                  placeholder="Your Email *" 
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  name="phone"
                  placeholder="Your Phone *" 
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Input 
                  name="subject"
                  placeholder="Service Required" 
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                />
              </div>
              <Textarea
                name="address"
                placeholder="Your Complete Address *"
                value={formData.address}
                onChange={handleChange}
                required
                rows={2}
              />
              <Textarea 
                name="message"
                placeholder="Project Details / Requirements *" 
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required 
              />
              <div className="flex justify-between items-center pt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Free Consultation</Badge>
                  <Badge variant="secondary">24/7 Support</Badge>
                  <Badge variant="secondary">Quick Response</Badge>
                </div>
                <div className="space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="hover-scale" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Get Quote"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;