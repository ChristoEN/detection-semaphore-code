"use client";

import React from "react";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Deteksi Gambar", path: "/image-detection" },
  { label: "Deteksi Video", path: "/video-realtime" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        borderBottom: "1px solid #e0e0e0",
        mb: 2,
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);

        return (
          <Link key={item.path} href={item.path} passHref>
            <Button
              sx={{
                borderRadius: 0,
                borderBottom: isActive
                  ? "3px solid #1976d2"
                  : "3px solid transparent",
                color: isActive ? "primary.main" : "text.primary",
                bgcolor: isActive ? "#f0f8ff" : "transparent",
                mx: 1,
                textTransform: "none",
              }}
            >
              {item.label}
            </Button>
          </Link>
        );
      })}
    </Box>
  );
}
