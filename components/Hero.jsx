"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

export default function Hero() {
    const heroRef = useRef(null);
    const headingRef = useRef(null);
    const subheadingRef = useRef(null);
    const ctaRef = useRef(null);
    const secondaryCtaRef = useRef(null);
    const floatingElementRef = useRef(null);
  
    useGSAP(() => {
        // Background gradient animation
        gsap.to(heroRef.current, {
            background: "linear-gradient(45deg, #4ade80, #3b82f6, #4ade80)",
            duration: 10,
            repeat: -1,
            ease: "none",
            backgroundSize: "200% 200%",
            backgroundPosition: "0% 50%",
        });

        // Floating animation for decorative element
        gsap.to(floatingElementRef.current, {
            y: 20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Main content animations
        gsap.fromTo(headingRef.current, 
            { opacity: 0, y: -50 }, 
            { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
        );

        gsap.fromTo(
            subheadingRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: "power4.out", delay: 0.5 }
        );

        gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)", delay: 1 }
        );

        gsap.fromTo(
            secondaryCtaRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)", delay: 1.2 }
        );
    }, heroRef);

    return (
        <section
            ref={heroRef}
            className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white py-24 px-6 md:px-16 lg:px-24 overflow-hidden min-h-[80vh] flex items-center"
        >
            {/* Decorative floating element */}
            <div 
                ref={floatingElementRef}
                className="absolute top-1/4 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            />

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <h1 
                    ref={headingRef} 
                    className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
                >
                    Save Big on Almost Expired Products
                </h1>
                <p 
                    ref={subheadingRef} 
                    className="mt-6 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed"
                >
                    Get incredible discounts while helping reduce food waste. Stock up on your favorite products today!
                </p>
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                    <div ref={ctaRef}>
                        <Link
                            href="/products"
                            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg md:text-xl font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                            Shop Now
                        </Link>
                    </div>
                    <div ref={secondaryCtaRef}>
                        <Link
                            href="/about"
                            className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
