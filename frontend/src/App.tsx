import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { WalletProvider } from './context/WalletContext';
import { AppLayout } from './components/layout/AppLayout';

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
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<AppLayout />}>
              {/* Marketing & Public */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/connect-wallet" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Workspace Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Property Ledger & Management */}
              <Route path="/properties" element={<PropertiesListPage />} />
              <Route path="/properties/register" element={<PropertyRegisterPage />} />
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />
              <Route path="/properties/:id/documents" element={<PropertyDetailsPage />} />
              <Route path="/properties/:id/ownership" element={<PropertyDetailsPage />} />
              <Route path="/properties/:id/transactions" element={<PropertyDetailsPage />} />
              <Route path="/properties/:id/timeline" element={<PropertyDetailsPage />} />

              {/* Verification Suite */}
              <Route path="/verification" element={<DocumentVerificationPage />} />
              <Route path="/verification/qr" element={<QRVerificationPage />} />
              <Route path="/verification/document" element={<DocumentVerificationPage />} />

              {/* Tokenization */}
              <Route path="/tokenization" element={<TokenizationHubPage />} />
              <Route path="/tokenization/:propertyId" element={<TokenizationHubPage />} />

              {/* Marketplace */}
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/:propertyId" element={<MarketplacePage />} />

              {/* Conveyance & Escrow */}
              <Route path="/transfers" element={<TransfersPage />} />
              <Route path="/transfers/incoming" element={<TransfersPage />} />
              <Route path="/transfers/outgoing" element={<TransfersPage />} />
              <Route path="/transfers/:id" element={<TransferDetailsPage />} />

              {/* Document Repository */}
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/documents/:id" element={<DocumentDetailsPage />} />

              {/* Audit & Transaction Trails */}
              <Route path="/audit" element={<AuditTrailPage />} />
              <Route path="/audit/events" element={<AuditTrailPage />} />
              <Route path="/transactions" element={<TransactionDetailsPage />} />
              <Route path="/transactions/:hash" element={<TransactionDetailsPage />} />

              {/* Institutional Portals */}
              <Route path="/government" element={<Navigate to="/government/registrations" replace />} />
              <Route path="/government/registrations" element={<GovernmentRegistrationsPage />} />
              <Route path="/government/transfers" element={<TransfersPage />} />
              <Route path="/government/review/:id" element={<PropertyDetailsPage />} />

              {/* Compliance & Fraud */}
              <Route path="/admin" element={<Navigate to="/admin/fraud-detection" replace />} />
              <Route path="/admin/analytics" element={<DashboardPage />} />
              <Route path="/admin/fraud-detection" element={<FraudDetectionPage />} />

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
    </ToastProvider>
  );
}

export default App;
