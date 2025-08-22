export type UserRole = 'user' | 'coach';
export type RoleCandidate = 'user' | 'coach' | null;

type AuthState = {
  role: UserRole;
  isAuthenticated: boolean;
  userId?: string;
  coachId?: string;
  roleCandidate: RoleCandidate;
};

const AUTH_KEY = 'sb:auth';
const ROLE_CANDIDATE_KEY = 'sb:roleCandidate';

let currentAuth: AuthState = {
  role: 'user',
  isAuthenticated: false,
  roleCandidate: null
};

// Load from localStorage
export function initAuth(): AuthState {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      currentAuth = { ...currentAuth, ...JSON.parse(saved) };
    }
    
    // Load role candidate separately
    const candidate = localStorage.getItem(ROLE_CANDIDATE_KEY);
    currentAuth.roleCandidate = (candidate as RoleCandidate) || null;
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
  return currentAuth;
}

// Get current auth state
export function getAuth(): AuthState {
  return currentAuth;
}

// Set role and persist
export function setRole(role: UserRole): void {
  currentAuth = { ...currentAuth, role };
  saveAuth();
}

// Set role candidate (for signup flow only)
export function setRoleCandidate(candidate: RoleCandidate): void {
  currentAuth = { ...currentAuth, roleCandidate: candidate };
  if (candidate) {
    localStorage.setItem(ROLE_CANDIDATE_KEY, candidate);
  } else {
    localStorage.removeItem(ROLE_CANDIDATE_KEY);
  }
}

// Set authentication status
export function setAuthenticated(isAuthenticated: boolean, userId?: string, coachId?: string): void {
  currentAuth = { 
    ...currentAuth, 
    isAuthenticated, 
    userId, 
    coachId 
  };
  saveAuth();
}

// Save to localStorage
function saveAuth(): void {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(currentAuth));
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
}

// Clear auth state
export function clearAuth(): void {
  currentAuth = {
    role: 'user',
    isAuthenticated: false,
    roleCandidate: null
  };
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ROLE_CANDIDATE_KEY);
}

// Helper to determine home screen based on role
export function getHomeScreen(): 'home' | 'coach-home' {
  return currentAuth.role === 'coach' ? 'coach-home' : 'home';
}