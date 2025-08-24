import React from 'react'
import { ArrowRight, MessageCircle, Shield, Zap, Users, Globe, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mcpAnalytics } from '../lib/mcp-api'

const LandingPage: React.FC = () => {
    React.useEffect(() => {
        mcpAnalytics.trackEvent('page_view', { page: 'landing' })
    }, [])

    const handleCTAClick = () => {
        mcpAnalytics.trackEvent('cta_click', { location: 'hero' })
    }

    const features = [
        {
            icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
            title: "Sanntids Chat",
            description: "Chat med venner og kolleger i sanntid med avanserte funksjoner"
        },
        {
            icon: <Shield className="w-8 h-8 text-green-600" />,
            title: "Sikker & Privat",
            description: "Ende-til-ende kryptering beskytter alle dine samtaler"
        },
        {
            icon: <Zap className="w-8 h-8 text-yellow-600" />,
            title: "AI-Assistent",
            description: "Innebygd AI-assistent for å hjelpe deg med daglige oppgaver"
        },
        {
            icon: <Users className="w-8 h-8 text-purple-600" />,
            title: "Team-Samarbeid",
            description: "Opprett team-rom for bedre samarbeid på jobb"
        },
        {
            icon: <Globe className="w-8 h-8 text-indigo-600" />,
            title: "Multilingval",
            description: "Chat på norsk, engelsk eller få automatisk oversettelse"
        },
        {
            icon: <Star className="w-8 h-8 text-orange-600" />,
            title: "Premium Funksjoner",
            description: "Få tilgang til eksklusive funksjoner med våre premium planer"
        }
    ]

    const testimonials = [
        {
            name: "Erik Hansen",
            role: "Tech Lead, StartupOslo",
            content: "SnakkaZ har revolusjonert måten teamet vårt kommuniserer på. Norsk fokus og AI-integrasjon er fantastisk!"
        },
        {
            name: "Ingrid Larsen",
            role: "Prosjektleder, Bergen Tech",
            content: "Endelig en chat-app laget for norske bedrifter. Sikkerhet og brukervennlighet i toppklasse."
        },
        {
            name: "Ole Bjørn",
            role: "Gründer, InnovasjonsHus",
            content: "Fra gratis til enterprise - SnakkaZ vokser med bedriften vår. Anbefaler på det sterkeste!"
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">SnakkaZ</span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                                Funksjoner
                            </a>
                            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                                Priser
                            </a>
                            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
                                Anmeldelser
                            </a>
                        </nav>
                        <div className="flex space-x-4">
                            <Link
                                to="/auth"
                                className="text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Logg inn
                            </Link>
                            <Link
                                to="/auth"
                                onClick={handleCTAClick}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                            >
                                <span>Kom i gang</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Den <span className="text-blue-600">smarte</span> chat-appen
                        <br />for <span className="text-red-600">Norge</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        SnakkaZ kombinerer sikker chat, AI-assistent og team-samarbeid i én kraftig plattform.
                        Laget spesielt for norske brukere og bedrifter.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/auth"
                            onClick={handleCTAClick}
                            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold"
                        >
                            <span>Start gratis i dag</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/pricing"
                            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold"
                        >
                            <span>Se priser</span>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        ✅ Ingen kredittkort påkrevd • ✅ 30 dagers pengene-tilbake-garanti
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Alt du trenger for moderne kommunikasjon
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Fra personlig chat til enterprise-løsninger - SnakkaZ har funksjonene du trenger
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Hva sier våre brukere?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Tusenvis av norske brukere stoler på SnakkaZ hver dag
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Klar til å revolusjonere kommunikasjonen din?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Bli med tusenvis av fornøyde norske brukere som allerede bruker SnakkaZ
                    </p>
                    <Link
                        to="/auth"
                        onClick={handleCTAClick}
                        className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 text-lg font-semibold"
                    >
                        <span>Start din gratis prøveperiode</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <p className="text-sm text-blue-200 mt-4">
                        30 dagers pengene-tilbake-garanti • Ingen bindingstid
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <MessageCircle className="w-8 h-8 text-blue-400" />
                                <span className="text-2xl font-bold">SnakkaZ</span>
                            </div>
                            <p className="text-gray-400">
                                Den smarteste chat-appen for Norge. Sikker, kraftig og brukervennlig.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Produkt</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/pricing" className="hover:text-white">Priser</Link></li>
                                <li><a href="#features" className="hover:text-white">Funksjoner</a></li>
                                <li><Link to="/chat" className="hover:text-white">Chat</Link></li>
                                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="mailto:support@snakkaz.com" className="hover:text-white">Kontakt oss</a></li>
                                <li><a href="/help" className="hover:text-white">Hjelp</a></li>
                                <li><a href="/privacy" className="hover:text-white">Personvern</a></li>
                                <li><a href="/terms" className="hover:text-white">Vilkår</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Bedrift</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="/about" className="hover:text-white">Om oss</a></li>
                                <li><a href="/careers" className="hover:text-white">Karriere</a></li>
                                <li><a href="/blog" className="hover:text-white">Blogg</a></li>
                                <li><a href="/api" className="hover:text-white">API</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 SnakkaZ. Alle rettigheter reservert. Laget med ❤️ i Norge</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
