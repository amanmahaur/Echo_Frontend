import React from 'react';
import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-zinc-900 bg-opacity-50 backdrop-blur-md text-white py-6 px-5 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Social Icons */}
                <div className="flex space-x-6 mb-4 md:mb-0">
                    <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">
                        <Instagram size={24} />
                    </a>
                    <a href="https://www.facebook.com/aman.mahaur.77"  target='_blank' rel="noopener noreferrer" className="hover:text-blue-500 transition">
                        <Facebook size={24} />
                    </a>
                    <a href="https://www.linkedin.com/in/aman-mahaur-942a94262" target='_blank' rel="noopener noreferrer" className="hover:text-blue-400 transition">
                        <Linkedin size={24} />
                    </a>
                    <a href="mailto:amanmahaur056@gmail.com" className="hover:text-red-400 transition">
                        <Mail size={24} />
                    </a>
                </div>

                {/* Copyright */}
                <div className="text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} The Echo Journal. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
