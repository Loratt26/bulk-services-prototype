import { PrimaryService, AddOnService, ShopifyProduct, ServiceVariant } from '../types';

export function generateShopifyProducts(primaries: PrimaryService[], addOns: AddOnService[]): ShopifyProduct[] {
  return primaries.map(primary => {
    const baseVariant: ServiceVariant = {
      id: `${primary.id}-base`,
      title: `${primary.title} only`,
      durationMinutes: primary.durationMinutes,
      price: primary.basePrice,
      primaryService: primary,
      addOn: null,
    };

    const addOnVariants: ServiceVariant[] = addOns.map(addOn => ({
      id: `${primary.id}-${addOn.id}`,
      title: `${primary.title} + ${addOn.title}`,
      durationMinutes: primary.durationMinutes + addOn.durationMinutes,
      price: primary.basePrice + addOn.additionalPrice,
      primaryService: primary,
      addOn: addOn,
    }));

    return {
      title: primary.title,
      primaryService: primary,
      variants: [baseVariant, ...addOnVariants],
    };
  });
}

export function getTotalVariantCount(primaries: PrimaryService[], addOns: AddOnService[]): number {
  return primaries.length * (1 + addOns.length);
}

export function validatePrimaryServices(primaries: PrimaryService[]): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (primaries.length < 1) {
    errors['general'] = 'At least 1 primary service is required';
  }
  
  primaries.forEach((primary, index) => {
    const key = primary.id || `primary-${index}`;
    if (!primary.title || primary.title.trim() === '') {
      errors[key] = 'Title cannot be empty';
    } else if (primary.durationMinutes <= 0) {
      errors[key] = 'Duration must be greater than 0';
    } else if (primary.basePrice < 0) {
      errors[key] = 'Price cannot be negative';
    }
  });
  
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAddOns(addOns: AddOnService[]): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (addOns.length < 1) {
    errors['general'] = 'At least 1 add-on service is required';
  }
  
  addOns.forEach((addOn, index) => {
    const key = addOn.id || `addon-${index}`;
    if (!addOn.title || addOn.title.trim() === '') {
      errors[key] = 'Title cannot be empty';
    } else if (addOn.durationMinutes <= 0) {
      errors[key] = 'Duration must be greater than 0';
    } else if (addOn.additionalPrice < 0) {
      errors[key] = 'Price cannot be negative';
    }
  });
  
  return { valid: Object.keys(errors).length === 0, errors };
}

export function formatPrice(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(cents / 100);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}

export function getPreDefinedPrimaries(businessType: 'spa' | 'barberia' | 'salon' | 'custom' | null): Omit<PrimaryService, 'id'>[] {
  switch (businessType) {
    case 'spa':
      return [
        { title: 'Swedish massage', durationMinutes: 60, basePrice: 8000 },
        { title: 'Deep tissue massage', durationMinutes: 60, basePrice: 10000 },
        { title: 'Facial', durationMinutes: 45, basePrice: 6000 },
      ];
    case 'barberia':
      return [
        { title: 'Haircut', durationMinutes: 30, basePrice: 2500 },
      ];
    case 'salon':
      return [
        { title: 'Manicure', durationMinutes: 45, basePrice: 3500 },
        { title: 'Pedicure', durationMinutes: 60, basePrice: 4500 },
      ];
    case 'custom':
    default:
      return [];
  }
}

export function getPreDefinedAddOns(businessType: 'spa' | 'barberia' | 'salon' | 'custom' | null): Omit<AddOnService, 'id'>[] {
  switch (businessType) {
    case 'spa':
      return [
        { title: 'Aromatherapy', durationMinutes: 15, additionalPrice: 1500 },
        { title: 'Body wrap', durationMinutes: 30, additionalPrice: 3000 },
        { title: 'Hot stone upgrade', durationMinutes: 15, additionalPrice: 2000 },
        { title: 'Essential oils', durationMinutes: 10, additionalPrice: 1000 },
      ];
    case 'barberia':
      return [
        { title: 'Beard trim', durationMinutes: 15, additionalPrice: 1500 },
        { title: 'Deep cleanse', durationMinutes: 20, additionalPrice: 2000 },
        { title: 'Hot towel', durationMinutes: 10, additionalPrice: 1000 },
        { title: 'Classic shave', durationMinutes: 30, additionalPrice: 2500 },
        { title: 'Hair treatment', durationMinutes: 15, additionalPrice: 1500 },
      ];
    case 'salon':
      return [
        { title: 'Nail art', durationMinutes: 15, additionalPrice: 1500 },
        { title: 'Gel finish', durationMinutes: 15, additionalPrice: 2000 },
        { title: 'Paraffin wax', durationMinutes: 15, additionalPrice: 1500 },
        { title: 'French tip', durationMinutes: 15, additionalPrice: 1000 },
        { title: 'Callus removal', durationMinutes: 15, additionalPrice: 1500 },
      ];
    case 'custom':
    default:
      return [];
  }
}
