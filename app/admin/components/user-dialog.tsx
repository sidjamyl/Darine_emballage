/**
 * User Dialog Component
 * 
 * Dialog for creating new user accounts.
 */

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserFormData } from '@/lib/types';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userForm: UserFormData;
  setUserForm: (form: UserFormData) => void;
  onSave: () => void;
}

export function UserDialog({
  open,
  onOpenChange,
  userForm,
  setUserForm,
  onSave
}: UserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Nom</Label>
            <Input
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Mot de passe</Label>
            <Input
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Rôle</Label>
            <Select
              value={userForm.role}
              onValueChange={(value) => setUserForm({ ...userForm, role: value as 'USER' | 'ADMIN' })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Utilisateur</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave} style={{ backgroundColor: '#F8A6B0' }}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
