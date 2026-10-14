import { authService } from '../services/authService';

export type AppModule =
  | 'verification'
  | 'audit'
  | 'institutional'
  | 'buyer'
  | 'owner'
  | 'other';

/**
 * Returns the active user role, prioritizing logged-in user profile,
 * falling back to Web3 wallet persona.
 */
export const getActiveRole = (walletRole?: string): string => {
  const user = authService.getUser();
  if (user?.role) {
    return user.role.toLowerCase();
  }
  if (walletRole) {
    return walletRole.toLowerCase();
  }
  return 'owner';
};

/**
 * Implements the Role-Permission Matrix:
 *
 * | Module                | Admin       | Government Officer | Buyer   | Owner   |
 * |-----------------------|-------------|--------------------|---------|---------|
 * | Verification          | Full Access | Allowed            | Denied  | Denied  |
 * | Audit                 | Full Access | Allowed            | Denied  | Denied  |
 * | Institutional Portals | Full Access | Allowed            | Denied  | Denied  |
 * | Buyer Modules         | Full Access | As authorized      | Allowed | Denied  |
 * | Owner Modules         | Full Access | As authorized      | Denied  | Allowed |
 * | All Other Modules     | Full Access | As authorized      | Allowed | Allowed |
 */
export const hasModulePermission = (module: AppModule, role: string): boolean => {
  const r = (role || '').trim().toLowerCase();

  // 1. Admin: Full Access to all modules across the application
  if (r === 'admin') {
    return true;
  }

  // 2. Government Officer & Registrar:
  // Strictly permitted ONLY to Verification, Audit, and Institutional Portals
  if (r === 'officer' || r === 'registrar') {
    return (
      module === 'verification' ||
      module === 'audit' ||
      module === 'institutional'
    );
  }

  // 3. Buyer:
  if (r === 'buyer') {
    // Strictly Denied: Verification, Audit, Institutional Portals, Owner Modules
    if (
      module === 'verification' ||
      module === 'audit' ||
      module === 'institutional' ||
      module === 'owner'
    ) {
      return false;
    }
    // Allowed: Buyer modules, other modules
    return true;
  }

  // 4. Owner:
  if (r === 'owner') {
    // Strictly Denied: Verification, Audit, Institutional Portals, Buyer Modules
    if (
      module === 'verification' ||
      module === 'audit' ||
      module === 'institutional' ||
      module === 'buyer'
    ) {
      return false;
    }
    // Allowed: Owner modules, other modules
    return true;
  }

  // Auditor persona
  if (r === 'auditor') {
    if (module === 'audit' || module === 'verification') {
      return true;
    }
    return false;
  }

  // Default fallback
  if (
    module === 'verification' ||
    module === 'audit' ||
    module === 'institutional'
  ) {
    return false;
  }

  return true;
};

export const getModuleName = (module: AppModule): string => {
  switch (module) {
    case 'verification':
      return 'Document Verification & Forensics';
    case 'audit':
      return 'Audit Trail & Event Streams';
    case 'institutional':
      return 'Institutional & Government Registrar Portals';
    case 'buyer':
      return 'Marketplace & Buyer Modules';
    case 'owner':
      return 'Property Registration & Tokenization Hub';
    default:
      return 'Module';
  }
};
