import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute"
        style={{
          width: 600,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(232,255,71,0.05) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative z-10 text-center px-6">
        {/* Glitch 404 */}
        <p className="font-mono text-xs tracking-widest text-text-muted uppercase mb-6">
          ERROR_404
        </p>
        <h1
          className="font-display text-[clamp(6rem,20vw,14rem)] leading-none text-accent-primary glitch-text mb-2"
          data-text="404"
          style={{ textShadow: "0 0 40px rgba(232,255,71,0.4), 0 0 80px rgba(232,255,71,0.1)" }}
        >
          404
        </h1>
        <p className="font-mono text-sm text-text-secondary tracking-wider mb-2">
          LEVEL NOT FOUND
        </p>
        <p className="font-body text-sm text-text-muted mb-12 max-w-xs mx-auto">
          Cette page n&apos;existe pas. Le niveau a peut-être été supprimé ou n&apos;a jamais été créé.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-8 py-4 border border-accent-primary text-accent-primary transition-all duration-300 hover:bg-accent-primary hover:text-bg-primary"
          style={{ boxShadow: "0 0 20px rgba(232,255,71,0.2)" }}
        >
          ← RETOUR À L&apos;ACCUEIL
        </Link>

        <p className="font-mono text-[10px] text-text-muted mt-12 tracking-widest">
          ↑↑↓↓←→←→BA
        </p>
      </div>
    </div>
  );
}
