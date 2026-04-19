export type PrimaryService = {
  id: string;
  title: string;
  durationMinutes: number;
  basePrice: number; // in cents or decimal, match Shopify convention
};

export type AddOnService = {
  id: string;
  title: string;
  durationMinutes: number;
  additionalPrice: number;
};

export type ServiceVariant = {
  id: string;
  title: string; // "Haircut only" or "Haircut + Beard trim"
  durationMinutes: number;
  price: number; // basePrice + additionalPrice
  primaryService: PrimaryService;
  addOn: AddOnService | null; // null = "primary only" variant
};

export type ShopifyProduct = {
  title: string; // = primary service name
  primaryService: PrimaryService;
  variants: ServiceVariant[];
};

export type SelectedTeammate = {
  id: string;
  name: string;
  initials: string;
  available: boolean;
  displayOrder: number; // reflects drag order
};

export type AvailabilityConfig = {
  mode: string[];
  assignedTeammates: SelectedTeammate[];
  schedulingInterval: string;
  minimumNotice: string;
  lookAhead: string;
};

export type AdvancedSettings = {
  contactInfo: string;
  askConfirmationEmail: boolean;
  reminders: any[];
  emailNotifications: boolean;
  smsNotifications: boolean;
  whatsappNotifications: boolean;
  minReschedulingNotice: string;
  minCancellingNotice: string;
  showCancelButton: boolean;
  showRescheduleButton: boolean;
  enablePostBooking: boolean;
  postBookingDelayValue: string;
  postBookingDelayUnit: string;
  postBookingLanguage: string;
  postBookingSubject: string;
  postBookingBody: string;
};

export type WizardState = {
  currentStep: 1 | 2 | 3 | 4 | 5;
  businessType: 'spa' | 'barberia' | 'salon' | 'custom' | null;
  primaries: PrimaryService[];
  addOns: AddOnService[];
  availability: AvailabilityConfig;
  advancedSettings: AdvancedSettings;
};
