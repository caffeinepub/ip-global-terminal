import { Outlet } from "@tanstack/react-router";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "oklch(0.08 0 0)" }}
    >
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
