"use client";

const Services = () => {
    const services = [
        {
            title: "Product Browsing",
            description:
                "Effortlessly browse and search for products from various retailers with detailed information like quantity and expiry dates.",
            icon: "🔍",
        },
        {
            title: "Retailer Integration",
            description: "Access a wide variety of products from top retailers, all in one place, saving you time and effort.",
            icon: "🛒",
        },
        {
            title: "Dynamic Visuals",
            description: "Enjoy a visually rich shopping experience with dynamic animations and smooth transitions.",
            icon: "🎨",
        },
        {
            title: "Personalized Filters",
            description: "Use advanced filters to narrow down your search by product type, region, and availability.",
            icon: "⚙️",
        },
        {
            title: "Excel Import",
            description: "Easily upload Excel files to manage and analyze your product data.",
            icon: "📊",
        },
    ];

    return (
        <section className="bg-white text-gray-800 py-12">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
                <p className="text-lg text-center mb-8">
                    We offer a range of services designed to enhance your shopping experience and simplify your journey to finding
                    the perfect products.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="text-4xl mb-4 text-blue-500">{service.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
