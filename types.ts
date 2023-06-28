export type BookingQuoteInfo = {
  propertyName: string;
  invoiceItems: InvoiceItem[];
  pricePerNight: string | number;
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
  dates: DateStringRange;
  totalPrice: string;
  amountDetails: Record<string, number>;
  pricePerNight: string;
  createdDate: Date;
  paymentMethod: PaymentMethod;
};

export type Customer = {
  name: string;
  email?: string;
  phone: string;
};

export type PaymentMethod = {
  type: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  last4?: string;
};

export type DateStringRange = {
  arrival: string;
  departure: string;
  slug?: Slug | string;
};

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type Coordinates = {
  lat: number;
  long: number;
};

export type RichText = {
  _type: string;
  style: string;
  _key: string;
  markDefs: any[];
  children: RichTextChildren[];
};

export type RichTextChildren = {
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

export type SanityImage = {
  _type: string;
  alt: string;
  asset: {
    _ref: string;
    _type: string;
  };
  crop?: {
    _type: "sanity.imageCrop";
    right: number;
    top: number;
    left: number;
    bottom: number;
  };
  hotspot?: {
    _type: "sanity.imageHotspot";
    width: number;
    x: number;
    y: number;
    height: number;
  };
};

export interface PropertyListing {
  coords?: Coordinates;
  preview?: RichText[];
  name: string;
  slug: Slug;
  occupancy: Occupancy;
  mainImage: SanityImage;
}

export interface Property extends PropertyListing {
  description: string;
  images: SanityImage[];
}

export type FAQ = {
  question: string;
  answer: string;
};

export type CalendarDates = {
  startDate: string | undefined;
  endDate: string | undefined;
};

export interface CalendarComponent {
  setDates: (dates: CalendarDates) => void;
  dates?: CalendarDates;
  property?: string;
  months?: number;
  direction?: "horizontal" | "vertical";
  calendarShowing?: boolean;
  setCalendarShowing?: (toggle: boolean) => void;
}

export type LodgifyAvailabilityPeriod = {
  available: 0 | 1;
  start: string;
  end: string;
};

export type LodgifyPropertyAvailabilities = {
  periods: LodgifyAvailabilityPeriod[];
  property_id: number;
};

export type CaptionedImage = {
  text: string;
  imageUrl: string;
};

export type StripePaymentIntentMetadata = {
  pricing: string;
  propertyName: string;
  arrival: string;
  lodgifyRoomId: string;
  departure: string;
  pricePerNight: string;
  totalPrice: string;
  lodgifyPropertyId: string;
  propertySlug: string;
};

export type StripePaymentIntent = {
  receipt_email: string;
  shipping: Customer;
  metadata: Record<string, string>;
  created: number;
  payment_method: string;
};

export type LodgifyQuote = {
  total_including_vat: number;
  room_types: { price_types: InvoiceItem[] }[];
};

export type LodgifyError = {
  message: string;
  code: number;
};

export type BlogCategory = {
  title: string;
  slug: Slug;
  description?: string;
  image?: SanityImage;
};

export type Author = {
  name: string;
  slug: Slug;
  bio?: RichText[];
  role: string;
  image: SanityImage;
};

export type BlogPost = {
  _type: "post";
  title: string;
  slug: Slug;
  author: Author;
  mainImage: SanityImage;
  categories: BlogCategory[];
  publishedAt: string; // Consider using a specific date type instead of 'string'
  body?: RichText[];
  textPreview?: string;
  calendarEvent?: BlogPostCalendarEvent;
  // Add other fields if needed
};

export type BlogPostCalendarEvent = {
  isCalendarEvent: boolean;
  eventDate: Date;
  dateChangesAnnually: boolean;
};
