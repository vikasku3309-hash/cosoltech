import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints } from "@/lib/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
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
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message. Please try again.",
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

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-primary mb-4">Contact Us</h2>
          <p className="text-lg text-muted-foreground">Get in touch with our team for any queries or assistance</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6">Get In Touch</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-muted-foreground">+91 7860552888</p>
                  <p className="text-muted-foreground">+91 7860551888</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">info.cosoltech@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Office Address</p>
                  <p className="text-muted-foreground">SHEELA Enclave</p>
                  <p className="text-muted-foreground">Zuarinagar, GOA 403726</p>
                  <div className="mt-4">
                    <p className="font-semibold">Complete Solution Technology</p>
                    <p className="text-muted-foreground">370-Naka Hindola</p>
                    <p className="text-muted-foreground">Lucknow, UP - 226004</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold">Registered Office</p>
                    <p className="text-muted-foreground">S-25 Rampur Bhagan</p>
                    <p className="text-muted-foreground">Ayodhya - 224001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-primary mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  name="name"
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
                <Input 
                  name="email"
                  placeholder="Your Email" 
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <Input 
                name="phone"
                placeholder="Your Phone (Optional)" 
                value={formData.phone}
                onChange={handleChange}
              />
              <Input 
                name="subject"
                placeholder="Subject" 
                value={formData.subject}
                onChange={handleChange}
                required 
              />
              <Textarea 
                name="message"
                placeholder="Your Message" 
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required 
              />
              <Button 
                type="submit" 
                className="w-full hover-scale" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;