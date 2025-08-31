import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints } from "@/lib/api";
import { Bike, MapPin, Clock, Star, Shield, Zap } from "lucide-react";

interface DeliveryJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryJobModal = ({ isOpen, onClose }: DeliveryJobModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "delivery-rider",
    experience: "",
    coverLetter: "",
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For now, we'll submit without file upload
      // In production, you'd need to implement file upload to cloud storage
      const submitData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        experience: formData.experience,
        coverLetter: formData.coverLetter
      };

      await api.post(endpoints.jobApplications.submit, submitData);
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your delivery rider application and get back to you soon."
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        position: "delivery-rider",
        experience: "",
        coverLetter: "",
        resume: null
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: Clock, text: "Flexible Hours", color: "text-blue-500" },
    { icon: Star, text: "Competitive Pay", color: "text-yellow-500" },
    { icon: Shield, text: "Insurance Coverage", color: "text-green-500" },
    { icon: Zap, text: "Instant Payments", color: "text-purple-500" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary text-center flex items-center justify-center gap-2">
            <Bike className="h-6 w-6" />
            Join as Delivery Rider
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">Why Join Us?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <benefit.icon className={`h-8 w-8 ${benefit.color} mb-2`} />
                  <div className="text-sm font-medium">{benefit.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Earning Potential */}
          <div className="bg-white p-6 rounded-lg border border-primary/20">
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold text-primary mb-2">Earning Potential</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₹15,000+</div>
                  <div className="text-sm text-green-700">Monthly Income</div>
                </div>
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹500+</div>
                  <div className="text-sm text-blue-700">Daily Earnings</div>
                </div>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-purple-700">Work Flexibility</div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-bold text-primary mb-6">Application Form</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select onValueChange={(value) => setFormData({...formData, experience: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years (New to delivery)</SelectItem>
                      <SelectItem value="1-3">1-3 years (Some experience)</SelectItem>
                      <SelectItem value="3-5">3-5 years (Experienced rider)</SelectItem>
                      <SelectItem value="5+">5+ years (Expert rider)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV (Optional)</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFormData({...formData, resume: e.target.files?.[0] || null})}
                />
                <p className="text-xs text-muted-foreground">
                  Upload your resume in PDF, DOC, or DOCX format (Max 200KB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">Why do you want to join as a delivery rider?</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell us about your interest in becoming a delivery rider, your availability, and any relevant experience..."
                  rows={4}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Valid driving license
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Own vehicle (bike/scooter)
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Smartphone with GPS
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Age 18-50 years
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Good communication skills
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Local area knowledge
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Quick Onboarding</Badge>
                  <Badge variant="secondary">Same Day Start</Badge>
                  <Badge variant="secondary">Training Provided</Badge>
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
                    className="hover-scale bg-gradient-to-r from-blue-600 to-purple-600" 
                    disabled={isSubmitting}
                  >
                    <Bike className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Apply Now"}
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

export default DeliveryJobModal;