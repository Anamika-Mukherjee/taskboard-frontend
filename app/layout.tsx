import React from "react";
import type { Metadata } from "next";
import {Schibsted_Grotesk} from "next/font/google";
import "./globals.css";
import { AllProjectProvider } from "@/contexts/allProjectContext";
import { AllTicketProvider } from "@/contexts/allTicketContext";
import { Toaster } from "sonner";
import Head from "next/head";


const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "TaskBoard - Your workspace for smarter project tracking.",
  description: "TaskBoard is a simple, visual workspace for tracking tasks, managing projects, and collaborating with your team in real time.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        className={`${schibstedGrotesk.variable} antialiased`}
      >
        <AllProjectProvider>
          <AllTicketProvider>
            {children}
            <Toaster position="top-center"/>
           </AllTicketProvider> 
        </AllProjectProvider>
      </body>
    </html>
  );
}
