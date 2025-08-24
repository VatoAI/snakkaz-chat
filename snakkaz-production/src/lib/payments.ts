import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51234567890"
);

export interface PricingPlan {
  id: string;
  name: string;
  priceNOK: number;
  priceUSD: number;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
  stripePriceId: string;
  vippsPriceId?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Gratis",
    priceNOK: 0,
    priceUSD: 0,
    interval: "month",
    features: [
      "10 meldinger per dag",
      "Grunnleggende chat",
      "Standard support",
      "Mobilapp",
    ],
    stripePriceId: "",
    vippsPriceId: "",
  },
  {
    id: "pro",
    name: "Pro",
    priceNOK: 99,
    priceUSD: 9,
    interval: "month",
    features: [
      "Ubegrenset meldinger",
      "Premium chat-rom",
      "Fileopplasting (10MB)",
      "Prioritert support",
      "Ingen annonser",
      "Tema-tilpasning",
    ],
    popular: true,
    stripePriceId: "price_pro_monthly_nok",
    vippsPriceId: "vipps_pro_monthly",
  },
  {
    id: "business",
    name: "Business",
    priceNOK: 299,
    priceUSD: 29,
    interval: "month",
    features: [
      "Alt i Pro",
      "Private team-rom",
      "Fileopplasting (100MB)",
      "Videokonferanser",
      "Admin dashboard",
      "API tilgang",
      "Brukerstyring",
    ],
    stripePriceId: "price_business_monthly_nok",
    vippsPriceId: "vipps_business_monthly",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceNOK: 999,
    priceUSD: 99,
    interval: "month",
    features: [
      "Alt i Business",
      "Ubegrenset lagring",
      "Dedikert support",
      "Single sign-on (SSO)",
      "Avanserte sikkerhetsfunksjoner",
      "Custom integrasjoner",
      "SLA garanti",
    ],
    stripePriceId: "price_enterprise_monthly_nok",
    vippsPriceId: "vipps_enterprise_monthly",
  },
];

export class PaymentService {
  private stripe: any = null;

  async initializeStripe() {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  async createCheckoutSession(
    planId: string,
    userId: string,
    currency: "NOK" | "USD" = "NOK"
  ) {
    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId,
          currency,
          priceId: plan.stripePriceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await this.initializeStripe();

      return await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Payment error:", error);
      throw error;
    }
  }

  async initVippsPayment(planId: string, userId: string) {
    const plan = PRICING_PLANS.find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");

    try {
      const response = await fetch("/api/vipps-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId,
          amount: plan.priceNOK * 100, // Vipps uses øre
          description: `SnakkaZ ${plan.name} abonnement`,
          redirectUrl: `${window.location.origin}/dashboard?vipps=success`,
        }),
      });

      const { paymentUrl } = await response.json();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Vipps payment error:", error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      });

      return await response.json();
    } catch (error) {
      console.error("Cancellation error:", error);
      throw error;
    }
  }

  async updatePaymentMethod(subscriptionId: string) {
    try {
      const response = await fetch("/api/update-payment-method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const { sessionId } = await response.json();
      const stripe = await this.initializeStripe();

      return await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Payment method update error:", error);
      throw error;
    }
  }

  formatPrice(amount: number, currency: "NOK" | "USD") {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

export const paymentService = new PaymentService();
