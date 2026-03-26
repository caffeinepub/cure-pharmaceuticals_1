import { Mail } from "lucide-react";
import { motion } from "motion/react";
import { SiInstagram, SiTelegram, SiWhatsapp, SiYoutube } from "react-icons/si";

const contacts = [
  {
    icon: <SiWhatsapp className="h-6 w-6" />,
    label: "WhatsApp",
    value: "+44 7492 497781",
    href: "https://wa.me/447492497781",
    color: "bg-[#25D366]/15 text-[#25D366]",
    border: "border-[#25D366]/30",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    label: "Email",
    value: "curepharmaa@outlook.com",
    href: "mailto:curepharmaa@outlook.com",
    color: "bg-primary/10 text-primary",
    border: "border-primary/30",
  },
  {
    icon: <SiYoutube className="h-6 w-6" />,
    label: "YouTube",
    value: "@curepharmaceuticals",
    href: "https://youtube.com/@curepharmaceuticals?si=ZECq1dEdHW4nQCwX",
    color: "bg-[#FF0000]/10 text-[#FF0000]",
    border: "border-[#FF0000]/20",
  },
  {
    icon: <SiInstagram className="h-6 w-6" />,
    label: "Instagram",
    value: "@cure_phramacy",
    href: "https://www.instagram.com/cure_phramacy?igsh=MXIwOGlpYWNnOTY4bw==",
    color: "bg-[#E1306C]/10 text-[#E1306C]",
    border: "border-[#E1306C]/20",
  },
  {
    icon: <SiTelegram className="h-6 w-6" />,
    label: "Telegram",
    value: "@CurePharma2",
    href: "https://t.me/CurePharma2",
    color: "bg-[#0088CC]/10 text-[#0088CC]",
    border: "border-[#0088CC]/20",
  },
];

export function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Get in Touch
          </h1>
          <p className="text-muted-foreground">
            Reach out to us via any of the following channels. We're here to
            help.
          </p>
        </div>

        <div className="space-y-4" data-ocid="contact.list">
          {contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 p-5 bg-card rounded-xl border ${c.border} shadow-card hover:shadow-nav transition-shadow`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              data-ocid={`contact.item.${i + 1}`}
            >
              <div className={`p-3 rounded-xl ${c.color} shrink-0`}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {c.label}
                </div>
                <div className="text-foreground font-semibold truncate">
                  {c.value}
                </div>
              </div>
              <div className="text-muted-foreground text-sm shrink-0">→</div>
            </motion.a>
          ))}
        </div>

        {/* Info box */}
        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
          <p className="text-sm text-foreground font-medium">Business Hours</p>
          <p className="text-muted-foreground text-sm mt-1">
            Monday – Friday: 9:00 AM – 6:00 PM (GMT)
          </p>
          <p className="text-muted-foreground text-sm">
            We typically respond within 24 hours.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
