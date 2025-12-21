'use client';

import { useLanguage } from '@/lib/language-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const { t, locale } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(t.contact.success);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error(t.common.error);
      }
    } catch (error) {
      toast.error(t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#383738' }}>
        {t.contact.title}
      </h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t.contact.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t.contact.name}</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">{t.contact.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">{t.contact.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="message">{t.contact.message}</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
                style={{ backgroundColor: 'var(--brand-pink)' }}
              >
                {isSubmitting ? t.common.loading : t.contact.send}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-4">
                <Phone className="h-6 w-6 mt-1" style={{ color: 'var(--brand-pink)' }} />
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#383738' }}>
                    {t.contact.phone}
                  </h3>
                  <p className="text-gray-600">+213 540153721</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <MessageSquare className="h-6 w-6 mt-1" style={{ color: 'var(--brand-pink)' }} />
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#383738' }}>
                    {t.contact.whatsapp}
                  </h3>
                  <p className="text-gray-600">+213 540153721</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 mt-1" style={{ color: 'var(--brand-pink)' }} />
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#383738' }}>
                    {t.contact.address}
                  </h3>
                  <p className="text-gray-600">
                    {locale === 'ar' ? 'الجزائر العاصمة، الجزائر' : 'Alger, Algérie'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#F1E5B4' }}>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3" style={{ color: '#383738' }}>
                {locale === 'ar' ? 'ساعات العمل' : 'Horaires d\'ouverture'}
              </h3>
              <div className="space-y-2 text-sm" style={{ color: '#383738' }}>
                <p>{locale === 'ar' ? 'السبت - الخميس: 8:00 - 18:00' : 'Samedi - Jeudi: 8h00 - 18h00'}</p>
                <p>{locale === 'ar' ? 'الجمعة: مغلق' : 'Vendredi: Fermé'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
