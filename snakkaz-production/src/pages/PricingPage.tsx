import React, { useState } from 'react'
import { Check, Crown, Zap, Users, Shield } from 'lucide-react'
import { PRICING_PLANS, paymentService } from '../lib/payments'
import { mcpAnalytics } from '../lib/mcp-api'
import { Link } from 'react-router-dom'

const PricingPage: React.FC = () => {
    const [currency, setCurrency] = useState<'NOK' | 'USD'>('NOK')
    const [annualBilling, setAnnualBilling] = useState(false)
    const [loading, setLoading] = useState<string | null>(null)

    React.useEffect(() => {
        mcpAnalytics.trackEvent('page_view', { page: 'pricing' })
    }, [])

    const handleSubscribe = async (planId: string, useVipps: boolean = false) => {
        setLoading(planId)

        try {
            mcpAnalytics.trackEvent('subscription_attempt', {
                plan: planId,
                payment_method: useVipps ? 'vipps' : 'stripe',
                currency
            })

            // For demo - would normally require auth
            const userId = 'demo-user-id'

            if (useVipps && currency === 'NOK') {
                await paymentService.initVippsPayment(planId, userId)
            } else {
                await paymentService.createCheckoutSession(planId, userId, currency)
            }
        } catch (error) {
            console.error('Subscription error:', error)
            mcpAnalytics.trackEvent('subscription_error', { plan: planId, error: error.message })
        } finally {
            setLoading(null)
        }
    }

    const getPrice = (plan: any) => {
        const basePrice = currency === 'NOK' ? plan.priceNOK : plan.priceUSD
        const discountedPrice = annualBilling ? Math.floor(basePrice * 0.83) : basePrice
        return paymentService.formatPrice(discountedPrice, currency)
    }

    const getSavings = (plan: any) => {
        if (!annualBilling || plan.priceNOK === 0) return null
        const monthlyPrice = currency === 'NOK' ? plan.priceNOK : plan.priceUSD
        const yearlyPrice = Math.floor(monthlyPrice * 0.83) * 12
        const savings = (monthlyPrice * 12) - yearlyPrice
        return paymentService.formatPrice(savings, currency)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Velg riktig plan for deg
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Fra gratis bruk til enterprise-løsninger. Start gratis og oppgrader når du er klar.
                    </p>

                    {/* Currency Toggle */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-1 rounded-lg flex">
                            <button
                                onClick={() => setCurrency('NOK')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currency === 'NOK'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                🇳🇴 NOK
                            </button>
                            <button
                                onClick={() => setCurrency('USD')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currency === 'USD'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                🇺🇸 USD
                            </button>
                        </div>
                    </div>

                    {/* Annual Toggle */}
                    <div className="flex items-center justify-center space-x-4">
                        <span className={`text-sm ${!annualBilling ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                            Månedlig
                        </span>
                        <button
                            onClick={() => setAnnualBilling(!annualBilling)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${annualBilling ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${annualBilling ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className={`text-sm ${annualBilling ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                            Årlig
                            {annualBilling && (
                                <span className="ml-1 text-green-600 font-semibold">
                                    (spar 17%)
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PRICING_PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl p-8 ${plan.popular
                                    ? 'ring-2 ring-blue-500 shadow-xl bg-white'
                                    : 'border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                                        <Crown className="w-4 h-4" />
                                        <span>Mest populær</span>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {getPrice(plan)}
                                    </span>
                                    {plan.priceNOK > 0 && (
                                        <span className="text-gray-500">/{annualBilling ? 'år' : 'måned'}</span>
                                    )}
                                </div>
                                {annualBilling && getSavings(plan) && (
                                    <div className="text-sm text-green-600 font-medium">
                                        Spar {getSavings(plan)} per år
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-3">
                                {plan.id === 'free' ? (
                                    <Link
                                        to="/auth"
                                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center font-medium"
                                    >
                                        Kom i gang gratis
                                    </Link>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleSubscribe(plan.id)}
                                            disabled={loading === plan.id}
                                            className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${plan.popular
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {loading === plan.id ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span>Velg {plan.name}</span>
                                                </>
                                            )}
                                        </button>

                                        {currency === 'NOK' && (
                                            <button
                                                onClick={() => handleSubscribe(plan.id, true)}
                                                disabled={loading === plan.id}
                                                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                                            >
                                                <span>Betal med Vipps</span>
                                                <img src="/vipps-logo.png" alt="Vipps" className="w-5 h-5" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Sammenlign alle funksjoner
                    </h2>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Funksjoner</th>
                                        {PRICING_PLANS.map((plan) => (
                                            <th key={plan.id} className="text-center py-4 px-6 font-semibold text-gray-900">
                                                {plan.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {[
                                        { feature: 'Meldinger per dag', values: ['10', 'Ubegrenset', 'Ubegrenset', 'Ubegrenset'] },
                                        { feature: 'Chat-rom', values: ['Offentlige', 'Premium', 'Private', 'Enterprise'] },
                                        { feature: 'Fileopplasting', values: ['1MB', '10MB', '100MB', 'Ubegrenset'] },
                                        { feature: 'Videokonferanser', values: ['❌', '❌', '✅', '✅'] },
                                        { feature: 'API tilgang', values: ['❌', '❌', '✅', '✅'] },
                                        { feature: 'Brukerstyring', values: ['❌', '❌', '✅', '✅'] },
                                        { feature: 'SSO', values: ['❌', '❌', '❌', '✅'] },
                                        { feature: 'Dedikert support', values: ['❌', '❌', '❌', '✅'] },
                                    ].map((row, index) => (
                                        <tr key={index}>
                                            <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                                            {row.values.map((value, valueIndex) => (
                                                <td key={valueIndex} className="py-4 px-6 text-center text-gray-700">
                                                    {value}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Ofte stilte spørsmål
                    </h2>

                    <div className="max-w-3xl mx-auto space-y-8">
                        {[
                            {
                                question: 'Kan jeg bytte plan når som helst?',
                                answer: 'Ja, du kan oppgradere eller nedgradere planen din når som helst. Endringer trer i kraft umiddelbart.'
                            },
                            {
                                question: 'Tilbyr dere refusjon?',
                                answer: 'Vi tilbyr 30 dagers pengene-tilbake-garanti på alle betalte planer, uten spørsmål.'
                            },
                            {
                                question: 'Er dataene mine sikre?',
                                answer: 'Absolutt. Vi bruker ende-til-ende kryptering og følger strenge europeiske personvernlover (GDPR).'
                            },
                            {
                                question: 'Kan jeg bruke Vipps for betaling?',
                                answer: 'Ja! For norske kunder tilbyr vi Vipps som betalingsmetode i tillegg til vanlige kredittkort.'
                            },
                            {
                                question: 'Får jeg rabatt ved årlig betaling?',
                                answer: 'Ja, du sparer 17% ved å velge årlig fakturering på alle betalte planer.'
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center">
                    <div className="bg-blue-600 rounded-2xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">Klar til å komme i gang?</h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Bli med tusenvis av fornøyde brukere som allerede bruker SnakkaZ
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/auth"
                                onClick={() => mcpAnalytics.trackEvent('cta_click', { location: 'pricing_bottom' })}
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                            >
                                Start gratis i dag
                            </Link>
                            <button
                                onClick={() => window.location.href = 'mailto:sales@snakkaz.com'}
                                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
                            >
                                Kontakt salg
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PricingPage
