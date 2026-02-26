
import { User } from '../types';
import { supabase } from './supabase';
import { storageService } from './storage';
import { logger } from './logger';

const AUTH_KEY = 'styleswap_user_session';

export const authService = {
  async signup(email: string, password?: string, fullName?: string): Promise<User> {
    try {
      if (!password) throw new Error("Password is required for signup");
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Signup failed - please check if user already exists.");

      // Initialize bonus credits for new user
      const existingCredits = await storageService.getUserCredits(email);
      if (existingCredits === 0) {
        await storageService.addCredits(email, 5); 
      }

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        isLoggedIn: true,
        credits: 5,
        full_name: fullName || authData.user.user_metadata?.full_name
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    } catch (err: any) {
      logger.error('Auth', 'Signup failed', err);
      throw err;
    }
  },

  async login(email: string, password?: string): Promise<User> {
    try {
      if (!password) throw new Error("Password is required for login");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          throw new Error("Incorrect email or password. Please try again or sign up if you don't have an account.");
        }
        throw error;
      }
      if (!data.user) throw new Error("Login failed");

      const credits = await storageService.getUserCredits(email);
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        isLoggedIn: true,
        credits,
        full_name: data.user.user_metadata?.full_name
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    } catch (err: any) {
      logger.error('Auth', 'Login failed', err);
      throw err;
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (err: any) {
      logger.error('Auth', 'Password reset failed', err);
      throw err;
    }
  },

  async handleAuthChange(sessionUser: any): Promise<User | null> {
    if (!sessionUser) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }

    const email = sessionUser.email!;
    let credits = await storageService.getUserCredits(email);
    
    // Check if it's their first time login to give bonus
    if (credits === 0) {
      await storageService.addCredits(email, 5);
      credits = 5;
    }

    const user: User = {
      id: sessionUser.id,
      email: email,
      isLoggedIn: true,
      credits,
      full_name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    if (!data) return null;
    return JSON.parse(data);
  },

  async refreshUserCredits(): Promise<number> {
    const user = this.getCurrentUser();
    if (!user) return 0;
    const credits = await storageService.getUserCredits(user.email);
    user.credits = credits;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return credits;
  }
};
