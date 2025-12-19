/**
 * Confirm Dialog Component
 * 
 * Generic confirmation dialog for order actions.
 */

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'confirm' | 'cancel';
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  action,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === 'confirm' ? 'Confirmer la commande' : 'Annuler la commande'}
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir {action === 'confirm' ? 'confirmer' : 'annuler'} cette commande ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Non
          </Button>
          <Button
            onClick={onConfirm}
            style={{
              backgroundColor: action === 'confirm' ? '#F8A6B0' : undefined,
            }}
            variant={action === 'cancel' ? 'destructive' : 'default'}
          >
            Oui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
