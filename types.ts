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
  propertySlug: string;
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

export type Coordinates = {
  lat: number;
  long: number;
};

export type Preview = {
  _type: string;
  style: string;
  _key: string;
  markDefs: any[];
  children: PreviewChildren[];
};

export type PreviewChildren = {
  marks: any[];
  text: string;
  _key: string;
  _type: string;
};

export type Slug = {
  _type: string;
  current: string;
};

export type Occupancy = {
  beds: number;
  bedrooms: number;
  guests: number;
  bathrooms: number;
};

export type MainImage = {
  _type: string;
  alt: string;
  asset: {
    _ref: string;
    _type: string;
  };
};

export type PropertyListing = {
  coords: Coordinates;
  preview: Preview[];
  name: string;
  slug: Slug;
  occupancy: Occupancy;
  mainImage: MainImage;
};

export type FAQ = {
  question: string,
  answer: string
}


