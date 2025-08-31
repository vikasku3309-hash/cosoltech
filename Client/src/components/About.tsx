import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Welcome to Complete Solution Technology
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Complete Solution Technology, your trusted partner in financial and business onboarding services. 
            We specialize in providing seamless solutions for digital payments, account openings, financial services, 
            and hiring support. Our team is committed to simplifying processes and enhancing business growth through 
            innovative and efficient strategies.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.h3 
              className="text-2xl font-bold text-primary mb-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Our Mission
            </motion.h3>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              Complete Solution Technology is to empower businesses and individuals by providing seamless, 
              reliable, and efficient financial and onboarding solutions.
            </motion.p>

            <motion.h3 
              className="text-2xl font-bold text-primary mb-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              Our Vision
            </motion.h3>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              We envision a future where financial and business services are easily accessible to everyone, 
              regardless of their background or location.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Business meeting"
              className="rounded-lg shadow-lg w-full hover:shadow-xl transition-shadow duration-300"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "20+", label: "Awards" },
            { number: "10+", label: "Year Experience" },
            { number: "50+", label: "Services" },
            { number: "1000+", label: "Professional Worker" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <motion.div 
                  className="text-3xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 1.8 + index * 0.1, duration: 0.5, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;