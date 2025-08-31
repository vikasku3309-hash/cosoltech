import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bike, MapPin, Clock, Star, Shield, Zap, Users, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import DeliveryJobModal from "@/components/DeliveryJobModal";

const DeliveryRiders = () => {
  const benefitsRef = useRef(null);
  const statsRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const benefits = [
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work on your own schedule with complete flexibility"
    },
    {
      icon: Star,
      title: "Competitive Pay",
      description: "Earn attractive wages with performance bonuses"
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "Comprehensive insurance and safety protection"
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Get paid instantly after each delivery"
    }
  ];

  const requirements = [
    "Valid driving license",
    "Own vehicle (bike/scooter)",
    "Smartphone with GPS",
    "Age 18-50 years",
    "Good communication skills",
    "Local area knowledge"
  ];

  const stats = [
    { number: "1000+", label: "Active Riders" },
    { number: "50+", label: "Cities Covered" },
    { number: "10K+", label: "Daily Deliveries" },
    { number: "4.8", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Badge className="mb-4">Join Our Team</Badge>
                </motion.div>
                <motion.h1 
                  className="text-5xl font-bold text-primary mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Become a Delivery Rider
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Join thousands of riders earning good money with flexible hours. 
                  Be your own boss and start earning today!
                </motion.p>
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Button 
                    size="lg" 
                    className="hover:scale-105 transition-transform duration-300"
                    onClick={() => setIsJobModalOpen(true)}
                  >
                    <Bike className="mr-2 h-5 w-5" />
                    Join Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="hover:scale-105 transition-transform duration-300"
                    onClick={() => {
                      document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 hover:shadow-xl transition-shadow duration-300">
                  <div className="text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Bike className="h-16 w-16 text-primary mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">Start Earning Today!</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-2xl font-bold text-primary">₹15,000+</p>
                        <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-2xl font-bold text-primary">24/7</p>
                        <p className="text-sm text-muted-foreground">Flexibility</p>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background" ref={statsRef}>
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-4xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    animate={statsInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: "spring" }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-muted/30" ref={benefitsRef}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.h2 
                className="text-4xl font-bold text-primary mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={benefitsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Why Ride With Us?
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Enjoy amazing benefits and grow your income with our platform
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={benefitsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <benefit.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="animate-fade-in">
                <h2 className="text-4xl font-bold text-primary mb-6">Requirements</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Simple requirements to get started. Join our team and start earning immediately!
                </p>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-4"></div>
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Card className="p-8 animate-scale-in">
                <div className="text-center mb-6">
                  <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Quick Application Process</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">1</div>
                    <span>Submit your application online</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">2</div>
                    <span>Complete quick verification</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">3</div>
                    <span>Start delivering and earning!</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 hover-scale"
                  onClick={() => setIsJobModalOpen(true)}
                >
                  Apply Now
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center animate-fade-in">
            <Trophy className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Join Successful Riders</h2>
            <p className="text-xl mb-8 opacity-90">
              Thousands of riders have already transformed their lives with us. You could be next!
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="hover-scale"
              onClick={() => setIsJobModalOpen(true)}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Delivery Job Application Modal */}
      <DeliveryJobModal 
        isOpen={isJobModalOpen} 
        onClose={() => setIsJobModalOpen(false)} 
      />
    </div>
  );
};

export default DeliveryRiders;