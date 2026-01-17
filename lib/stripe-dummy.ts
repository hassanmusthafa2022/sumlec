import { loadStripe } from "@stripe/stripe-js";

// Dummy Stripe setup
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy");

export const checkoutWithStripe = async (priceId: string) => {
    console.log("Stripe Checkout initiated for:", priceId);
    return { error: null, url: "/success?session_id=mock_session_id" };
};

export const payWithPayPal = async (amount: string) => {
    console.log("PayPal payment for:", amount);
    // Logic to open PayPal modal would go here if not using the React component directly
    return true;
}

export const mockProcessPayment = async (uid: string, planId: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Processed payment for user ${uid} on plan ${planId}`);
    return true; // Always succeed for test
};

export default stripePromise;
