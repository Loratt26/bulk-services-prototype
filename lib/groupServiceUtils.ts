export type Service = {
  id: string;
  title: string;
  durationMinutes: number;
};

export type AvailabilityConfig = Record<string, any>;
export type AdvancedSettings = Record<string, any>;

export type GroupCombination = {
  id: string;
  title: string; // "Service A + Service B"
  durationMinutes: number; // sum of both
  services: [Service, Service]; // exactly 2
  availabilityConfig: AvailabilityConfig;
  advancedSettings: AdvancedSettings;
};

/**
 * Generates all unique pairs of services (combinations of 2).
 * Order doesn't matter (A+B is the same as B+A).
 * 
 * @param services - Array of services to combine
 * @returns Array of group combinations
 */
export function generateCombinations(services: Service[]): GroupCombination[] {
  const combinations: GroupCombination[] = [];
  
  for (let i = 0; i < services.length; i++) {
    for (let j = i + 1; j < services.length; j++) {
      const service1 = services[i];
      const service2 = services[j];
      
      combinations.push({
        id: `${service1.id}-${service2.id}`,
        title: `${service1.title} + ${service2.title}`,
        durationMinutes: service1.durationMinutes + service2.durationMinutes,
        services: [service1, service2],
        availabilityConfig: {},
        advancedSettings: {},
      });
    }
  }
  
  return combinations;
}

/**
 * Formats a duration in minutes to a human-readable string (e.g., "1h 30min").
 * 
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
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

/**
 * Calculates the number of unique pairs (combinations of 2) for a given number of items.
 * Uses the formula n * (n - 1) / 2.
 * 
 * @param n - Number of items
 * @returns Number of possible combinations
 */
export function getCombinationCount(n: number): number {
  if (n < 2) return 0;
  return (n * (n - 1)) / 2;
}

/**
 * Validates an array of services.
 * Checks for minimum count, non-empty titles, and positive durations.
 * 
 * @param services - Array of services to validate
 * @returns Validation result with boolean flag and record of errors by service ID
 */
export function validateServices(services: Service[]): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (services.length < 2) {
    errors['general'] = 'At least 2 services are required to create combinations.';
  }
  
  services.forEach((service, index) => {
    const serviceKey = service.id || `index-${index}`;
    
    if (!service.title || service.title.trim() === '') {
      errors[serviceKey] = 'Service title cannot be empty.';
    } else if (service.durationMinutes <= 0) {
      errors[serviceKey] = 'Service duration must be greater than 0.';
    }
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Returns pre-defined service suggestions based on the business type.
 * 
 * @param businessType - Type of business ('spa', 'barberia', 'salon', or 'custom')
 * @returns Array of pre-defined services without IDs
 */
export function getPreDefinedServices(businessType: 'spa' | 'barberia' | 'salon' | 'custom'): Omit<Service, 'id'>[] {
  switch (businessType) {
    case 'spa':
      return [
        { title: 'Masaje sueco', durationMinutes: 60 },
        { title: 'Masaje de tejido profundo', durationMinutes: 60 },
        { title: 'Facial', durationMinutes: 45 },
        { title: 'Aromaterapia', durationMinutes: 30 },
        { title: 'Envoltura corporal', durationMinutes: 90 },
      ];
    case 'barberia':
      return [
        { title: 'Corte de cabello', durationMinutes: 30 },
        { title: 'Arreglo de barba', durationMinutes: 15 },
        { title: 'Limpieza profunda', durationMinutes: 45 },
        { title: 'Tratamiento capilar', durationMinutes: 30 },
        { title: 'Afeitado clásico', durationMinutes: 30 },
      ];
    case 'salon':
      return [
        { title: 'Manicure', durationMinutes: 45 },
        { title: 'Pedicure', durationMinutes: 60 },
        { title: 'Coloración', durationMinutes: 120 },
        { title: 'Corte y peinado', durationMinutes: 60 },
        { title: 'Tratamiento de keratina', durationMinutes: 90 },
      ];
    case 'custom':
    default:
      return [];
  }
}
