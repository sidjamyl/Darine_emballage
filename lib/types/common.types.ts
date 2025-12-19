/**
 * Common Type Definitions
 * 
 * Shared type definitions used across the application.
 */

/**
 * Supported languages
 */
export type Locale = 'fr' | 'ar';

/**
 * Tab types for admin panel
 */
export type AdminTab = 'orders' | 'products' | 'users';

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
