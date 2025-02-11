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

    useGSAP(() => {
        gsap.fromTo(headingRef.current, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" });

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
    }, heroRef);

    return (
        <section
            ref={heroRef}
            className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 px-6 md:px-16 lg:px-24 overflow-hidden h-[80vh]"
        >
            <div className="max-w-7xl mx-auto text-center">
                <h1 ref={headingRef} className="text-4xl md:text-6xl font-extrabold tracking-tight">
                    Save Big on Almost Expired Products
                </h1>
                <p ref={subheadingRef} className="mt-4 text-lg md:text-xl font-medium">
                    Get incredible discounts while helping reduce food waste. Stock up on your favorite products today!
                </p>
                <div ref={ctaRef} className="mt-8">
                    <Link
                        href="/products"
                        className="bg-white text-green-500 hover:bg-gray-200 px-8 py-4 text-lg md:text-xl font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
