import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import {
  Breadcrumb,
  type BreadcrumbItem,
} from '../ui/Breadcrumb';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ------------------------------------------------------------
  // Marketing routes
  // ------------------------------------------------------------

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
      </div>
    );
  }

  // ------------------------------------------------------------
  // Application Layout
  // ------------------------------------------------------------

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">

      {/* ======================================================
          FIXED HEADER
      ====================================================== */}

      <header className="relative z-40 h-16 shrink-0">
        <Header />
      </header>


      {/* ======================================================
          APPLICATION BODY
          Height = viewport - header
      ====================================================== */}

      <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden">


        {/* ====================================================
            DESKTOP SIDEBAR

            Fixed in the application shell.
            It does NOT scroll.
        ===================================================== */}

        <aside
          className="
            hidden
            md:flex
            w-72
            shrink-0
            h-full
            overflow-hidden
            border-r
            border-slate-800
            bg-slate-950
          "
        >
          <Sidebar className="w-full h-full" />
        </aside>


        {/* ====================================================
            MOBILE SIDEBAR
        ===================================================== */}

        {mobileSidebarOpen && (
          <div
            className="
              fixed
              inset-0
              z-50
              md:hidden
              bg-slate-950/50
              backdrop-blur-sm
            "
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="
                w-72
                h-full
                bg-slate-950
                shadow-2xl
              "
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


        {/* ====================================================
            MAIN CONTENT

            THIS IS THE ONLY SCROLLABLE AREA
        ===================================================== */}

        <main
          className="
            flex-1
            min-w-0
            h-full
            overflow-y-auto
            overflow-x-hidden
            bg-slate-50
          "
        >

          {/* Page container */}
          <div className="w-full px-4 py-5 sm:px-6 lg:px-8">

            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Page */}
            <Outlet />

          </div>

        </main>

      </div>
    </div>
  );
};