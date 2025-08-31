import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  Users, 
  FileText, 
  Mail, 
  Clock, 
  LogOut, 
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar,
  Reply,
  MessageSquare,
  Files,
  Download,
  Trash2,
  Search,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, endpoints } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import ReplyModal from "@/components/ReplyModal";

interface DashboardStats {
  totalContacts: number;
  newContacts: number;
  totalApplications: number;
  pendingApplications: number;
}

interface RecentActivity {
  contacts: any[];
  applications: any[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [contacts, setContacts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileStats, setFileStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fileSearch, setFileSearch] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [replyModal, setReplyModal] = useState<{
    isOpen: boolean;
    type: 'contact' | 'application';
    item: any;
  }>({
    isOpen: false,
    type: 'contact',
    item: null
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const [dashboardResponse, contactsResponse, applicationsResponse] = await Promise.all([
        api.get(endpoints.admin.dashboardStats),
        api.get(endpoints.admin.contacts + '?limit=20'),
        api.get(endpoints.admin.applications + '?limit=20')
      ]);

      setStats(dashboardResponse.data.stats);
      setRecentActivity(dashboardResponse.data.recentActivity);
      setContacts(contactsResponse.data.contacts);
      setApplications(applicationsResponse.data.applications);
      
      // Fetch files and file stats
      await fetchFiles();
      await fetchFileStats();
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/admin/login');
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      await api.patch(endpoints.contact.updateStatus(id), { status });
      
      fetchDashboardData(); // Refresh data
      toast({
        title: "Success",
        description: "Contact status updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive"
      });
    }
  };

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      await api.patch(endpoints.jobApplications.updateStatus(id), { status });
      
      fetchDashboardData(); // Refresh data
      toast({
        title: "Success",
        description: "Application status updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const openReplyModal = (type: 'contact' | 'application', item: any) => {
    setReplyModal({
      isOpen: true,
      type,
      item
    });
  };

  const closeReplyModal = () => {
    setReplyModal({
      isOpen: false,
      type: 'contact',
      item: null
    });
  };

  const fetchFiles = async () => {
    try {
      const searchParam = fileSearch ? `&search=${encodeURIComponent(fileSearch)}` : '';
      const response = await api.get(`${endpoints.admin.files}?limit=20${searchParam}`);
      setFiles(response.data.files);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive"
      });
    }
  };

  const fetchFileStats = async () => {
    try {
      const response = await api.get(endpoints.admin.fileStats);
      setFileStats(response.data);
    } catch (error) {
      console.error('Failed to fetch file stats:', error);
    }
  };

  const downloadFile = async (fileId: string, filename: string) => {
    try {
      const response = await api.get(`${endpoints.admin.files}/${fileId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "File downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      await api.delete(`${endpoints.admin.files}/${fileId}`);
      await fetchFiles(); // Refresh file list
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
      
      toast({
        title: "Success",
        description: "File deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const bulkDeleteFiles = async () => {
    try {
      await api.delete(`${endpoints.admin.files}/bulk`, {
        data: { fileIds: selectedFiles }
      });
      await fetchFiles(); // Refresh file list
      setSelectedFiles([]);
      
      toast({
        title: "Success",
        description: `${selectedFiles.length} files deleted successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete files",
        variant: "destructive"
      });
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': case 'pending': return 'default';
      case 'read': case 'reviewing': return 'secondary';
      case 'replied': case 'shortlisted': return 'default';
      case 'archived': case 'rejected': return 'destructive';
      case 'hired': return 'default';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Complete Solution Technology</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalContacts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.newContacts || 0} new this month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.pendingApplications || 0} pending review
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.newContacts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingApplications || 0}</div>
                <p className="text-xs text-muted-foreground">
                  In review process
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contacts">Contact Messages</TabsTrigger>
            <TabsTrigger value="applications">Job Applications</TabsTrigger>
            <TabsTrigger value="files">File Management</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>
                  Manage and respond to customer inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contacts.map((contact: any) => (
                    <motion.div
                      key={contact._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{contact.name}</h4>
                          <p className="text-sm text-gray-500">{contact.email}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(contact.status)}>
                          {contact.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">{contact.subject}</p>
                      <p className="text-sm text-gray-600 mb-3">{contact.message}</p>
                      
                      {/* Show reply history if any */}
                      {contact.replies && contact.replies.length > 0 && (
                        <div className="mb-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                          <p className="text-sm font-medium text-blue-800 mb-2">
                            Reply History ({contact.replies.length} replies)
                          </p>
                          {contact.replies.slice(-2).map((reply: any, index: number) => (
                            <div key={index} className="text-sm text-blue-700 mb-1">
                              <span className="font-medium">{reply.sentAt ? new Date(reply.sentAt).toLocaleDateString() : 'Unknown'}:</span> {reply.message.substring(0, 100)}...
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateContactStatus(contact._id, 'read')}
                          >
                            Mark as Read
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openReplyModal('contact', contact)}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateContactStatus(contact._id, 'replied')}
                          >
                            Mark as Replied
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>
                  Review and manage job applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app: any) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{app.fullName}</h4>
                          <p className="text-sm text-gray-500">{app.email}</p>
                          <p className="text-sm text-gray-500">{app.phone}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm"><strong>Position:</strong> {app.position}</p>
                        <p className="text-sm"><strong>Experience:</strong> {app.experience}</p>
                      </div>
                      {app.coverLetter && (
                        <p className="text-sm text-gray-600 mb-3">{app.coverLetter}</p>
                      )}
                      
                      {/* Show reply history if any */}
                      {app.replies && app.replies.length > 0 && (
                        <div className="mb-3 p-3 bg-green-50 rounded border-l-4 border-green-400">
                          <p className="text-sm font-medium text-green-800 mb-2">
                            Response History ({app.replies.length} responses)
                          </p>
                          {app.replies.slice(-2).map((reply: any, index: number) => (
                            <div key={index} className="text-sm text-green-700 mb-1">
                              <span className="font-medium">{reply.sentAt ? new Date(reply.sentAt).toLocaleDateString() : 'Unknown'}:</span> {reply.message.substring(0, 100)}...
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(app._id, 'reviewing')}
                          >
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openReplyModal('application', app)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                          >
                            Shortlist
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <div className="space-y-4">
              {/* File Stats Cards */}
              {fileStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                      <Files className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{fileStats.overall.totalFiles}</div>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileStats.overall.totalSize)} total storage
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Size</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatFileSize(fileStats.overall.avgSize || 0)}</div>
                      <p className="text-xs text-muted-foreground">
                        Per file
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Selected</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedFiles.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Files selected
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* File Management */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>File Management</CardTitle>
                      <CardDescription>
                        Manage uploaded files, download and delete as needed
                      </CardDescription>
                    </div>
                    {selectedFiles.length > 0 && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={bulkDeleteFiles}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Selected ({selectedFiles.length})
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search and Filters */}
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search files..."
                          value={fileSearch}
                          onChange={(e) => setFileSearch(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <Button onClick={fetchFiles} variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {/* Files List */}
                  <div className="space-y-2">
                    {files.map((file: any) => (
                      <motion.div
                        key={file._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file._id)}
                              onChange={() => toggleFileSelection(file._id)}
                              className="w-4 h-4"
                            />
                            <div>
                              <h4 className="font-medium">{file.originalName}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{formatFileSize(file.size)}</span>
                                <span>{file.contentType}</span>
                                <span>By: {file.uploadedBy}</span>
                                <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadFile(file._id, file.originalName)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteFile(file._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        {file.description && (
                          <p className="text-sm text-gray-600 mt-2 ml-8">{file.description}</p>
                        )}
                        {file.tags && file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2 ml-8">
                            {file.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                    {files.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Files className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No files found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reply Modal - Only render when needed */}
      {replyModal.isOpen && replyModal.item && (
        <ReplyModal
          isOpen={replyModal.isOpen}
          onClose={closeReplyModal}
          type={replyModal.type}
          item={replyModal.item}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default AdminDashboard;