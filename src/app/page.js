import Image from "next/image";
import LiveAudioPlayer from "@/components/LiveAudioPlayer";
import {
  FaClock,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMicrophoneAlt,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/Elvitrola-Para-Ti-100074822726368/",
    Icon: FaFacebook,
    color: "text-blue-400",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@vitrolaparati",
    Icon: FaTiktok,
    color: "text-cyan-300",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/elvitrolaparati/",
    Icon: FaInstagram,
    color: "text-pink-400",
  },
  {
    label: "Correo",
    href: "mailto:elvitrolaparati@gmail.com",
    Icon: FaEnvelope,
    color: "text-vitro",
  },
];

const linkRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-vitro focus-visible:ring-offset-2 focus-visible:ring-offset-black";

// Regenera la página cada día para que el año del footer siempre sea el actual
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      {/* Fondo fijo: resplandor naranja sobre negro (sin background-attachment,
          que iOS Safari no soporta bien) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(250,176,67,0.22),transparent_60%)]" />
        <div className="absolute -left-24 -top-32 h-[30rem] w-[30rem] rounded-full bg-vitro/50 blur-3xl motion-safe:animate-drift" />
        <div className="absolute -right-32 top-1/2 h-[26rem] w-[26rem] rounded-full bg-orange-600/35 blur-3xl motion-safe:animate-drift-slow" />
      </div>

      <main className="mx-auto grid min-h-dvh w-full max-w-xl grid-cols-1 content-start gap-7 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:pt-10 lg:max-w-5xl lg:grid-cols-2 lg:gap-x-14 lg:gap-y-8 lg:pt-16">
        {/* Hero */}
        <header className="flex flex-col items-center gap-5 text-center lg:col-start-1 lg:row-start-1 lg:items-start lg:text-left">
          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-vitro/50 blur-2xl" />
            <div className="relative rounded-[2rem] bg-gradient-to-br from-vitro to-orange-300 p-3 shadow-2xl ring-1 ring-white/30">
              <Image
                src="/logo-vitro.png"
                alt="Radio El Vitrola"
                width={907}
                height={567}
                priority
                className="h-auto w-36 sm:w-48"
              />
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            En vivo 24/7
          </span>

          <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            El locutor número uno de la{" "}
            <span className="text-vitro">Región de O’Higgins.</span>
          </h1>
        </header>

        {/* Reproductor */}
        <section
          aria-label="Reproductor en vivo"
          className="lg:col-start-2 lg:row-start-1 lg:self-center"
        >
          <LiveAudioPlayer />
        </section>

        {/* Información */}
        <section className="flex flex-col gap-4 lg:col-start-1 lg:row-start-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <FaMicrophoneAlt
                aria-hidden="true"
                className="mt-1 shrink-0 text-vitro"
              />
              <p className="text-sm text-white/80">
                Años de trayectoria en Radio y Eventos Rancheros de la Región.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <FaClock
                aria-hidden="true"
                className="mt-1 shrink-0 text-vitro"
              />
              <p className="text-sm text-white/80">
                Emisión en directo las 24 horas y 365 días del año.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-white/80">Escúchame por</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="https://www.gentecomunicaciones.cl"
                target="_blank"
                rel="noopener noreferrer"
                className={`group rounded-2xl border border-vitro/40 bg-vitro/10 p-4 transition hover:bg-vitro/20 ${linkRing}`}
              >
                <span className="block text-2xl font-extrabold text-vitro">
                  94.5 FM
                </span>
                <span className="text-sm font-semibold underline-offset-4 group-hover:underline">
                  Gente Comunicaciones
                </span>
              </a>
              <div className="rounded-2xl border border-vitro/40 bg-vitro/10 p-4">
                <span className="block text-2xl font-extrabold text-vitro">
                  107.3 FM
                </span>
                <span className="text-sm font-semibold">Radio Impacto</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/80">
            Puedes sumarte a esta cadena de transmisión en vivo por internet,{" "}
            <span className="font-semibold text-white">
              contáctame para más información.
            </span>
          </p>
        </section>

        {/* Contacto */}
        <section
          aria-label="Contacto y redes sociales"
          className="flex flex-col gap-3 lg:col-start-2 lg:row-start-2"
        >
          <a
            href="https://wa.me/56933630262"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3.5 text-base font-bold text-black transition hover:bg-green-400 active:scale-[0.98] ${linkRing}`}
          >
            <FaWhatsapp className="text-xl" /> Escríbeme por WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-3">
            {socials.map(({ label, href, Icon, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10 active:scale-[0.98] ${linkRing}`}
              >
                <Icon className={`text-lg ${color}`} /> {label}
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-2 text-center text-xs text-white/60 lg:col-span-2">
          © {new Date().getFullYear()} El Vitrola de Chile. Todos los derechos reservados. Powered by{" "}
          <a
            href="https://www.felpysoluciones.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-vitro"
          >
            Felpy Soluciones
          </a>
          .{" "}
          <a
            href="https://portfolio-elias-silk.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-vitro"
          >
            Created by Cofla.dev
          </a>
        </footer>
      </main>
    </>
  );
}
