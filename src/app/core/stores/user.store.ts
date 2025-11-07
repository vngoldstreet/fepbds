import { signal } from '@angular/core';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: string;
}

export const userSignal = signal<User | null>(null);

export function setUser(user: User | null) {
  userSignal.set(user);
}

export function logout() {
  userSignal.set(null);
}

export function isLoggedInState(): boolean {
  return !!userSignal() && !!localStorage.getItem('access_token');
}
