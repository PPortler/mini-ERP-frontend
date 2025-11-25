
import type { ReactNode } from "react";
import { AppShell } from "@mantine/core";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";

type GlobalLayoutProps = {
  children: ReactNode;
};


export default function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: false },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Sidebar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Breadcrumb />
        {children}
      </AppShell.Main>
    </AppShell>
  );
}