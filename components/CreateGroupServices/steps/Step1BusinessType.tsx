import React from 'react';
import { BlockStack, Text, InlineStack, Box, Divider, Badge } from '@shopify/polaris';

interface Step1Props {
  businessType: string | null;
  onChange: (type: 'spa' | 'barberia' | 'salon' | 'custom') => void;
}

const BUSINESS_TYPES = [
  {
    id: 'spa',
    label: 'Spa',
    icon: '🧖',
    primaries: ['Swedish massage', 'Deep tissue massage', 'Facial'],
    addOns: ['Aromatherapy', 'Body wrap', 'Hot stone upgrade', 'Essential oils'],
  },
  {
    id: 'barberia',
    label: 'Barbershop',
    icon: '✂️',
    primaries: ['Haircut'],
    addOns: ['Beard trim', 'Deep cleanse', 'Hot towel', 'Classic shave', 'Hair treatment'],
  },
  {
    id: 'salon',
    label: 'Beauty salon',
    icon: '💅',
    primaries: ['Manicure', 'Pedicure'],
    addOns: ['Nail art', 'Gel finish', 'Paraffin wax', 'French tip', 'Callus removal'],
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: '⚙️',
    primaries: [],
    addOns: [],
  },
] as const;

export default function Step1BusinessType({ businessType, onChange }: Step1Props) {
  const selectedTypeObj = BUSINESS_TYPES.find((t) => t.id === businessType);

  return (
    <BlockStack gap="400">
      <Text as="p" variant="bodyMd">
        Select the type of business to get started.
      </Text>
      <InlineStack gap="400" wrap>
        {BUSINESS_TYPES.map((type) => {
          const isSelected = businessType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => onChange(type.id as any)}
              style={{
                cursor: 'pointer',
                flex: '1 1 120px',
              }}
            >
              <Box
                padding="400"
                borderWidth="025"
                borderRadius="200"
                borderColor={isSelected ? 'border-brand' : 'border'}
                background={isSelected ? 'bg-surface-secondary' : 'bg-surface'}
                minHeight="100%"
              >
                <BlockStack gap="200" align="center" inlineAlign="center">
                  <Text as="span" variant="headingLg">
                    {type.icon}
                  </Text>
                  <Text as="span" variant="bodyMd" fontWeight="bold" alignment="center">
                    {type.label}
                  </Text>
                </BlockStack>
              </Box>
            </div>
          );
        })}
      </InlineStack>

      {selectedTypeObj && (
        <BlockStack gap="300">
          <Divider />
          <Text as="h3" variant="headingSm">
            Pre-defined services for {selectedTypeObj.label}
          </Text>
          {selectedTypeObj.id === 'custom' ? (
            <Text as="p" variant="bodyMd" tone="subdued">
              You&apos;ll define your own services in the next step.
            </Text>
          ) : (
            <BlockStack gap="300">
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">Primary services</Text>
                <InlineStack gap="200" wrap>
                  {selectedTypeObj.primaries.map((service) => (
                    <Badge key={service} tone="info">{service}</Badge>
                  ))}
                </InlineStack>
              </BlockStack>
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">Add-ons</Text>
                <InlineStack gap="200" wrap>
                  {selectedTypeObj.addOns.map((service) => (
                    <Badge key={service}>{service}</Badge>
                  ))}
                </InlineStack>
              </BlockStack>
            </BlockStack>
          )}
        </BlockStack>
      )}
    </BlockStack>
  );
}
