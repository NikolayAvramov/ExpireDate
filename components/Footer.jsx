"use client";

import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="text-gray-400">
                            We are committed to delivering the best products to our customers. Our mission is to ensure quality
                            and satisfaction every time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Products
                                </Link>
                            </li>
                            <li className="text-gray-400 hover:text-white transition-colors duration-200">
                                <Link href="/services">Services</Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400">Email: support@example.com</li>
                            <li className="text-gray-400">Phone: +1 234 567 890</li>
                            <li className="text-gray-400">Address: 123 Main St, Cityville</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-6 text-center">
                    <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
