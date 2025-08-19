import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-slate-100 to-slate-200 py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <motion.img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Professional team"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <motion.h1 
                  className="text-5xl font-bold mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Complete Solution Technology
                </motion.h1>
                <motion.p 
                  className="text-xl mb-8 max-w-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Your trusted partner in financial and business onboarding services
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 transform hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white py-12 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <motion.h3 
            className="text-center text-2xl font-semibold mb-8 text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Our Trusted Partners
          </motion.h3>
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            {["Paytm", "Airtel", "IndusInd Bank", "Kotak", "Zepto"].map((partner, index) => (
              <motion.div 
                key={partner}
                className={`font-bold text-2xl cursor-pointer transform hover:scale-110 transition-all duration-300 ${
                  index === 0 ? "text-blue-600" :
                  index === 1 ? "text-red-500" :
                  index === 2 ? "text-blue-800" :
                  index === 3 ? "text-red-600" :
                  "text-purple-600"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;