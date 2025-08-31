import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints } from "@/lib/api";
import { X, Paperclip, FileText, Send, Loader2 } from "lucide-react";

interface Attachment {
  filename: string;
  url: string;
  contentType: string;
  size: number;
}

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'contact' | 'application';
  item: any;
  onSuccess: () => void;
}

const ReplyModal = ({ isOpen, onClose, type, item, onSuccess }: ReplyModalProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB general limit
      
      // Special validation for PDFs (200KB limit)
      if (file.type === 'application/pdf') {
        const fileSizeInKB = file.size / 1024;
        if (fileSizeInKB > 200) {
          toast({
            title: "PDF file too large",
            description: `${file.name} is ${fileSizeInKB.toFixed(2)}KB. PDF files must be under 200KB.`,
            variant: "destructive"
          });
          return false;
        }
      } else if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (attachments.length + validFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "Maximum 5 files allowed",
        variant: "destructive"
      });
      return;
    }

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a reply message",
        variant: "destructive"
      });
      return;
    }

    if (!item || !item._id) {
      toast({
        title: "Error",
        description: "Invalid item data",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', message);
      
      if (type === 'application' && status) {
        formData.append('status', status);
      }

      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const endpoint = type === 'contact' 
        ? endpoints.contact.updateStatus(item._id).replace('/status', '/reply')
        : endpoints.jobApplications.updateStatus(item._id).replace('/status', '/reply');

      await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Success",
        description: "Reply sent successfully"
      });

      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Send reply error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reply",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setAttachments([]);
    setStatus("");
    onClose();
  };

  const getStatusOptions = () => {
    if (type === 'contact') {
      return [
        { value: 'new', label: 'New' },
        { value: 'read', label: 'Read' },
        { value: 'replied', label: 'Replied' },
        { value: 'archived', label: 'Archived' }
      ];
    } else {
      return [
        { value: 'pending', label: 'Pending' },
        { value: 'reviewing', label: 'Reviewing' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'hired', label: 'Hired' }
      ];
    }
  };

  // Don't render if item is null or undefined, or if modal is not open
  if (!isOpen || !item) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Reply to {type === 'contact' ? 'Contact Message' : 'Job Application'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Message */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Original Message</h4>
            <div className="space-y-2">
              <p><strong>From:</strong> {type === 'contact' ? (item.name || 'N/A') : (item.fullName || 'N/A')}</p>
              <p><strong>Email:</strong> {item.email || 'N/A'}</p>
              {type === 'contact' && (
                <p><strong>Subject:</strong> {item.subject || 'N/A'}</p>
              )}
              {type === 'application' && (
                <>
                  <p><strong>Position:</strong> {item.position || 'N/A'}</p>
                  <p><strong>Experience:</strong> {item.experience || 'N/A'}</p>
                </>
              )}
              <div>
                <strong>Message:</strong>
                <p className="mt-1 text-gray-600">{type === 'contact' ? (item.message || 'No message') : (item.coverLetter || 'No cover letter')}</p>
              </div>
            </div>
          </div>

          {/* Reply Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Reply Message *</Label>
            <Textarea
              id="message"
              placeholder="Enter your reply message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          {/* Status Update (for job applications) */}
          {type === 'application' && (
            <div className="space-y-2">
              <Label htmlFor="status">Update Status (Optional)</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {getStatusOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* File Attachments */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachments.length >= 5}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Add Files
                </Button>
                <span className="text-xs text-gray-500">
                  PDF files limited to 200KB
                </span>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.zip"
                onChange={handleFileSelect}
                className="hidden"
              />

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    {attachments.length}/5 files selected
                  </p>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {formatFileSize(file.size)}
                        </Badge>
                        {file.type === 'application/pdf' && (
                          <Badge 
                            variant={file.size / 1024 > 200 ? "destructive" : "default"} 
                            className="text-xs"
                          >
                            PDF
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyModal;
