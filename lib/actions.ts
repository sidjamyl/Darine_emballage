'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings() {
    try {
        const settings = await (prisma as any).siteSettings.findFirst();
        if (!settings) {
            // Create default settings if not exists
            return await (prisma as any).siteSettings.create({
                data: {
                    themeColor: '#D63384',
                },
            });
        }
        return settings;
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return { themeColor: '#D63384' };
    }
}

export async function updateSiteSettings(data: { themeColor: string }) {
    try {
        const first = await (prisma as any).siteSettings.findFirst();

        if (first) {
            await (prisma as any).siteSettings.update({
                where: { id: first.id },
                data: { themeColor: data.themeColor },
            });
        } else {
            await (prisma as any).siteSettings.create({
                data: { themeColor: data.themeColor },
            });
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating site settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
