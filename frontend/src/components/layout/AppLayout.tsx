import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import {
  Breadcrumb,
  type BreadcrumbItem,
} from '../ui/Breadcrumb';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Marketing pages use a simple header/content/footer layout
  const isMarketingRoute =
    location.pathname === '/' ||
    location.pathname === '/about' ||
    location.pathname === '/features';

  // ------------------------------------------------------------
  // Breadcrumbs
  // ------------------------------------------------------------

  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean);

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Home',
      href: '/',
    },
    ...pathSegments.map((segment, index) => {
      const url = `/${pathSegments
        .slice(0, index + 1)
        .join('/')}`;

      const formatted = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        label: formatted,
        href:
          index === pathSegments.length - 1
            ? undefined
            : url,
      };
    }),
  ];

  // ------------------------------------------------------------
  // Marketing Layout
  // ------------------------------------------------------------

  if (isMarketingRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    );
  }

  // ------------------------------------------------------------
  // Application Layout
  // ------------------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <Header />

      {/* Application body */}
      <div className="flex w-full min-h-[calc(100vh-64px)]">

        {/* ======================================================
            DESKTOP SIDEBAR
        ====================================================== */}

        <aside className="hidden md:flex w-72 shrink-0 border-r border-slate-200 bg-slate-950">
          <Sidebar className="w-full" />
        </aside>

        {/* ======================================================
            MOBILE SIDEBAR
        ====================================================== */}

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="w-72 h-full bg-slate-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar
                onCloseMobile={() =>
                  setMobileSidebarOpen(false)
                }
              />
            </div>
          </div>
        )}

        {/* ======================================================
            MAIN APPLICATION AREA
        ====================================================== */}

        <main className="flex-1 min-w-0 flex flex-col bg-slate-50">

          {/* Page content */}
          <div className="flex-1 px-4 py-5 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Actual page */}
            <Outlet />

          </div>

          {/* Footer */}
          <Footer />

        </main>
      </div>
    </div>
  );
};