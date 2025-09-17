// src/pages/certifications.tsx
import "@/styles/style.css";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

type CertImage = { src?: string; alt?: string; width?: number; height?: number };

type Cert = {
    title: string;
    issuer: string;
    date: string;
    description?: string;
    verifyUrl?: string;
    detailUrl?: string;
    image?: CertImage; // optional image for embedded thumbnail
};

const certs: Cert[] = [
    {
        title: "AI-First Software Engineering",
        issuer: "OnWingspan / Course",
        date: "May 22, 2025",
        description: "Course on applying AI-first patterns to software engineering workflows.",
        verifyUrl: "https://validate.onwingspan.com",
        image: { src: "/media/Certifications/AI-First_Software_Engineering.png", alt: "AI-First Software Engineering certificate", width: 800, height: 600 },
    },
    {
        title: "Data Behind LLMs",
        issuer: "OnWingspan / Course",
        date: "May 22, 2025",
        description: "Focused on datasets, curation, and engineering practices behind large language models.",
        verifyUrl: "https://validate.onwingspan.com",
        image: { src: "/media/Certifications/Data_Behind_LLMs.png", alt: "Data Behind LLMs certificate" },
    },
    {
        title: "Introduction to OpenAI GPT Models",
        issuer: "OnWingspan / Course",
        date: "May 22, 2025",
        description: "Overview of GPT model families, capabilities, and practical considerations.",
        verifyUrl: "https://validate.onwingspan.com",
        image: { src: "/media/Certifications/Introduction_to_OpenAI_GPT_Models.png", alt: "Intro to GPT Models certificate" },
    },
    {
        title: "Prompt Engineering",
        issuer: "OnWingspan / Course",
        date: "May 20-21, 2025",
        description: "Practical prompt design and prompt-engineering patterns for LLMs.",
        verifyUrl: "https://validate.onwingspan.com",
        image: { src: "/media/Certifications/Prompt_Engineering.png", alt: "Prompt Engineering certificate" },
    },
];

function ImageArea({ image, fallbackLabel }: { image?: CertImage; fallbackLabel?: string }) {
    // If an image src is available, render it; otherwise render a placeholder box
    if (image?.src) {
        return (
            <figure className="cert-figure" style={{ marginBottom: ".75rem" }}>
                <img
                    className="cert-img"
                    src={image.src}
                    alt={image.alt ?? fallbackLabel ?? "Certificate image"}
                    loading="lazy"
                    width={image.width ?? 800}
                    height={image.height ?? 600}
                    style={{ maxWidth: "100%", height: "auto", borderRadius: ".5rem", boxShadow: "var(--shadow-lg)" }}
                />
            </figure>
        );
    }

    return (
        <figure
            className="cert-placeholder"
            aria-hidden="true"
            style={{
                marginBottom: ".75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 160,
                borderRadius: ".5rem",
                background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                border: "1px dashed rgba(255,255,255,0.06)",
                color: "var(--muted)",
                fontStyle: "italic",
                boxShadow: "var(--shadow-lg)",
            }}
        >
            {fallbackLabel ?? "Certificate image (add `image.src`)"}
        </figure>
    );
}

function CertCard({ c }: { c: Cert }) {
    return (
        <article className="entry-wrapper" style={{ marginBottom: "1.25rem" }}>
            <ImageArea image={c.image} fallbackLabel={c.title} />

            <h2 style={{ marginBottom: ".25rem" }}>{c.title}</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>
                <strong>{c.issuer}</strong> — <span style={{ fontStyle: "italic" }}>{c.date}</span>
            </p>
            {c.description ? <p style={{ marginTop: ".5rem" }}>{c.description}</p> : null}
            <p style={{ marginTop: ".5rem" }}>
                {c.verifyUrl ? (
                    <a className="futuristic-link" href={c.verifyUrl} target="_blank" rel="noopener">
                        Verify certificate
                    </a>
                ) : null}
                {c.detailUrl ? (
                    <>
                        {" • "}
                        <a className="futuristic-link" href={c.detailUrl} target="_blank" rel="noopener">
                            View certificate (PDF)
                        </a>
                    </>
                ) : null}
            </p>
        </article>
    );
}

function PresentationCard({ image }: { image?: CertImage }) {
    return (
        <section className="entry-wrapper" style={{ marginBottom: "1.25rem" }}>
            <ImageArea image={image} fallbackLabel="UB Presentation certificate" />

            <h2>Presentation — University of Bridgeport (Engineering Colloquia)</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>
                <strong>University of Bridgeport — Faculty of the School of Engineering</strong> — April 3, 2025
            </p>
            <p style={{ marginTop: ".5rem" }}>
                Delivered a colloquium presentation to UB’s School of Engineering. Received a Certificate of Appreciation
                from the Dean for the Engineering Colloquia Series.
            </p>
            <p style={{ marginTop: ".5rem" }}>
                <a className="futuristic-link" href="#" onClick={(e) => e.preventDefault()}>
                    View Certificate of Appreciation
                </a>
            </p>
        </section>
    );
}

function App() {
    return (
        <>

            <Helmet>
                <title>Certifications & Presentation — Rexford Dorchester</title>
                <meta
                    name="description"
                    content="Selected professional certificates and my University of Bridgeport Engineering Colloquia presentation."
                />
                <link rel="canonical" href="https://rexforddorchester.com/Certifications/" />
            </Helmet>


            <div className="futuristic-bg" aria-hidden="true" />
            <Navbar />

            <section className="card futuristic-card" style={{ marginTop: "1rem" }}>
                <h1 className="glow">Certifications & Presentation</h1>
                <p className="subtitle">Selected, high-impact certificates and my Engineering Colloquia presentation.</p>
            </section>

            <main className="container card" style={{ position: "relative", zIndex: 1, marginTop: "1.5rem" }}>
                <section>
                    <h3 style={{ marginTop: 0 }}>Selected Certifications</h3>
                    {certs.map((c) => (
                        <CertCard key={c.title} c={c} />
                    ))}
                </section>

                <section style={{ marginTop: "1rem" }}>
                    <h3>University Presentation</h3>
                    {/* pass in an image if you have one for the presentation certificate */}
                    <PresentationCard image={{ src: "/media/Certifications/Rexford_Dorchester_Certificate_ENGR_400.png", alt: "UB Certificate" }} />
                </section>

                <footer style={{ marginTop: "2rem", opacity: 0.8 }}>
                    <small>
                        These are the most relevant professional certificates and the University of Bridgeport presentation I
                        delivered. For verification or full PDF copies, see the certificate links or contact me.
                    </small>
                </footer>
            </main>
        </>
    );
}

createRoot(document.getElementById("app")!).render(
    <HelmetProvider>
        <App />
    </HelmetProvider>
);
