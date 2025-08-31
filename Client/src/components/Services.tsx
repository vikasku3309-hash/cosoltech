import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Building, Users, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import QuoteModal from "./QuoteModal";

const Services = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const servicesRef = useRef(null);
  const detailsRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const detailsInView = useInView(detailsRef, { once: true, margin: "-100px" });
  const services = [
    {
      icon: <CreditCard className="h-12 w-12 text-primary" />,
      title: "QR Onboarding Project",
      description: "We assist businesses and merchants in integrating QR-based payment solutions, ensuring smooth and secure transactions.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: <Building className="h-12 w-12 text-primary" />,
      title: "Account Opening Project",
      description: "We streamline the process of opening various types of accounts, making financial access easier for individuals and businesses.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Delivery Partners Hiring Project",
      description: "We help leading delivery platforms recruit reliable and skilled delivery partners.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: <Smartphone className="h-12 w-12 text-primary" />,
      title: "Demat Account Opening Project",
      description: "Simplified demat account opening services for investment and trading needs.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-50" ref={servicesRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={servicesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={servicesInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Why Choose Complete Solution Technology?
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            We provide comprehensive solutions for all your business needs
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={servicesInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.6 + index * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="text-center hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader>
                  <motion.div 
                    className="mx-auto mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </motion.div>
                  <motion.div 
                    className="mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {service.icon}
                  </motion.div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{service.description}</CardDescription>
                  <Button  onClick={() => setIsQuoteModalOpen(true)} variant="outline" className="hover:scale-105 transition-transform duration-300">Get Quote</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Services */}
        <div className="grid md:grid-cols-3 gap-8" ref={detailsRef}>
          {[
            {
              title: "Digital Payment Solutions",
              description: "We enable businesses to integrate seamless QR-based payment solutions, ensuring smooth and secure transactions.",
              items: ["• Paytm", "• PhonePe", "• Amazon QR", "• Tide QR Onboarding", "• WhatsApp Meta"]
            },
            {
              title: "Business & Financial Account Services",
              description: "We streamline account openings and provide financial support for individuals and businesses.",
              items: ["• Airtel Money", "• IndusInd Bank", "• Kotak 811", "• Jupiter", "• Federal Bank", "• Tide, Axis Bank", "• AU Small Finance Bank"]
            },
            {
              title: "Hiring & Business Growth Support",
              description: "We help businesses recruit skilled professionals and expand their market reach.",
              items: ["• Zepto, Uber, Ola", "• Zomato, Swiggy", "• Amazon, Meesho, Flipkart", "• Address Verification", "• Survey Projects", "• Bajaj SIP Project"]
            }
          ].map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={detailsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 1.4 + index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 h-full">
                <h3 className="text-xl font-bold text-primary mb-4">{section.title}</h3>
                <p className="text-muted-foreground mb-4">{section.description}</p>
                <ul className="space-y-2 text-sm">
                  {section.items.map((item, itemIndex) => (
                    <motion.li 
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={detailsInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1.6 + index * 0.2 + itemIndex * 0.1, duration: 0.4 }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

     

         {/* Quote Modal */}
         <QuoteModal 
          isOpen={isQuoteModalOpen} 
          onClose={() => setIsQuoteModalOpen(false)} 
        />
      </div>
    </section>
  );
};

export default Services;