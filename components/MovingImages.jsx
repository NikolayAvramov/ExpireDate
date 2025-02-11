"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const MovingImages = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        if (container) {
            gsap.to(container, {
                x: "-100%",
                duration: 10,
                ease: "linear",
                repeat: -1,
            });
        }
    }, []);

    const images = [
        { src: "/assets/t-market_logo-900x900.jpg", alt: "T-Market" },
        { src: "/assets/Kaufland_Deutschland.png", alt: "Kaufland" },
        { src: "/assets/asda-logo-aspect-ratio-21-9-1024x438.jpeg", alt: "Asda" },
        { src: "/assets/gffs.png", alt: "Maxi Market" },
        { src: "/assets/Lidl-Logo.svg.jpeg", alt: "Lidl" },
        { src: "/assets/images.png", alt: "Tesco" },
        { src: "/assets/t-market_logo-900x900.jpg", alt: "T-Market" },
        { src: "/assets/Kaufland_Deutschland.png", alt: "Kaufland" },
        { src: "/assets/asda-logo-aspect-ratio-21-9-1024x438.jpeg", alt: "Asda" },
        { src: "/assets/gffs.png", alt: "Maxi Market" },
        { src: "/assets/Lidl-Logo.svg.jpeg", alt: "Lidl" },
        { src: "/assets/images.png", alt: "Tesco" },
        { src: "/assets/t-market_logo-900x900.jpg", alt: "T-Market" },
        { src: "/assets/Kaufland_Deutschland.png", alt: "Kaufland" },
        { src: "/assets/asda-logo-aspect-ratio-21-9-1024x438.jpeg", alt: "Asda" },
        { src: "/assets/gffs.png", alt: "Maxi Market" },
        { src: "/assets/Lidl-Logo.svg.jpeg", alt: "Lidl" },
        { src: "/assets/images.png", alt: "Tesco" },
        { src: "/assets/t-market_logo-900x900.jpg", alt: "T-Market" },
        { src: "/assets/Kaufland_Deutschland.png", alt: "Kaufland" },
        { src: "/assets/asda-logo-aspect-ratio-21-9-1024x438.jpeg", alt: "Asda" },
        { src: "/assets/gffs.png", alt: "Maxi Market" },
        { src: "/assets/Lidl-Logo.svg.jpeg", alt: "Lidl" },
        { src: "/assets/images.png", alt: "Tesco" },
    ];

    return (
        <div className="relative w-screen h-48 overflow-hidden bg-gray-100 flex items-center">
            <div ref={containerRef} className="flex">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.src}
                        alt={image.alt || `Image ${index + 1}`}
                        className="w-32 h-32 object-contain mx-4"
                    />
                ))}
                {images.map((image, index) => (
                    <img
                        key={`duplicate-${index}`}
                        src={image.src}
                        alt={image.alt || `Duplicate Image ${index + 1}`}
                        className="w-32 h-32 object-contain mx-4"
                    />
                ))}
            </div>
        </div>
    );
};

export default MovingImages;
