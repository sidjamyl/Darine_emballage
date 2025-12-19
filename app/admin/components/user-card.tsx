/**
 * User Card Component
 * 
 * Displays a user account in the admin panel with delete action.
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { User } from '@/lib/types';

interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">{user.name || user.email}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <span
              className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                user.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {user.role}
            </span>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
