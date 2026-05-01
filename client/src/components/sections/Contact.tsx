import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSubmissionSchema, type InsertContactSubmission } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function Contact() {
  const { toast } = useToast();
  const { t, isRTL, language } = useLanguage();
  
  const form = useForm<InsertContactSubmission>({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      website: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit form");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("contact.success"),
        description: t("contact.successDesc"),
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactSubmission) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            {t("contact.title")} <span className="text-primary">{t("contact.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("contact.subtitle")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="glass-card border-white/10">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.firstName")}</label>
                    <Input 
                      {...form.register("firstName")}
                      placeholder={isRTL ? "أحمد" : "John"}
                      className="bg-white/5 border-white/10 h-12"
                      data-testid="input-firstName" 
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.lastName")}</label>
                    <Input 
                      {...form.register("lastName")}
                      placeholder={isRTL ? "محمد" : "Doe"}
                      className="bg-white/5 border-white/10 h-12"
                      data-testid="input-lastName" 
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-xs text-destructive">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.email")}</label>
                    <Input 
                      {...form.register("email")}
                      type="email" 
                      placeholder={isRTL ? "ahmed@company.com" : "john@company.com"}
                      className="bg-white/5 border-white/10 h-12"
                      data-testid="input-email" 
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("contact.website")}</label>
                    <Input 
                      {...form.register("website")}
                      type="url" 
                      placeholder="https://yourcompany.com" 
                      className="bg-white/5 border-white/10 h-12"
                      data-testid="input-website" 
                    />
                    {form.formState.errors.website && (
                      <p className="text-xs text-destructive">{form.formState.errors.website.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("contact.message")}</label>
                  <Textarea 
                    {...form.register("message")}
                    placeholder={t("contact.messagePlaceholder")}
                    className="bg-white/5 border-white/10 min-h-[150px]"
                    data-testid="textarea-message" 
                  />
                  {form.formState.errors.message && (
                    <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <Button 
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-12 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  data-testid="button-submit"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin ltr:mr-2 rtl:ml-2" />
                      {t("contact.sending")}
                    </>
                  ) : (
                    t("contact.submit")
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
