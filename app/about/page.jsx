"use client";

const About = () => {
    return (
        <section className="bg-gray-100 text-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-6">About Us</h2>
                <p className="text-lg text-center mb-6">
                    Welcome to our website! We are committed to providing you with the best shopping experience by connecting you
                    with top products, offers, and retailers. Whether you’re looking for daily essentials or special items, our
                    platform is here to simplify your search.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                        <p>
                            Our mission is to create a seamless bridge between consumers and retailers, ensuring everyone has
                            access to quality products at the best prices. We strive to empower shoppers with transparency and
                            convenience.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                        <ul className="list-disc pl-6">
                            <li>Easy-to-use product search and filters</li>
                            <li>Dynamic and engaging visuals to enhance your browsing experience</li>
                            <li>Seamless integration with multiple retailers for a variety of products</li>
                            <li>Detailed product information including quantity and expiry dates</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">Our Values</h3>
                    <p>
                        We prioritize customer satisfaction, innovation, and sustainability. Our goal is to make shopping more
                        accessible and enjoyable for everyone while supporting local and global retailers.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
