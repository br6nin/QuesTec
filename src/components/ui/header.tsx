// src/components/Header.tsx

'use client'; 
import { useState } from 'react';
import Link from 'next/link';
// IMPORTAÇÕES NECESSÁRIAS
import { Button } from '@/components/ui/button'; 
import { Menu, X } from 'lucide-react'; // Ícones para o menu (PenTool removido, substituído pela imagem)

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo QuesTec - AGORA COM A IMAGEM PNG */}
                    <div className="flex items-center space-x-2">
                        <Link href="/">
                            <img 
                                src="https://noxxvyznjrozaxwldnpv.supabase.co/storage/v1/object/public/logo/brand%20questec.jpg" 
                                alt="Logo QuesTec" 
                                className="w-50 h-50 object-contain" 
                            />
                        </Link>
                        {/* Nome QuesTec visível em telas maiores */}
                        <Link href="/" className="text-2xl font-bold text-gray-900 hidden sm:block">QuesTec</Link>
                    </div>

                    {/* NAVEGAÇÃO DESKTOP */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="/#how" className="text-gray-600 hover:text-gray-900 transition">Como Funciona</a>
                        <a href="/#plans" className="text-gray-600 hover:text-gray-900 transition">Planos</a>
                        <a href="/#testimonials" className="text-gray-600 hover:text-gray-900 transition">Depoimentos</a>
                        <a href="/#contact" className="text-gray-600 hover:text-gray-900 transition">Contato</a>
                        <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition">Blog</Link>
                    </nav>

                    {/* Botões e Hamburger */}
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="hidden md:block">
                            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">Entrar</Button>
                        </Link>
                        <Link href="/register" className="hidden md:block">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Cadastrar</Button>
                        </Link>
                        <Link href="/admin" className="hidden md:block"> 
                            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Admin</Button>
                        </Link>

                        <button 
                            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MENU MOBILE EXPANSÍVEL */}
            <div 
                className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100 py-2' : 'max-h-0 opacity-0'}`}
            >
                <div className="flex flex-col space-y-2 px-4 pb-4">
                    <a onClick={() => setIsMenuOpen(false)} href="/#how" className="py-2 text-gray-700 hover:bg-gray-100 rounded-md px-2">Como Funciona</a>
                    <a onClick={() => setIsMenuOpen(false)} href="/#plans" className="py-2 text-gray-700 hover:bg-gray-100 rounded-md px-2">Planos</a>
                    <a onClick={() => setIsMenuOpen(false)} href="/#testimonials" className="py-2 text-gray-700 hover:bg-gray-100 rounded-md px-2">Depoimentos</a>
                    <a onClick={() => setIsMenuOpen(false)} href="/#contact" className="py-2 text-gray-700 hover:bg-gray-100 rounded-md px-2">Contato</a>
                    <Link onClick={() => setIsMenuOpen(false)} href="/blog" className="py-2 text-gray-700 hover:bg-gray-100 rounded-md px-2">Blog</Link>
                    
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="py-2 text-blue-600 hover:bg-blue-50 rounded-md px-2 border border-blue-600 text-center mt-2">Entrar</Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)} className="py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md px-2 text-center">Cadastrar</Link>
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="py-2 text-gray-600 hover:bg-gray-100 rounded-md px-2 text-center">Admin</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;