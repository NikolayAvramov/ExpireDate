"use client";

import { motion } from "framer-motion";
import { FaLeaf, FaRecycle, FaHandshake, FaChartLine } from "react-icons/fa";

const About = () => {
    const stats = [
        { number: "1000+", label: "Products Saved", icon: <FaLeaf className="text-green-500" /> },
        { number: "50+", label: "Partner Markets", icon: <FaHandshake className="text-blue-500" /> },
        { number: "10K+", label: "Happy Customers", icon: <FaChartLine className="text-purple-500" /> },
        { number: "5T+", label: "Food Waste Prevented", icon: <FaRecycle className="text-yellow-500" /> },
    ];

    const team = [
        {
            name: "John Doe",
            role: "CEO & Founder",
            image: "/assets/team1.jpg",
            description: "Passionate about reducing food waste and creating sustainable solutions."
        },
        {
            name: "Jane Smith",
            role: "Head of Operations",
            image: "/assets/team2.jpg",
            description: "Expert in supply chain management and market relations."
        },
        {
            name: "Mike Johnson",
            role: "Tech Lead",
            image: "/assets/team3.jpg",
            description: "Driving innovation in our platform's development."
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] bg-gradient-to-r from-blue-400 to-emerald-400 text-white">
                <div className="absolute inset-0 bg-white/20" />
                <div className="relative max-w-7xl mx-auto h-full flex items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">About ReFresh</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                            Connecting consumers with discounted products while reducing food waste
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="text-4xl mb-4 flex justify-center">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                                <div className="text-blue-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h2 className="text-3xl font-bold text-blue-600 mb-6">Our Mission</h2>
                            <p className="text-lg text-blue-800 mb-6">
                                At ReFresh, we're on a mission to revolutionize the way we handle food waste. We believe that
                                every product deserves a chance to be enjoyed, and every consumer deserves access to quality
                                products at affordable prices.
                            </p>
                            <p className="text-lg text-blue-800">
                                By connecting consumers with discounted products nearing their expiration date, we're creating
                                a win-win situation for everyone involved - from retailers to consumers to the environment.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg p-8 shadow-md">
                            <h3 className="text-2xl font-semibold text-blue-600 mb-4">What We Offer</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="text-emerald-500 mr-2">✓</span>
                                    <span className="text-blue-800">Easy-to-use product search and filters</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-500 mr-2">✓</span>
                                    <span className="text-blue-800">Real-time inventory updates</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-500 mr-2">✓</span>
                                    <span className="text-blue-800">Seamless market integration</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-500 mr-2">✓</span>
                                    <span className="text-blue-800">Detailed product information</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Team</h2>
                        <p className="text-lg text-blue-800 max-w-2xl mx-auto">
                            Meet the passionate individuals behind ReFresh, dedicated to making a difference in food waste reduction.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="h-64 bg-gradient-to-br from-blue-100 to-emerald-100">
                                    {/* Placeholder for team member images */}
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-blue-500">Team Member Photo</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-blue-600 mb-2">{member.name}</h3>
                                    <p className="text-emerald-500 mb-4">{member.role}</p>
                                    <p className="text-blue-800">{member.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-blue-600 mb-6">Our Values</h2>
                        <p className="text-lg text-blue-800 max-w-3xl mx-auto mb-12">
                            We prioritize customer satisfaction, innovation, and sustainability. Our goal is to make shopping
                            more accessible and enjoyable for everyone while supporting local and global retailers.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-blue-600 mb-4">Sustainability</h3>
                                <p className="text-blue-800">
                                    We're committed to reducing food waste and promoting sustainable practices in retail.
                                </p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-blue-600 mb-4">Innovation</h3>
                                <p className="text-blue-800">
                                    Constantly evolving our platform to provide the best experience for our users.
                                </p>
                            </div>
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h3 className="text-xl font-semibold text-blue-600 mb-4">Community</h3>
                                <p className="text-blue-800">
                                    Building strong relationships with markets and customers to create a better future.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
