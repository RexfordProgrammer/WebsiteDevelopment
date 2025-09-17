// src/pages/code.tsx
import "@/styles/style.css";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";

type Link = { label: string; href: string; external?: boolean };
type Project = {
    title: string;
    description: string;
    links: Link[];
    tags?: string[];
    image?: { src: string; alt?: string; width?: number; height?: number };
};

const projects: Project[] = [
    {
        title: "AI model for diagnostics in Mental Health Field",
        description:
            "My most recent project is functional but NOT public. It demonstrates the four pillars of OOP effectively in its current form.",
        links: [{ label: "MedInformer GitHub PRIVATE", href: "", external: true }],
        tags: ["Java", "OOP"],
        image: { src: "/media/code/medinformer.png", alt: "MedInformer screenshot", width: 600, height: 400 },
    },
    {
        title: "Predictive Model Using Machine Learning",
        description:
            "Python + scikit-learn/NumPy/pandas for stock movement prediction: data cleaning, feature engineering (MAs, volatility, volume), model training (LR/DT/SVM), cross-validation & hyperparameter tuning.",
        links: [{ label: "GitHub", href: "https://github.com/RexfordProgrammer/Predictive-Model", external: true }],
        tags: ["Python", "ML", "pandas", "sklearn"],
        image: { src: "/media/code/stockprediction.jpg", alt: "Stock Prediction Code", width: 600, height: 400 },

    },
    {
        title: "Web Skimmer for Internships",
        description:
            "Pyppeteer automation to navigate listings, interact with pages, extract internships by criteria, and send notifications.",
        links: [{ label: "GitHub", href: "https://github.com/RexfordProgrammer/WebScraperForJobs", external: true }],
        tags: ["Python", "Automation", "Pyppeteer"],
        image: { src: "/media/code/jobskimmer.jpg", alt: "Job Skimmer Code", width: 600, height: 400 },

    },
    {
        title: "ESP32 Humidistat Project",
        description:
            "ESP32 + DHT22 + LCD for real-time humidity/temperature display. Custom library setup for reliable readings.",
        links: [{ label: "GitHub", href: "https://github.com/RexfordProgrammer/Humidistat-Project/", external: true }],
        tags: ["C++", "ESP32", "Embedded"],
        image: { src: "/media/code/stockprediction.jpg", alt: "Stock Prediction Code", width: 600, height: 400 },
    },
    {
        title: "Batch File Alarm Clock",
        description:
            "Windows Task Scheduler orchestrated by batch scripts to create a customizable alarm. Integrates NIRCMD for volume/peripheral control.",
        links: [{ label: "GitHub", href: "https://github.com/RexfordProgrammer/Batch-File-Alarm-Clock", external: true }],
        tags: ["Batch", "Windows", "Automation"],
        image: { src: "/media/code/jobskimmer.jpg", alt: "Job Skimmer Code", width: 600, height: 400 },
    },
    {
        title: "Customized Marlin Build (SKR Mini E3)",
        description:
            "Custom-configured Marlin firmware for a bespoke 3D printer (early 2022) targeting the SKR Mini E3 board.",
        links: [{ label: "GitHub", href: "https://github.com/RexfordProgrammer/Marlin-for-SKR-Mini-E3-Project", external: true }],
        tags: ["Marlin", "3D Printing", "Firmware"],
        image: { src: "/media/code/controlboard.jpg", alt: "Marlin Board", width: 600, height: 400 },
    },
    {
        title: "Flesh (Top-Down Shooter, 2016)",
        description:
            "AP CS final project. Historical snapshot: inheritance, encapsulation, polymorphism (not fully SOLID principals). Includes am (interestingly) Portuguese video review.",
        links: [
            { label: "GitHub", href: "https://github.com/RexfordProgrammer/Flesh", external: true },
            { label: "YouTube", href: "https://www.youtube.com/watch?v=sB4B6c9ymW4", external: true },
        ],
        image: { src: "/media/code/sugarcanemadness-2.png", alt: "Sugarcane Madness", width: 600, height: 400 },
    },
    {
        title: "Where my interest in programming began",
        description:
            "Earliest Java calculators from an old Eclipse workspace—my first attempts at automating homework.",
        links: [
            { label: "Java programs (2011–2012)", href: "https://github.com/RexfordProgrammer/Java-Programs-from-2011-2012", external: true },
        ],
        image: { src: "/media/code/2011HwCalculator.jpg", alt: "Homework Calculator (2011)", width: 600, height: 400 },
    },
];

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a className="futuristic-link" href={href} target="_blank" rel="noopener">
            {children}
        </a>
    );
}

function ProjectCard({ p }: { p: Project }) {
    // Use first link as the click-through for the image (optional)
    const primaryHref = p.links?.[0]?.href;

    return (
        <article className="entry-wrapper" style={{ marginBottom: "1.25rem" }}>
            {p.image && (
                <figure className="project-figure">
                    {primaryHref ? (
                        <a href={primaryHref} target={p.links[0].external ? "_blank" : undefined} rel="noopener">
                            <img
                                className="project-img"
                                src={p.image.src}
                                alt={p.image.alt ?? p.title}
                                loading="lazy"
                                width={p.image.width}
                                height={p.image.height}
                            />
                        </a>
                    ) : (
                        <img
                            className="project-img"
                            src={p.image.src}
                            alt={p.image.alt ?? p.title}
                            loading="lazy"
                            width={p.image.width}
                            height={p.image.height}
                        />
                    )}
                </figure>
            )}

            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <p style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {p.links.map((l) =>
                    l.external ? (
                        <a key={l.href} className="futuristic-link" href={l.href} target="_blank" rel="noopener">
                            {l.label}
                        </a>
                    ) : (
                        <a key={l.href} className="futuristic-link" href={l.href}>
                            {l.label}
                        </a>
                    )
                )}
            </p>
            {p.tags?.length ? (
                <p style={{ opacity: 0.8, fontSize: ".95rem" }}>
                    {p.tags.map((t) => (
                        <code key={t} style={{ marginRight: ".5rem" }}>{t}</code>
                    ))}
                </p>
            ) : null}
        </article>
    );
}
function App() {
    return (
        <>
            {/* <Helmet>
                <title>Code Samples Gallery — Rexford Dorchester</title>
                <meta
                    name="description"
                    content="Selected projects — Python, ML, embedded, scripting, and early Java."
                />
                <link rel="canonical" href="https://rexforddorchester.com/Code/" />
            </Helmet> */}
            <Navbar />

            <div className="futuristic-bg" aria-hidden="true" />
            {<section className="card futuristic-card">
                <h1 className="glow">Code Samples Gallery</h1>
                <p className="subtitle">Selected projects — Python, ML, embedded, scripting, and early Java.</p>
            </section>}

            <section className="container card" style={{ position: "relative", zIndex: 1, marginTop: "1.5rem" }}>
                {projects.length ? (
                    projects.map((p) => <ProjectCard key={p.title} p={p} />)
                ) : (
                    <p style={{ opacity: 0.8 }}>
                        No projects to display yet. Add items to <code>projects</code> or import from a data file.
                    </p>
                )}
            </section>
        </>
    );
}

createRoot(document.getElementById("app")!).render(
    <HelmetProvider>
        <App />
    </HelmetProvider>
);
