import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { SITE } from "@/config/site";

const readouts = [
  {
    icon: Phone,
    label: "تماس مستقیم",
    value: SITE.contact.phone,
    dir: "ltr" as const,
  },
  {
    icon: Mail,
    label: "ایمیل پشتیبانی",
    value: SITE.contact.email,
    dir: "ltr" as const,
  },
  {
    icon: MapPin,
    label: "آدرس",
    value: `${SITE.contact.address} (کد پستی: ${SITE.contact.postalCode})`,
    dir: "rtl" as const,
  },
  {
    icon: Clock,
    label: "ساعات کاری",
    value: SITE.hours.label,
    dir: "rtl" as const,
  },
];

// فقط شبکه‌هایی که تو config آدرس دارن نمایش داده میشن
const socials = [
  { icon: Send, href: SITE.contact.telegram, label: "تلگرام" },
].filter((social) => social.href);
