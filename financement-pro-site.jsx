import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { id: "accueil", label: "Accueil" },
  { id: "offres", label: "Nos offres" },
  { id: "simulateur", label: "Simulateur" },
  { id: "demande", label: "Faire une demande" },
  { id: "apropos", label: "À propos" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

const LOAN_TYPES = [
  {
    id: "pme",
    icon: "🏢",
    title: "Prêt PME",
    subtitle: "Pour les entreprises établies",
    min: "50 000 €",
    max: "500 000 €",
    duree: "12 à 84 mois",
    taux: "À partir de 3,9%",
    color: "#1a3a5c",
    conditions: ["CA > 100 000€/an", "2+ années d'activité", "Bilan comptable disponible"],
    docs: ["Kbis de moins de 3 mois", "3 derniers bilans", "Relevés bancaires 6 mois", "Business plan"],
    delai: "48 à 72h",
  },
  {
    id: "startup",
    icon: "🚀",
    title: "Prêt Startup",
    subtitle: "Pour les jeunes entreprises innovantes",
    min: "10 000 €",
    max: "150 000 €",
    duree: "6 à 60 mois",
    taux: "À partir de 5,9%",
    color: "#2d6a4f",
    conditions: ["Entreprise < 3 ans", "Projet innovant", "Business plan solide"],
    docs: ["Kbis", "Business plan détaillé", "Prévisionnel 3 ans", "CV fondateurs"],
    delai: "24 à 48h",
  },
  {
    id: "tresorerie",
    icon: "💰",
    title: "Crédit de trésorerie",
    subtitle: "Pour les besoins de liquidités immédiats",
    min: "5 000 €",
    max: "100 000 €",
    duree: "3 à 24 mois",
    taux: "À partir de 4,5%",
    color: "#7b2d8b",
    conditions: ["Activité en cours", "CA régulier", "Compte bancaire sain"],
    docs: ["Kbis", "Relevés bancaires 3 mois", "Pièce d'identité dirigeant"],
    delai: "24h",
  },
  {
    id: "equipement",
    icon: "⚙️",
    title: "Financement équipement",
    subtitle: "Pour acquérir du matériel professionnel",
    min: "10 000 €",
    max: "300 000 €",
    duree: "12 à 72 mois",
    taux: "À partir de 3,2%",
    color: "#c27d00",
    conditions: ["Devis du fournisseur", "Justification du besoin", "Entreprise active"],
    docs: ["Kbis", "Devis équipement", "Bilans N-1 et N-2", "Relevés bancaires"],
    delai: "48h",
  },
  {
    id: "autoentrepreneur",
    icon: "👤",
    title: "Prêt auto-entrepreneur",
    subtitle: "Dédié aux indépendants et freelances",
    min: "2 000 €",
    max: "50 000 €",
    duree: "6 à 48 mois",
    taux: "À partir de 4,9%",
    color: "#c0392b",
    conditions: ["Immatriculation active", "CA justifiable", "6+ mois d'activité"],
    docs: ["SIRET", "Avis d'imposition", "Relevés bancaires 6 mois", "Pièce d'identité"],
    delai: "24h",
  },
];

const TESTIMONIALS = [
  {
    name: "Sophie Marchand",
    company: "Atelier Marchand SAS",
    text: "Grâce à CapitalPro, j'ai pu financer l'achat de nouvelles machines en moins de 3 jours. Le processus était incroyablement simple.",
    role: "Directrice générale",
    amount: "85 000 €",
    rating: 5,
  },
  {
    name: "Karim El Amrani",
    company: "TechFlow Startup",
    text: "En tant que fondateur de startup, je redoutais de me retrouver face à des murs administratifs. CapitalPro m'a prouvé le contraire.",
    role: "CEO & Fondateur",
    amount: "45 000 €",
    rating: 5,
  },
  {
    name: "Marie-Claire Dupont",
    company: "Cabinet MC Dupont",
    text: "Le simulateur m'a permis de visualiser exactement mes mensualités avant de m'engager. Transparence totale, je recommande.",
    role: "Consultante indépendante",
    amount: "18 000 €",
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: "Qui peut faire une demande de prêt ?",
    a: "Toute entreprise française légalement constituée : SARL, SAS, SA, EURL, micro-entreprise, auto-entrepreneur, profession libérale. Vous devez avoir un SIRET valide et une activité en cours.",
  },
  {
    q: "Quels documents dois-je fournir ?",
    a: "Les documents varient selon le type de prêt. En général : pièce d'identité du dirigeant, Kbis de moins de 3 mois, bilans comptables des 2 dernières années, relevés bancaires des 3 à 6 derniers mois.",
  },
  {
    q: "Quel est le délai de réponse ?",
    a: "Nous vous apportons une réponse de principe sous 24h. En cas de réponse positive, le déblocage des fonds intervient sous 48 à 72h selon la complétude de votre dossier.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Absolument. Toutes vos données sont chiffrées (TLS 1.3), hébergées en France et traitées conformément au RGPD. Nous ne partageons jamais vos informations avec des tiers sans votre consentement explicite.",
  },
  {
    q: "Puis-je rembourser par anticipation ?",
    a: "Oui, le remboursement anticipé est possible à tout moment sans pénalité pour les prêts inférieurs à 50 000€. Pour les montants supérieurs, des indemnités de remboursement anticipé peuvent s'appliquer selon les conditions de votre contrat.",
  },
  {
    q: "Y a-t-il des frais de dossier ?",
    a: "Des frais de dossier entre 1% et 2% du montant emprunté s'appliquent selon les offres. Ils sont toujours clairement indiqués avant toute signature. Aucune surprise.",
  },
  {
    q: "Mon entreprise est en difficulté, puis-je quand même emprunter ?",
    a: "Nous étudions chaque dossier avec attention. Nous pouvons parfois accompagner des entreprises en restructuration si des garanties solides sont présentées. Contactez-nous pour une étude personnalisée.",
  },
];

const TEAM = [
  { name: "Alexandre Moreau", role: "Directeur Général", initials: "AM" },
  { name: "Isabelle Laurent", role: "Directrice des risques", initials: "IL" },
  { name: "David Nguyen", role: "Responsable crédit", initials: "DN" },
  { name: "Fatima Zahra Idrissi", role: "Responsable conformité", initials: "FZ" },
];

function StarRating({ count }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[...Array(count)].map((_, i) => (
        <span key={i} style={{ color: "#f59e0b", fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

function Badge({ children, color = "#1a3a5c" }) {
  return (
    <span style={{
      background: color + "15",
      color,
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 10px",
      borderRadius: 20,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}>{children}</span>
  );
}

function SectionTitle({ label, title, sub, light }) {
  return (
    <div style={{ marginBottom: "3rem", textAlign: "center" }}>
      {label && <Badge color={light ? "#a8c7e8" : "#1a3a5c"}>{label}</Badge>}
      <h2 style={{
        fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
        fontWeight: 700,
        color: light ? "#fff" : "#0d1f35",
        margin: "0.75rem 0 0.5rem",
        fontFamily: "'Playfair Display', Georgia, serif",
        letterSpacing: "-0.02em",
      }}>{title}</h2>
      {sub && <p style={{ color: light ? "rgba(255,255,255,0.75)" : "#5a7a9a", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

// ───────────────────────────── PAGES ─────────────────────────────

function PageAccueil({ setPage }) {
  const [visibleSection, setVisibleSection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisibleSection(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    { icon: "⚡", title: "Réponse sous 24h", desc: "Analyse rapide de votre dossier par nos experts crédit." },
    { icon: "🔒", title: "100% sécurisé", desc: "Chiffrement TLS, données hébergées en France, conforme RGPD." },
    { icon: "📊", title: "Taux transparents", desc: "Aucun frais caché. Tout est affiché avant signature." },
    { icon: "🤝", title: "Accompagnement dédié", desc: "Un conseiller personnel vous guide de A à Z." },
  ];

  const steps = [
    { n: "01", title: "Remplissez votre demande", desc: "Formulaire en ligne en moins de 10 minutes. Simple et rapide." },
    { n: "02", title: "Analyse de votre dossier", desc: "Nos experts étudient votre dossier sous 24h ouvrées." },
    { n: "03", title: "Réception des fonds", desc: "Après validation et signature, les fonds sont virés sous 48h." },
  ];

  return (
    <div>
      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #0d1f35 0%, #1a3a5c 50%, #0f4c81 100%)",
        padding: "6rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(100,160,255,0.08) 0%, transparent 50%)",
        }} />
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)", borderRadius: 24,
            padding: "6px 16px", marginBottom: "1.5rem",
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <span style={{ width: 8, height: 8, background: "#4ade80", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, letterSpacing: "0.05em" }}>Financement rapide · Taux compétitifs</span>
          </div>
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.1,
            margin: "0 0 1.25rem",
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: "-0.03em",
          }}>
            Des solutions de financement<br />
            <span style={{ color: "#64a8ff" }}>rapides pour développer</span><br />
            votre activité.
          </h1>
          <p style={{
            fontSize: "1.15rem",
            color: "rgba(255,255,255,0.75)",
            maxWidth: 600,
            margin: "0 auto 2.5rem",
            lineHeight: 1.65,
          }}>
            Prêts professionnels simples, rapides et transparents pour entrepreneurs, PME et indépendants.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setPage("demande")}
              style={{
                background: "#64a8ff",
                color: "#0d1f35",
                border: "none",
                borderRadius: 8,
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}>
              Faire une demande →
            </button>
            <button
              onClick={() => setPage("simulateur")}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.35)",
                borderRadius: 8,
                padding: "14px 32px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}>
              Simuler un prêt
            </button>
          </div>
          <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", marginTop: "3rem", flexWrap: "wrap" }}>
            {[["500M€+", "financés"], ["2 400+", "entreprises accompagnées"], ["24h", "délai de réponse"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#64a8ff" }}>{v}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section style={{ padding: "5rem 2rem", background: "#f8fafd" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle label="Pourquoi nous choisir" title="Nos engagements envers vous" sub="Nous nous engageons à vous offrir la meilleure expérience de financement professionnel en France." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {features.map((f) => (
              <div key={f.title} style={{
                background: "#fff",
                borderRadius: 12,
                padding: "1.75rem",
                border: "1px solid #e8eef5",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,58,92,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ fontSize: 32, marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0d1f35", margin: "0 0 0.5rem" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#5a7a9a", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle label="Processus" title="Comment ça marche ?" sub="3 étapes simples pour obtenir votre financement." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ textAlign: "center", position: "relative" }}>
                {i < steps.length - 1 && (
                  <div style={{
                    position: "absolute", top: 28, left: "60%", right: "-20%",
                    height: 2, background: "linear-gradient(to right, #1a3a5c, #e8eef5)",
                    display: "none",
                  }} />
                )}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "#0d1f35",
                  color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.25rem",
                  fontSize: 13, fontWeight: 800, letterSpacing: "0.05em",
                }}>{s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0d1f35", marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#5a7a9a", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button onClick={() => setPage("demande")} style={{
              background: "#1a3a5c", color: "#fff", border: "none",
              borderRadius: 8, padding: "13px 28px", fontSize: 15,
              fontWeight: 600, cursor: "pointer",
            }}>Commencer ma demande →</button>
          </div>
        </div>
      </section>

      {/* OFFRES APERÇU */}
      <section style={{ padding: "5rem 2rem", background: "#f8fafd" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle label="Nos offres" title="Des solutions pour chaque besoin" sub="Choisissez le financement adapté à votre situation et votre projet." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem" }}>
            {LOAN_TYPES.map((loan) => (
              <div key={loan.id}
                onClick={() => setPage("offres")}
                style={{
                  background: "#fff", borderRadius: 12, padding: "1.5rem",
                  border: "1px solid #e8eef5", cursor: "pointer",
                  borderTop: `3px solid ${loan.color}`,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}
              >
                <div style={{ fontSize: 28, marginBottom: "0.75rem" }}>{loan.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0d1f35", marginBottom: "0.25rem" }}>{loan.title}</h3>
                <p style={{ fontSize: 12, color: "#5a7a9a", marginBottom: "0.75rem", lineHeight: 1.5 }}>{loan.subtitle}</p>
                <div style={{ fontSize: 12, color: loan.color, fontWeight: 700 }}>{loan.min} – {loan.max}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section style={{ padding: "5rem 2rem", background: "#0d1f35" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTitle light label="Témoignages" title="Ils nous font confiance" sub="Découvrez les retours de nos clients satisfaits." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{
                background: "rgba(255,255,255,0.06)", borderRadius: 12,
                padding: "1.75rem", border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <StarRating count={t.rating} />
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.7, margin: "1rem 0" }}>
                  « {t.text} »
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{t.role} · {t.company}</div>
                  </div>
                  <div style={{
                    background: "rgba(100,168,255,0.15)", color: "#64a8ff",
                    fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                  }}>{t.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÉCURITÉ */}
      <section style={{ padding: "5rem 2rem", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionTitle label="Sécurité & conformité" title="Vos données protégées, votre dossier en sécurité" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
            {[
              ["🔐", "Chiffrement TLS", "Toutes vos communications sont chiffrées de bout en bout."],
              ["🇫🇷", "Données en France", "Hébergement 100% sur des serveurs situés en France."],
              ["📋", "Conformité RGPD", "Respect strict du règlement européen sur la protection des données."],
              ["✅", "Vérification des dossiers", "Chaque demande est vérifiée manuellement par nos experts."],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{
                background: "#f8fafd", borderRadius: 10, padding: "1.5rem",
                borderLeft: "3px solid #1a3a5c",
              }}>
                <div style={{ fontSize: 24, marginBottom: "0.5rem" }}>{icon}</div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0d1f35", marginBottom: "0.35rem" }}>{title}</h4>
                <p style={{ fontSize: 13, color: "#5a7a9a", lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: "4rem 2rem",
        background: "linear-gradient(135deg, #1a3a5c, #0f4c81)",
        textAlign: "center",
      }}>
        <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", margin: "0 0 1rem" }}>
          Prêt à financer votre projet ?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2rem" }}>Obtenez une réponse de principe sous 24h. Sans engagement.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("demande")} style={{ background: "#fff", color: "#1a3a5c", border: "none", borderRadius: 8, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Faire une demande →
          </button>
          <button onClick={() => setPage("simulateur")} style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 8, padding: "13px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Simuler mon prêt
          </button>
        </div>
      </section>
    </div>
  );
}

function PageOffres({ setPage }) {
  const [active, setActive] = useState(null);

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
      <SectionTitle label="Nos offres" title="Trouvez le financement adapté à votre situation" sub="5 solutions conçues pour répondre aux besoins spécifiques de chaque entrepreneur." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {LOAN_TYPES.map((loan) => (
          <div key={loan.id}
            style={{
              background: "#fff", borderRadius: 14, border: "1px solid #e8eef5",
              overflow: "hidden", boxShadow: active === loan.id ? "0 8px 32px rgba(26,58,92,0.12)" : "none",
              transition: "box-shadow 0.2s",
            }}>
            <div style={{
              background: loan.color, padding: "1.5rem",
              display: "flex", alignItems: "center", gap: "1rem",
            }}>
              <div style={{ fontSize: 36 }}>{loan.icon}</div>
              <div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{loan.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>{loan.subtitle}</p>
              </div>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                {[
                  ["Montant", `${loan.min} – ${loan.max}`],
                  ["Durée", loan.duree],
                  ["Taux", loan.taux],
                  ["Réponse", loan.delai],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: "#f8fafd", borderRadius: 8, padding: "0.75rem" }}>
                    <div style={{ fontSize: 11, color: "#5a7a9a", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f35" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0d1f35", marginBottom: "0.5rem" }}>Conditions</div>
                {loan.conditions.map((c) => (
                  <div key={c} style={{ fontSize: 13, color: "#5a7a9a", padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#22c55e", fontSize: 14 }}>✓</span> {c}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0d1f35", marginBottom: "0.5rem" }}>Documents requis</div>
                {loan.docs.map((d) => (
                  <div key={d} style={{ fontSize: 13, color: "#5a7a9a", padding: "2px 0", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "#64a8ff", fontSize: 12 }}>📄</span> {d}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPage("demande")}
                style={{
                  width: "100%", background: loan.color, color: "#fff",
                  border: "none", borderRadius: 8, padding: "11px",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>
                Faire une demande →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageSimulateur() {
  const [montant, setMontant] = useState(50000);
  const [duree, setDuree] = useState(36);
  const [taux, setTaux] = useState(4.5);

  const mensualite = montant * (taux / 100 / 12) / (1 - Math.pow(1 + taux / 100 / 12, -duree));
  const coutTotal = mensualite * duree;
  const coutCredit = coutTotal - montant;

  const fmtEur = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: 800, margin: "0 auto" }}>
      <SectionTitle label="Simulateur" title="Estimez vos mensualités" sub="Ajustez les paramètres pour trouver la formule qui correspond à votre budget." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Contrôles */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "2rem", border: "1px solid #e8eef5" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0d1f35", marginBottom: "1.5rem" }}>Paramètres</h3>

          {[
            { label: "Montant souhaité", value: montant, min: 5000, max: 500000, step: 5000, set: setMontant, fmt: fmtEur },
            { label: "Durée (mois)", value: duree, min: 6, max: 84, step: 6, set: setDuree, fmt: v => `${v} mois` },
            { label: "Taux annuel (%)", value: taux, min: 2, max: 12, step: 0.1, set: setTaux, fmt: v => `${v.toFixed(1)}%` },
          ].map((s) => (
            <div key={s.label} style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <label style={{ fontSize: 13, color: "#5a7a9a" }}>{s.label}</label>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1a3a5c" }}>{s.fmt(s.value)}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.set(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#1a3a5c" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aab8c8", marginTop: 3 }}>
                <span>{s.fmt(s.min)}</span><span>{s.fmt(s.max)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Résultats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "linear-gradient(135deg, #1a3a5c, #0f4c81)", borderRadius: 14, padding: "2rem", color: "#fff", flex: 1 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>Mensualité estimée</div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{fmtEur(mensualite)}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>par mois pendant {duree} mois</div>
          </div>
          {[
            ["Montant emprunté", fmtEur(montant), "#0d1f35"],
            ["Coût total du crédit", fmtEur(coutCredit), "#dc2626"],
            ["Total à rembourser", fmtEur(coutTotal), "#0d1f35"],
          ].map(([l, v, c]) => (
            <div key={l} style={{ background: "#fff", borderRadius: 10, padding: "1rem 1.25rem", border: "1px solid #e8eef5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#5a7a9a" }}>{l}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
          <div style={{
            background: "#fff8dc", borderRadius: 10, padding: "1rem",
            border: "1px solid #f0d060", fontSize: 12, color: "#7a5c00",
          }}>
            ℹ️ Simulation à titre indicatif. Le taux réel est déterminé après analyse de votre dossier.
          </div>
        </div>
      </div>
    </div>
  );
}

function PageDemande() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nom: "", email: "", tel: "",
    entreprise: "", siret: "", secteur: "", ca: "",
    montant: "", objet: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const steps = ["Informations personnelles", "Informations entreprise", "Besoin financier", "Documents"];

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: "1px solid #d0dce8", fontSize: 14, color: "#0d1f35",
    boxSizing: "border-box", outline: "none", fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#5a7a9a", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 5, display: "block" };

  if (submitted) return (
    <div style={{ padding: "5rem 2rem", textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ fontSize: 64, marginBottom: "1.5rem" }}>✅</div>
      <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0d1f35", fontFamily: "'Playfair Display', Georgia, serif" }}>Demande envoyée !</h2>
      <p style={{ color: "#5a7a9a", lineHeight: 1.7 }}>Votre dossier a bien été reçu. Notre équipe vous contactera dans les 24h ouvrées pour la suite de votre dossier.</p>
      <div style={{ background: "#f8fafd", borderRadius: 10, padding: "1.25rem", margin: "1.5rem 0", border: "1px solid #e8eef5", textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0d1f35", marginBottom: "0.5rem" }}>Récapitulatif</div>
        {Object.entries({ "Nom": form.nom, "Email": form.email, "Entreprise": form.entreprise, "Montant demandé": form.montant + " €" }).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0", color: "#5a7a9a" }}>
            <span>{k}</span><span style={{ fontWeight: 600, color: "#0d1f35" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: 700, margin: "0 auto" }}>
      <SectionTitle label="Demande de prêt" title="Constituez votre dossier" sub="Remplissez ce formulaire en 4 étapes. Traitement sous 24h." />

      {/* Stepper */}
      <div style={{ display: "flex", marginBottom: "2.5rem", position: "relative" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: i <= step ? "#1a3a5c" : "#e8eef5",
              color: i <= step ? "#fff" : "#aab8c8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14, zIndex: 1, position: "relative",
            }}>{i < step ? "✓" : i + 1}</div>
            <div style={{ fontSize: 11, color: i === step ? "#1a3a5c" : "#aab8c8", marginTop: 6, textAlign: "center", fontWeight: i === step ? 700 : 400 }}>
              {s}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: "2rem", border: "1px solid #e8eef5" }}>
        {step === 0 && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {[["nom", "Nom complet"], ["email", "Adresse email"], ["tel", "Numéro de téléphone"]].map(([k, l]) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input style={inputStyle} value={form[k]} onChange={upd(k)} placeholder={l} type={k === "email" ? "email" : "text"} />
              </div>
            ))}
          </div>
        )}
        {step === 1 && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {[["entreprise", "Nom de l'entreprise"], ["siret", "SIRET (14 chiffres)"], ["secteur", "Secteur d'activité"], ["ca", "Chiffre d'affaires annuel (€)"]].map(([k, l]) => (
              <div key={k}>
                <label style={labelStyle}>{l}</label>
                <input style={inputStyle} value={form[k]} onChange={upd(k)} placeholder={l} />
              </div>
            ))}
          </div>
        )}
        {step === 2 && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Montant demandé (€)</label>
              <input style={inputStyle} value={form.montant} onChange={upd("montant")} placeholder="Ex : 50 000" type="number" />
            </div>
            <div>
              <label style={labelStyle}>Objet du prêt</label>
              <select style={{ ...inputStyle, background: "#fff" }} value={form.objet} onChange={upd("objet")}>
                <option value="">Sélectionnez...</option>
                <option>Achat d'équipement</option>
                <option>Besoins de trésorerie</option>
                <option>Développement commercial</option>
                <option>Rachat de fonds de commerce</option>
                <option>Financement de stock</option>
                <option>Autre</option>
              </select>
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <div style={{ background: "#f8fafd", borderRadius: 10, padding: "1.25rem", border: "2px dashed #d0dce8", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 32, marginBottom: "0.5rem" }}>📄</div>
              <div style={{ fontWeight: 600, color: "#0d1f35", fontSize: 14 }}>Pièce d'identité</div>
              <div style={{ color: "#5a7a9a", fontSize: 12 }}>CNI ou passeport (PDF, JPG)</div>
            </div>
            <div style={{ background: "#f8fafd", borderRadius: 10, padding: "1.25rem", border: "2px dashed #d0dce8", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 32, marginBottom: "0.5rem" }}>🏢</div>
              <div style={{ fontWeight: 600, color: "#0d1f35", fontSize: 14 }}>Kbis</div>
              <div style={{ color: "#5a7a9a", fontSize: 12 }}>Extrait Kbis de moins de 3 mois</div>
            </div>
            <div style={{ background: "#f8fafd", borderRadius: 10, padding: "1.25rem", border: "2px dashed #d0dce8", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 32, marginBottom: "0.5rem" }}>🏦</div>
              <div style={{ fontWeight: 600, color: "#0d1f35", fontSize: 14 }}>Relevés bancaires</div>
              <div style={{ color: "#5a7a9a", fontSize: 12 }}>3 à 6 derniers mois</div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{
              background: "transparent", color: "#5a7a9a", border: "1px solid #d0dce8",
              borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: step === 0 ? "default" : "pointer",
              opacity: step === 0 ? 0.4 : 1,
            }}>
            ← Précédent
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} style={{
              background: "#1a3a5c", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Suivant →</button>
          ) : (
            <button onClick={() => setSubmitted(true)} style={{
              background: "#22c55e", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Envoyer ma demande ✓</button>
          )}
        </div>
      </div>
    </div>
  );
}

function PageApropos() {
  return (
    <div>
      <section style={{ background: "linear-gradient(135deg, #0d1f35, #1a3a5c)", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Badge color="#64a8ff">À propos</Badge>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff", margin: "1rem 0", fontFamily: "'Playfair Display', Georgia, serif" }}>
            Financer l'ambition des entrepreneurs français
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.7, fontSize: 16 }}>
            Depuis 2018, CapitalPro accompagne les entrepreneurs, PME et indépendants dans leurs projets de développement avec des solutions de financement adaptées, rapides et transparentes.
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {[
            {
              icon: "🎯", title: "Notre mission",
              text: "Démocratiser l'accès au financement professionnel en supprimant les obstacles bureaucratiques. Chaque entrepreneur mérite une chance équitable d'obtenir les ressources nécessaires à sa réussite.",
            },
            {
              icon: "👁️", title: "Notre vision",
              text: "Devenir le partenaire financier de référence pour toutes les PME et indépendants français, grâce à une technologie au service de l'humain et une relation de confiance durable.",
            },
            {
              icon: "💎", title: "Nos valeurs",
              text: "Transparence totale dans nos taux et conditions. Réactivité face aux besoins urgents. Responsabilité dans nos analyses de risques. Accompagnement humain à chaque étape.",
            },
          ].map((v) => (
            <div key={v.title} style={{ background: "#fff", borderRadius: 12, padding: "2rem", border: "1px solid #e8eef5" }}>
              <div style={{ fontSize: 36, marginBottom: "1rem" }}>{v.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0d1f35", marginBottom: "0.75rem", fontFamily: "'Playfair Display', Georgia, serif" }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: "#5a7a9a", lineHeight: 1.7 }}>{v.text}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#f8fafd", borderRadius: 14, padding: "2.5rem", margin: "3rem 0", border: "1px solid #e8eef5" }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0d1f35", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "1rem" }}>Notre histoire</h3>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.5rem 1.5rem" }}>
            {[
              ["2018", "Fondation de CapitalPro par 4 anciens banquiers avec l'ambition de simplifier le financement des PME."],
              ["2019", "Premier million d'euros financé. 120 entreprises accompagnées dès la première année."],
              ["2021", "Lancement de la plateforme digitale et du simulateur en ligne. Passage à 500 dossiers par mois."],
              ["2023", "Certification conformité RGPD et agrément ACPR. Ouverture des financements startup."],
              ["2025", "500M€ financés, 2400+ entreprises accompagnées sur tout le territoire français."],
            ].map(([y, t]) => (
              <><div key={y + "y"} style={{ fontWeight: 800, color: "#1a3a5c", fontSize: 13, paddingTop: 2 }}>{y}</div>
                <div key={y + "t"} style={{ fontSize: 14, color: "#5a7a9a", lineHeight: 1.6, borderLeft: "2px solid #e8eef5", paddingLeft: "1rem", paddingBottom: "0.75rem" }}>{t}</div></>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0d1f35", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "1.5rem", textAlign: "center" }}>Notre équipe dirigeante</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem" }}>
            {TEAM.map((m) => (
              <div key={m.name} style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", border: "1px solid #e8eef5", textAlign: "center" }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a3a5c, #0f4c81)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, margin: "0 auto 1rem",
                }}>{m.initials}</div>
                <div style={{ fontWeight: 700, color: "#0d1f35", fontSize: 14 }}>{m.name}</div>
                <div style={{ color: "#5a7a9a", fontSize: 12, marginTop: 3 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function PageFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: 780, margin: "0 auto" }}>
      <SectionTitle label="FAQ" title="Questions fréquentes" sub="Toutes les réponses aux questions les plus posées par nos clients." />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e8eef5", overflow: "hidden" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", background: "none", border: "none", cursor: "pointer",
                padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between",
                alignItems: "center", textAlign: "left",
              }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#0d1f35" }}>{item.q}</span>
              <span style={{ fontSize: 20, color: "#1a3a5c", transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s", minWidth: 24 }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: "0 1.5rem 1.25rem", fontSize: 14, color: "#5a7a9a", lineHeight: 1.7, borderTop: "1px solid #f0f4f8" }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PageContact() {
  const [sent, setSent] = useState(false);

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: 1000, margin: "0 auto" }}>
      <SectionTitle label="Contact" title="Parlons de votre projet" sub="Notre équipe est disponible du lundi au vendredi pour répondre à toutes vos questions." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Infos */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            ["📧", "Email", "contact@capitalpro.fr", "Réponse sous 4h ouvrées"],
            ["📞", "Téléphone", "+33 1 23 45 67 89", "Lun–Ven : 9h–18h"],
            ["📍", "Adresse", "12 rue de la Finance, 75008 Paris", "Siège social"],
            ["🕐", "Horaires", "Lundi – Vendredi", "9h00 – 18h00"],
          ].map(([icon, title, val, sub]) => (
            <div key={title} style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", border: "1px solid #e8eef5", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ fontSize: 24 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 12, color: "#5a7a9a", marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0d1f35" }}>{val}</div>
                <div style={{ fontSize: 12, color: "#aab8c8" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        {sent ? (
          <div style={{ background: "#f0fdf4", borderRadius: 14, padding: "3rem", border: "1px solid #bbf7d0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 48, marginBottom: "1rem" }}>✉️</div>
            <h3 style={{ color: "#166534", fontWeight: 700 }}>Message envoyé !</h3>
            <p style={{ color: "#166534", opacity: 0.8 }}>Nous vous répondrons dans les 4h ouvrées.</p>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 14, padding: "2rem", border: "1px solid #e8eef5" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0d1f35", marginBottom: "1.5rem" }}>Envoyez-nous un message</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {[["Votre nom", "text"], ["Votre email", "email"], ["Sujet", "text"]].map(([p, t]) => (
                <input key={p} placeholder={p} type={t} style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8,
                  border: "1px solid #d0dce8", fontSize: 14, boxSizing: "border-box",
                  outline: "none", fontFamily: "inherit",
                }} />
              ))}
              <textarea placeholder="Votre message..." rows={5} style={{
                width: "100%", padding: "11px 14px", borderRadius: 8,
                border: "1px solid #d0dce8", fontSize: 14, boxSizing: "border-box",
                outline: "none", fontFamily: "inherit", resize: "vertical",
              }} />
              <button onClick={() => setSent(true)} style={{
                background: "#1a3a5c", color: "#fff", border: "none",
                borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Envoyer le message →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────── LAYOUT ─────────────────────────────

export default function App() {
  const [page, setPage] = useState("accueil");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const pages = {
    accueil: <PageAccueil setPage={setPage} />,
    offres: <PageOffres setPage={setPage} />,
    simulateur: <PageSimulateur />,
    demande: <PageDemande />,
    apropos: <PageApropos />,
    faq: <PageFAQ />,
    contact: <PageContact />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafd", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8fafd; }
        input:focus, textarea:focus, select:focus { border-color: #1a3a5c !important; box-shadow: 0 0 0 3px rgba(26,58,92,0.1); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e8eef5",
        padding: "0 2rem",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", height: 64, gap: "2rem" }}>
          <div
            onClick={() => setPage("accueil")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, background: "linear-gradient(135deg, #1a3a5c, #0f4c81)",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: 14,
            }}>CP</div>
            <span style={{ fontWeight: 800, fontSize: 17, color: "#0d1f35", letterSpacing: "-0.02em" }}>CapitalPro</span>
          </div>

          <div style={{ display: "flex", gap: "0.25rem", flex: 1, flexWrap: "nowrap", overflowX: "auto" }}>
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => setPage(l.id)} style={{
                background: page === l.id ? "#f0f4f8" : "transparent",
                color: page === l.id ? "#1a3a5c" : "#5a7a9a",
                fontWeight: page === l.id ? 700 : 400,
                border: "none", borderRadius: 6, padding: "6px 12px",
                cursor: "pointer", fontSize: 13, whiteSpace: "nowrap",
              }}>{l.label}</button>
            ))}
          </div>

          <button onClick={() => setPage("demande")} style={{
            background: "#1a3a5c", color: "#fff", border: "none",
            borderRadius: 7, padding: "8px 18px", fontSize: 13, fontWeight: 700,
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}>Faire une demande</button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main>{pages[page]}</main>

      {/* FOOTER */}
      <footer style={{ background: "#0d1f35", padding: "3rem 2rem 1.5rem", marginTop: "2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 30, height: 30, background: "#1a3a5c", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12 }}>CP</div>
                <span style={{ color: "#fff", fontWeight: 800 }}>CapitalPro</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.7 }}>Financement professionnel rapide et transparent pour toutes les entreprises françaises.</p>
            </div>
            {[
              { title: "Nos offres", links: ["Prêt PME", "Prêt Startup", "Crédit trésorerie", "Financement équipement", "Prêt auto-entrepreneur"] },
              { title: "Entreprise", links: ["À propos", "Équipe", "Contact", "FAQ"] },
              { title: "Légal", links: ["Mentions légales", "Politique de confidentialité", "CGU", "RGPD", "Cookies"] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: "0.75rem" }}>{col.title}</div>
                {col.links.map((l) => (
                  <div key={l} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, padding: "3px 0", cursor: "pointer" }}
                    onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.85)"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                  >{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>© 2025 CapitalPro SAS · RCS Paris B 123 456 789 · Tous droits réservés</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Agréé ACPR · Conforme RGPD · Données hébergées en France 🇫🇷</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
