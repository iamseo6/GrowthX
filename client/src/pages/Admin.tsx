import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactSubmission, Lead, NewsletterSubscriber } from "@/lib/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, LogOut, Users, MessageSquare, Trash2, Mail } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

export default function AdminPage() {
  const { logoutMutation } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: submissions, isLoading: submissionsLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact"],
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: subscribers, isLoading: subscribersLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/newsletter"],
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
  });

  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/newsletter/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter"] });
    },
  });

  const handleDeleteLead = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the lead from ${name}? This cannot be undone.`)) {
      deleteLeadMutation.mutate(id);
    }
  };

  const handleDeleteContact = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the message from ${name}? This cannot be undone.`)) {
      deleteContactMutation.mutate(id);
    }
  };

  const handleDeleteSubscriber = (id: number, email: string) => {
    if (window.confirm(`Are you sure you want to delete ${email} from the newsletter? This cannot be undone.`)) {
      deleteSubscriberMutation.mutate(id);
    }
  };

  const isLoading = submissionsLoading || leadsLoading || subscribersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <Card className="glass-card border-white/10 bg-card/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-heading font-bold text-white">Admin Dashboard</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="border-white/10 hover:bg-white/5"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardHeader>
          <CardContent>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                    <p className="text-3xl font-bold text-white" data-testid="stat-leads">{leads?.length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Messages</p>
                    <p className="text-3xl font-bold text-white" data-testid="stat-contacts">{submissions?.length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Mail className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Newsletter Subscribers</p>
                    <p className="text-3xl font-bold text-white" data-testid="stat-subscribers">{subscribers?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="leads" className="w-full">
              <TabsList className="mb-6 bg-slate-800/50">
                <TabsTrigger value="leads" className="data-[state=active]:bg-primary" data-testid="tab-leads">
                  <Users className="h-4 w-4 mr-2" />
                  Leads ({leads?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-primary" data-testid="tab-contacts">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Messages ({submissions?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="newsletter" className="data-[state=active]:bg-primary" data-testid="tab-newsletter">
                  <Mail className="h-4 w-4 mr-2" />
                  Newsletter ({subscribers?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leads">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-muted-foreground font-semibold">Name</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Company</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Service</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Budget</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Timeline</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Contact</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads?.map((lead) => (
                        <TableRow key={lead.id} className="border-white/5 hover:bg-white/5 transition-colors" data-testid={`lead-row-${lead.id}`}>
                          <TableCell className="font-medium text-white whitespace-nowrap">
                            {lead.firstName} {lead.lastName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div>
                              <p className="font-medium text-white">{lead.companyName}</p>
                              <p className="text-xs text-muted-foreground">{lead.industry}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                              {lead.selectedService}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{lead.budgetRange}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{lead.timeline}</TableCell>
                          <TableCell className="text-muted-foreground">
                            <div>
                              <p>{lead.email}</p>
                              {lead.phone && <p className="text-xs">{lead.phone} {lead.preferWhatsApp === 'yes' && '(WhatsApp)'}</p>}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLead(lead.id, `${lead.firstName} ${lead.lastName}`)}
                              disabled={deleteLeadMutation.isPending}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              data-testid={`button-delete-lead-${lead.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!leads || leads.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-20 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <Users className="h-12 w-12 text-muted-foreground/30" />
                              <p className="text-lg font-medium">No leads yet</p>
                              <p className="text-sm">Leads from the Get Started funnel will appear here</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="contacts">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-muted-foreground font-semibold">Name</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Email</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Website</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Message</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Date</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions?.map((submission) => (
                        <TableRow key={submission.id} className="border-white/5 hover:bg-white/5 transition-colors" data-testid={`contact-row-${submission.id}`}>
                          <TableCell className="font-medium text-white whitespace-nowrap">
                            {submission.firstName} {submission.lastName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{submission.email}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {submission.website ? (
                              <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {submission.website.replace(/^https?:\/\//, '')}
                              </a>
                            ) : (
                              <span className="text-muted-foreground/50">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-md">
                            <p className="line-clamp-2">{submission.message}</p>
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {new Date(submission.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteContact(submission.id, `${submission.firstName} ${submission.lastName}`)}
                              disabled={deleteContactMutation.isPending}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              data-testid={`button-delete-contact-${submission.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!submissions || submissions.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <MessageSquare className="h-12 w-12 text-muted-foreground/30" />
                              <p className="text-lg font-medium">No messages yet</p>
                              <p className="text-sm">Contact form submissions will appear here</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="newsletter">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-muted-foreground font-semibold">Email</TableHead>
                        <TableHead className="text-muted-foreground font-semibold">Date Subscribed</TableHead>
                        <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers?.map((subscriber) => (
                        <TableRow key={subscriber.id} className="border-white/5 hover:bg-white/5 transition-colors" data-testid={`subscriber-row-${subscriber.id}`}>
                          <TableCell className="font-medium text-white">{subscriber.email}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {new Date(subscriber.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubscriber(subscriber.id, subscriber.email)}
                              disabled={deleteSubscriberMutation.isPending}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              data-testid={`button-delete-subscriber-${subscriber.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!subscribers || subscribers.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-20 text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                              <Mail className="h-12 w-12 text-muted-foreground/30" />
                              <p className="text-lg font-medium">No subscribers yet</p>
                              <p className="text-sm">Newsletter signups will appear here</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
