import { Metadata } from "next";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return children;
};

export default Layout;

export const metadata: Metadata = {
   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), // Or your production URL
  title: `Blogs`,
  description:
    "Explore my blog where I share valuable tips, tutorials, and personal experiences in web development and programming. Let's grow together in this ever-evolving tech landscape!",
  authors: [
    {   
      name: "Roshan Chaudhary",
    },
  ],
  category: "Personal Website",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `Blogs | Roshan Chaudhary`,
    description:
      "Explore my blog where I share valuable tips, tutorials, and personal experiences in web development and programming. Let's grow together in this ever-evolving tech landscape!",
    images: [
      {
        url: "/blogs.png",
      },
    ],
  },
};