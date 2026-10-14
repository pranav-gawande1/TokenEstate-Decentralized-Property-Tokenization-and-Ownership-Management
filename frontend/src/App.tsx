import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthGuard } from './components/auth/AuthGuard';
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute';
import { RoleGuard } from './components/auth/RoleGuard';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { AboutPage } from './pages/marketing/AboutPage';
import { FeaturesPage } from './pages/marketing/FeaturesPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { PropertiesListPage } from './pages/properties/PropertiesListPage';
import { PropertyRegisterPage } from './pages/properties/PropertyRegisterPage';
import { PropertyDetailsPage } from './pages/properties/PropertyDetailsPage';
import { DocumentVerificationPage } from './pages/verification/DocumentVerificationPage';
import { QRVerificationPage } from './pages/verification/QRVerificationPage';
import { TokenizationHubPage } from './pages/tokenization/TokenizationHubPage';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { TransfersPage } from './pages/transfers/TransfersPage';
import { TransferDetailsPage } from './pages/transfers/TransferDetailsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { DocumentDetailsPage } from './pages/documents/DocumentDetailsPage';
import { AuditTrailPage } from './pages/audit/AuditTrailPage';
import { TransactionDetailsPage } from './pages/transactions/TransactionDetailsPage';
import { GovernmentRegistrationsPage } from './pages/government/RegistrationsPage';
import { FraudDetectionPage } from './pages/admin/FraudDetectionPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WalletProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Marketing Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />

              {/* Guest Only Routes (Redirects to /dashboard if logged in) */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicOnlyRoute>
                    <SignupPage />
                  </PublicOnlyRoute>
                }
              />

              {/* Authenticated Workspace Shell */}
              <Route
                element={
                  <AuthGuard>
                    <AppLayout />
                  </AuthGuard>
                }
              >
                <Route path="/connect-wallet" element={<Navigate to="/dashboard" replace />} />

                {/* Workspace Dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />

              {/* Property Ledger & Management */}
              <Route path="/properties" element={<PropertiesListPage />} />
              <Route
                path="/properties/register"
                element={
                  <RoleGuard module="owner">
                    <PropertyRegisterPage />
                  </RoleGuard>
                }
              />
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />
              <Route path="/properties/:id/documents" element={<PropertyDetailsPage />} />
              <Route path="/properties/:id/ownership" element={<PropertyDetailsPage />} />
              <Route path="/properties/:id/transactions" element={<PropertyDetailsPage />} />
              <Route path="/properties/:id/timeline" element={<PropertyDetailsPage />} />

              {/* Verification Suite */}
              <Route
                path="/verification"
                element={
                  <RoleGuard module="verification">
                    <DocumentVerificationPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/verification/qr"
                element={
                  <RoleGuard module="verification">
                    <QRVerificationPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/verification/document"
                element={
                  <RoleGuard module="verification">
                    <DocumentVerificationPage />
                  </RoleGuard>
                }
              />

              {/* Tokenization Hub (Owner module) */}
              <Route
                path="/tokenization"
                element={
                  <RoleGuard module="owner">
                    <TokenizationHubPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/tokenization/:propertyId"
                element={
                  <RoleGuard module="owner">
                    <TokenizationHubPage />
                  </RoleGuard>
                }
              />

              {/* Marketplace (Buyer module) */}
              <Route
                path="/marketplace"
                element={
                  <RoleGuard module="buyer">
                    <MarketplacePage />
                  </RoleGuard>
                }
              />
              <Route
                path="/marketplace/:propertyId"
                element={
                  <RoleGuard module="buyer">
                    <MarketplacePage />
                  </RoleGuard>
                }
              />

              {/* Conveyance & Escrow */}
              <Route path="/transfers" element={<TransfersPage />} />
              <Route path="/transfers/incoming" element={<TransfersPage />} />
              <Route path="/transfers/outgoing" element={<TransfersPage />} />
              <Route path="/transfers/:id" element={<TransferDetailsPage />} />

              {/* Document Repository */}
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/documents/:id" element={<DocumentDetailsPage />} />

              {/* Audit & Transaction Trails */}
              <Route
                path="/audit"
                element={
                  <RoleGuard module="audit">
                    <AuditTrailPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/audit/events"
                element={
                  <RoleGuard module="audit">
                    <AuditTrailPage />
                  </RoleGuard>
                }
              />
              <Route path="/transactions" element={<TransactionDetailsPage />} />
              <Route path="/transactions/:hash" element={<TransactionDetailsPage />} />

              {/* Institutional Portals */}
              <Route
                path="/government"
                element={
                  <RoleGuard module="institutional">
                    <Navigate to="/government/registrations" replace />
                  </RoleGuard>
                }
              />
              <Route
                path="/government/registrations"
                element={
                  <RoleGuard module="institutional">
                    <GovernmentRegistrationsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/government/transfers"
                element={
                  <RoleGuard module="institutional">
                    <TransfersPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/government/review/:id"
                element={
                  <RoleGuard module="institutional">
                    <PropertyDetailsPage />
                  </RoleGuard>
                }
              />

              {/* Compliance & Fraud (Institutional) */}
              <Route
                path="/admin"
                element={
                  <RoleGuard module="institutional">
                    <Navigate to="/admin/fraud-detection" replace />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <RoleGuard module="institutional">
                    <DashboardPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/fraud-detection"
                element={
                  <RoleGuard module="institutional">
                    <FraudDetectionPage />
                  </RoleGuard>
                }
              />

              {/* Settings */}
              <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
              <Route path="/settings/profile" element={<SettingsPage />} />
              <Route path="/settings/wallet" element={<SettingsPage />} />
              <Route path="/settings/notifications" element={<SettingsPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </WalletProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
