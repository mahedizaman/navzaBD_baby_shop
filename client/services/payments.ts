import { api } from "./api";

export type InitiatePaymentBody = {
  amount: number;
  items: {
    productId: string;
    name: string;
    price: number;
    qty?: number;
    quantity?: number;
    image?: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  orderId?: string;
};

export type InitiatePaymentResponse = {
  url: string;
  sessionId: string;
  orderId: string;
  cancelUrl: string;
};

/** Common keys: set after login (`token` or `navzabd_token`). */
export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("navzabd_token") ||
    window.localStorage.getItem("token") ||
    null
  );
}

export async function initiatePayment(
  body: InitiatePaymentBody,
  token: string,
): Promise<InitiatePaymentResponse> {
  const { data } = await api.post<InitiatePaymentResponse>(
    "/api/payment/initiate",
    body,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
}

export async function verifyCheckoutSession(
  sessionId: string,
): Promise<{ success: boolean; orderId: string | null }> {
  const { data } = await api.get<{ success: boolean; orderId: string | null }>(
    "/api/payment/verify",
    { params: { session_id: sessionId } },
  );
  return data;
}
