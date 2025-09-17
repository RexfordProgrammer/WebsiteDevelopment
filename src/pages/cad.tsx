// src/pages/cad.tsx
import { Navbar } from "@/components/navbar";
import "@/styles/style.css";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";

// --- Types ---
type GalleryItem = { thumb: string; full?: string; alt?: string; caption?: string };
type Callout = {
    images: { src: string; alt?: string }[];
    caption: string;
};

// --- Thumbnail gallery (quick scan / open full image in new tab) ---
const gallery: GalleryItem[] = [
    {
        thumb: "/media/CAD/LinearBearingMount (2).png",
        full: "/media/CAD/LinearBearingMount (2).png",
        alt: "Bearing holder view 1",
    },
    {
        thumb: "/media/CAD/LinearBearingMount (3).png",
        full: "/media/CAD/LinearBearingMount (3).png",
        alt: "Bearing holder view 2",
    },
];

// --- Featured callouts with captions (long-form) ---
const callouts: Callout[] = [
    {
        images: [{ src: "/media/CAD/ScrewdriverBitHolder.png", alt: "Screwdriver bit holder" }],
        caption:
            "Depiction of the mating interface of a screwdriver tip, designed with conical threading to ensure secure and efficient connections.",
    },
    {
        images: [
            { src: "/media/CAD/WindshieldSprayerNozzle.png", alt: "Sprayer nozzle – perspective 1" },
            { src: "/media/CAD/SprayerNozzleCutaway.png", alt: "Sprayer nozzle – perspective 2" },
        ],
        caption:
            "Dual Perspectives of a 3D-Printable Sprayer Nozzle Designed for Automotive Windshields",
    },
    {
        images: [{ src: "/media/CAD/PIPBox.png", alt: "Print-in-place latching box" }],
        caption:
            "Detailed Visualisation of a Print-in-Place Latching Box, allowing immediate utilisation through the integrated printing of its two distinct parts",
    },
    {
        images: [{ src: "/media/CAD/FanShroudHotend.png", alt: "Quiet fan shroud for Ender 3" }],
        caption:
            "Technical Illustration of a Fan Shroud Designed for minimum noise over the stock 40mm shroud of an Creality Ender 3, 3D printer",
    },
    {
        images: [
            { src: "/media/CAD/BallSocket-1.png", alt: "Ball socket - variant 1" },
            { src: "/media/CAD/BallSocket-2.png", alt: "Ball socket - variant 2" },
            { src: "/media/CAD/BallSocket-3.png", alt: "Ball socket - variant 3" },
        ],
        caption:
            "Series of Three Ball Socket Models Developed to Secure Phone Holders, Compatible with Most Conventional Phone Mounts.",
    },
    {
        images: [{ src: "/media/CAD/BuckConverterEnclosure.png", alt: "Buck converter enclosure" }],
        caption:
            "3D model of a buck converter enclosure, incorporating modular components and robust structural support.",
    },
    {
        images: [{ src: "/media/CAD/MeasuringCup.png", alt: "Measuring cup with graduations" }],
        caption:
            "3D Model of a Measuring Cup Featuring Precision Graduations and an Ergonomic Handle for Enhanced Usability.",
    },
];

// --- Components ---
function Gallery({ items, columns = 3 }: { items: GalleryItem[]; columns?: number }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: "12px",
            }}
        >
            {items.map((g, i) => (
                <figure key={i} className="gallery__item">
                    <a href={g.full ?? g.thumb} target="_blank" rel="noopener">
                        <img src={g.thumb} alt={g.alt ?? ""} loading="lazy" style={{ width: "100%", height: "auto" }} />
                    </a>
                    {g.caption && <figcaption>{g.caption}</figcaption>}
                </figure>
            ))}
        </div>
    );
}

function CalloutBlock({ images, caption }: Callout) {
    return (
        <figure className="post__image post__image--center">
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${Math.min(images.length, 3)}, minmax(0, 1fr))`,
                    gap: "10px",
                    alignItems: "start",
                }}
            >
                {images.map((img, idx) => (
                    <a key={idx} href={img.src} target="_blank" rel="noopener" style={{ display: "block" }}>
                        <img src={img.src} alt={img.alt ?? ""} loading="lazy" style={{ width: "100%", height: "auto" }} />
                    </a>
                ))}
            </div>
            <figcaption style={{ marginTop: "0.5rem" }}>{caption}</figcaption>
        </figure>
    );
}

function App() {
    return (
        <>
            {/* {
                <Helmet>
                    <title>CAD Samples Gallery — Rexford Dorchester</title>
                    <meta name="description" content="Selected SolidWorks parts and assemblies." />
                    <link rel="canonical" href="https://rexforddorchester.com/CAD/" />
                </Helmet>
            } */}

            <div className="futuristic-bg" aria-hidden="true" />
            <Navbar />


            <section className="card futuristic-card">
                <h1 className="glow">CAD Samples Gallery</h1>
                <p className="subtitle">Selected SolidWorks parts and assemblies. These are a few of my favorites.</p>
            </section>

            {/* zIndex ensures this content sits above the bg */}
            <section className="container card" style={{ position: "relative", zIndex: 1, marginTop: "1.5rem" }}>
                <p>
                    Below are selected examples of Computer-Aided Design (CAD) parts that I have developed, primarily using
                    SolidWorks. While numerous additional designs exist, these represent some of my preferred projects.
                </p>

                <h2>Photo Gallery</h2>
                {gallery.length ? <Gallery items={gallery} columns={3} /> : <p style={{ opacity: 0.8 }}>No images yet.</p>}

                <p style={{ marginTop: "1rem" }}>
                    The photos above represent a, 3D print friendly, model of a bearing holder for modifying an Ender 3 3D printer
                    to operate with bearing rods and bearings rather than wheels as come stock.
                </p>

                <h2 style={{ marginTop: "2rem" }}>Featured Pieces & Callouts</h2>
                {callouts.map((c, i) => (
                    <CalloutBlock key={i} images={c.images} caption={c.caption} />
                ))}

                <footer style={{ opacity: 0.7, fontSize: "0.9rem", marginTop: "2rem" }}>
                    <small>Powered by Publii (previous site), now migrated to a custom React build.</small>
                </footer>
            </section>
        </>
    );
}

createRoot(document.getElementById("app")!).render(
    <HelmetProvider>
        <App />
    </HelmetProvider>
);
