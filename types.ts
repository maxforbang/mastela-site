export type BookingQuoteInfo = {
  propertyName: string;
  invoiceItems: InvoiceItem[];
  pricePerNight: string;
  totalPrice: number;
};

export type InvoiceItem = {
  description: string;
  prices: SubItem[];
  subtotal: number;
};

export type SubItem = {
  description: string;
  amount: number;
  room_rate_type: 0 | null;
};

export type BookingInformation = {
  customer: Customer;
  propertyName: string;
  dates: DateRange;
  totalPrice: string;
  amountDetails: Record<string, number>;
  pricePerNight: string;
  createdDate: Date;
  paymentMethod: PaymentMethod;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type PaymentMethod = {
  type: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  last4?: string;
}

export type DateRange = {
  arrival: string;
  departure: string;
};


