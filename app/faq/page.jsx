"use client";

import { useState } from "react";

const FAQ = () => {
    const faqs = [
        {
            question: "What is this website about?",
            answer: "This website helps users browse, filter, and manage products from various retailers in an intuitive way.",
        },
        {
            question: "How do I upload an Excel file?",
            answer: "You can upload Excel files using our drag-and-drop or file upload feature available on the Upload page.",
        },
        {
            question: "Which retailers are supported?",
            answer: "We currently support T-Market, Kaufland, Lidl, Asda, Tesco, and Maxi Market, with more being added regularly.",
        },
        {
            question: "Can I search for products by region?",
            answer: "Yes! Use our Region Filter feature to narrow down your search based on your preferred location.",
        },
        {
            question: "What happens if I can't find a product image?",
            answer: "If an image isn't available, we display a placeholder image so you can still view the product details.",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = index => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="bg-gray-50 text-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
                <p className="text-lg text-center mb-8">
                    Find answers to some of the most commonly asked questions about our platform.
                </p>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <button
                                className="w-full text-left px-6 py-4 font-semibold text-lg flex justify-between items-center focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <span>{activeIndex === index ? "−" : "+"}</span>
                            </button>
                            {activeIndex === index && <div className="px-6 py-4 text-gray-600">{faq.answer}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
