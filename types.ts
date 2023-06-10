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

export type BookingPrice = {
  invoiceItems: InvoiceItem[];
  pricePerNight: string;
  totalPrice: number;
};