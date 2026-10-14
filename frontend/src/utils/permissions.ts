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

  // 1. Admin: Full Access to ALL modules across the entire platform
  if (r === 'admin') {
    return true;
  }

  // 2. Government Officer & Sub-Registrar:
  // Permitted: Verification, Audit, Institutional Portals (Review Desk)
  // Denied: Citizen Owner registration/minting, Consumer Marketplace
  if (r === 'officer' || r === 'registrar') {
    if (module === 'owner' || module === 'buyer') {
      return false;
    }
    return true;
  }

  // 3. Buyer / Investor:
  // Permitted: Marketplace, Verification (Document & QR check), General Workspace (Properties, Transfers, Deeds)
  // Denied: Owner modules (Register Property, Tokenization), Institutional Portals, Audit Trail / Fraud Console
  if (r === 'buyer') {
    if (
      module === 'owner' ||
      module === 'institutional' ||
      module === 'audit'
    ) {
      return false;
    }
    return true;
  }

  // 4. Property Owner / Citizen:
  // Permitted: Owner modules (Register Property, Tokenization Hub), Verification (Document & QR check), General Workspace
  // Denied: Buyer Marketplace, Institutional Portals, Audit Trail / Fraud Console
  if (r === 'owner') {
    if (
      module === 'buyer' ||
      module === 'institutional' ||
      module === 'audit'
    ) {
      return false;
    }
    return true;
  }

  // 5. Auditor persona:
  if (r === 'auditor') {
    if (module === 'audit' || module === 'verification' || module === 'other') {
      return true;
    }
    return false;
  }

  // Fallback safe default
  if (
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
