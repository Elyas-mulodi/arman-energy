"use client";

import { useState, useEffect } from "react";
import { SITE } from "@/config/site";

interface BusinessStatus {
  isOpen: boolean;
  label: string;
}

const getTehranNow = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());

  return {
    weekday: parts.find((p) => p.type === "weekday")?.value ?? "",
    hour: Number(parts.find((p) => p.type === "hour")?.value ?? 0),
  };
};

export function useBusinessStatus(): BusinessStatus {
  const [status, setStatus] = useState<BusinessStatus>({
    isOpen: false,
    label: "...",
  });

  useEffect(() => {
    const checkStatus = () => {
      const { weekday, hour } = getTehranNow();
      const isOpen =
        SITE.hours.days.includes(weekday) &&
        hour >= SITE.hours.open &&
        hour < SITE.hours.close;

      setStatus({
        isOpen,
        label: isOpen ? "هم‌اکنون پاسخگو هستیم" : "خارج از ساعات کاری",
      });
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}
