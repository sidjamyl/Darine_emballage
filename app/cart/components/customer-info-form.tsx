/**
 * Customer Info Form Component
 * 
 * Form for collecting customer delivery information.
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerInfo, Wilaya, Municipality } from '@/lib/types';

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  wilayas: Wilaya[];
  municipalities: Municipality[];
  t: any;
}

export function CustomerInfoForm({
  customerInfo,
  setCustomerInfo,
  wilayas,
  municipalities,
  t
}: CustomerInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.customer.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{t.customer.fullName}</Label>
          <Input
            value={customerInfo.fullName}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, fullName: e.target.value })
            }
            className="mt-2"
          />
        </div>

        <div>
          <Label>{t.customer.phone}</Label>
          <Input
            type="tel"
            value={customerInfo.phone}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, phone: e.target.value })
            }
            className="mt-2"
          />
        </div>

        <div>
          <Label>{t.customer.email}</Label>
          <Input
            type="email"
            value={customerInfo.email}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, email: e.target.value })
            }
            className="mt-2"
          />
        </div>

        <div>
          <Label>{t.customer.address}</Label>
          <Textarea
            value={customerInfo.address}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, address: e.target.value })
            }
            rows={3}
            className="mt-2"
          />
        </div>

        <div>
          <Label>{t.customer.wilaya}</Label>
          <Select
            value={customerInfo.wilayaId}
            onValueChange={(value) =>
              setCustomerInfo({ ...customerInfo, wilayaId: value })
            }
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder={t.customer.selectWilaya} />
            </SelectTrigger>
            <SelectContent>
              {wilayas.map((wilaya, index) => (
                <SelectItem key={`${wilaya.wilayaID }-${index}`} value={wilaya.wilayaID}>
                  {wilaya.wilayaLabel }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t.customer.municipality}</Label>
          <Select
            value={customerInfo.municipalityId}
            onValueChange={(value) =>
              setCustomerInfo({ ...customerInfo, municipalityId: value })
            }
            disabled={!customerInfo.wilayaId}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder={t.customer.selectMunicipality} />
            </SelectTrigger>
            <SelectContent>
              {municipalities.map((municipality, index) => (
                <SelectItem key={`${municipality.Id}-${index}`} value={municipality.Id}>
                  {municipality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>{t.customer.deliveryType}</Label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="home"
                checked={customerInfo.deliveryType === 'home'}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    deliveryType: e.target.value as 'home',
                  })
                }
              />
              {t.customer.home}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="stopdesk"
                checked={customerInfo.deliveryType === 'stopdesk'}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    deliveryType: e.target.value as 'stopdesk',
                  })
                }
              />
              {t.customer.stopdesk}
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
