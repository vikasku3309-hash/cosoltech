import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Users, 
  TrendingUp, 
  Lightbulb, 
  Globe, 
  Award,
  CheckCircle,
  BarChart3,
  Rocket,
  Heart,
  Shield,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const WhatWeDo = () => {
  const servicesRef = useRef(null);
  const valuesRef = useRef(null);
  const achievementsRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const achievementsInView = useInView(achievementsRef, { once: true, margin: "-100px" });
  const services = [
    {
      icon: Target,
      title: "Strategic Marketing",
      description: "We develop comprehensive marketing strategies that align with your business goals and drive measurable results.",
      features: ["Market Research", "Brand Positioning", "Campaign Planning", "ROI Optimization"]
    },
    {
      icon: Users,
      title: "Customer Engagement",
      description: "Build meaningful relationships with your customers through personalized engagement strategies.",
      features: ["Customer Journey Mapping", "Loyalty Programs", "Community Building", "Feedback Management"]
    },
    {
      icon: TrendingUp,
      title: "Growth Solutions",
      description: "Accelerate your business growth with data-driven solutions and innovative approaches.",
      features: ["Performance Analytics", "Conversion Optimization", "Sales Funnel Design", "Growth Hacking"]
    },
    {
      icon: Globe,
      title: "Digital Transformation",
      description: "Transform your business with cutting-edge digital solutions and modern technologies.",
      features: ["Digital Strategy", "Technology Integration", "Process Automation", "Digital Innovation"]
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer-Centric",
      description: "We put our clients' success at the heart of everything we do."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly innovate to deliver cutting-edge solutions."
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "You can count on us to deliver consistent, high-quality results."
    },
    {
      icon: Zap,
      title: "Agility",
      description: "We adapt quickly to market changes and new opportunities."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Analysis",
      description: "We start by understanding your business, market, and objectives through comprehensive analysis."
    },
    {
      step: "02",
      title: "Strategy Development",
      description: "Based on our findings, we develop a customized strategy tailored to your specific needs."
    },
    {
      step: "03",
      title: "Implementation",
      description: "We execute the strategy with precision, using the latest tools and best practices."
    },
    {
      step: "04",
      title: "Monitor & Optimize",
      description: "We continuously monitor performance and optimize for better results and ROI."
    }
  ];

  const achievements = [
    { number: "500+", label: "Successful Projects" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "5+", label: "Years Experience" },
    { number: "50+", label: "Team Members" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Badge className="mb-4">What We Do</Badge>
              </motion.div>
              <motion.h1 
                className="text-5xl font-bold text-primary mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Transforming Businesses Through Innovation
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                We are a full-service marketing and business solutions company dedicated to helping 
                businesses grow, innovate, and succeed in today's competitive landscape.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <h2 className="text-4xl font-bold text-primary mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  To empower businesses of all sizes with innovative marketing solutions and strategic guidance 
                  that drive sustainable growth and long-term success.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-3" />
                    <span>Deliver exceptional value to our clients</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-3" />
                    <span>Foster innovation and creativity</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-3" />
                    <span>Build lasting partnerships</span>
                  </div>
                </div>
              </div>
              <div className="animate-scale-in">
                <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <Rocket className="h-16 w-16 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To be the leading provider of innovative business solutions, 
                    helping companies navigate the digital landscape and achieve extraordinary results.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-muted/30" ref={servicesRef}>
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
                Our Core Services
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Comprehensive solutions designed to address every aspect of your business growth
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={servicesInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="p-8 hover:shadow-xl transition-all duration-300 h-full">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <service.icon className="h-12 w-12 text-primary mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-primary mb-4">Our Process</h2>
              <p className="text-lg text-muted-foreground">
                A proven methodology that ensures successful outcomes for every project
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <Card key={index} className="p-6 text-center hover-scale animate-scale-in">
                  <div className="text-4xl font-bold text-primary mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl font-bold text-primary mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide our work and define our company culture
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 text-center hover-scale animate-scale-in">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 bg-background" ref={achievementsRef}>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={achievementsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.h2 
                className="text-4xl font-bold text-primary mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={achievementsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Our Achievements
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={achievementsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Numbers that reflect our commitment to excellence and client success
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div 
                  key={index} 
                  className="text-center"
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={achievementsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-5xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    animate={achievementsInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5, type: "spring" }}
                  >
                    {achievement.number}
                  </motion.div>
                  <div className="text-muted-foreground">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center animate-fade-in">
            <Award className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Let's work together to unlock your business potential and achieve extraordinary results.
            </p>
            <div className="flex justify-center gap-4">
              <BarChart3 className="h-6 w-6" />
              <span className="text-lg">Partner with us today and see the difference!</span>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default WhatWeDo;