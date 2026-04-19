import React, { useState } from 'react';
import { BlockStack, Text, InlineStack, Badge, Card, Divider, Box, Icon, Banner } from '@shopify/polaris';
import { ChevronUpIcon, ChevronDownIcon } from '@shopify/polaris-icons';
import { PrimaryService, AddOnService, AvailabilityConfig, AdvancedSettings } from '../types';
import { generateShopifyProducts, formatDuration, formatPrice } from '../utils';

interface Step5Props {
  primaries: PrimaryService[];
  addOns: AddOnService[];
  availability: AvailabilityConfig;
  advancedSettings: AdvancedSettings;
}

export default function Step5Confirm({ primaries, addOns, availability, advancedSettings }: Step5Props) {
  const [expandedSummary, setExpandedSummary] = useState({ availability: false, advanced: false });
  
  const products = generateShopifyProducts(primaries, addOns);

  return (
    <BlockStack gap="600">
      {/* Section 1: Products to create */}
      <BlockStack gap="300">
        <Text as="h3" variant="headingMd">Products to create</Text>
        <BlockStack gap="400">
          {products.map((product, pIdx) => (
            <Card key={pIdx}>
              <BlockStack gap="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="h3" variant="headingSm">{product.title}</Text>
                  <Badge tone="success">New Shopify product</Badge>
                </InlineStack>
                <Divider />
                <BlockStack gap="300">
                  {product.variants.map((variant, vIdx) => (
                    <div key={vIdx}>
                      <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="100">
                          <Text as="p" variant="bodyMd" fontWeight="bold">{variant.title}</Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            {formatDuration(variant.durationMinutes)} — {formatPrice(variant.price)}
                          </Text>
                        </BlockStack>
                      </InlineStack>
                      {vIdx < product.variants.length - 1 && (
                        <Box paddingBlockStart="300">
                          <Divider />
                        </Box>
                      )}
                    </div>
                  ))}
                </BlockStack>
              </BlockStack>
            </Card>
          ))}
        </BlockStack>
      </BlockStack>

      {/* Section 3: Availability summary */}
      <Card>
        <div style={{ cursor: 'pointer' }} onClick={() => setExpandedSummary(p => ({ ...p, availability: !p.availability }))}>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h3" variant="headingSm">Availability summary</Text>
            <Icon source={expandedSummary.availability ? ChevronUpIcon : ChevronDownIcon} />
          </InlineStack>
        </div>
        {expandedSummary.availability && (
          <Box paddingBlockStart="300">
            <Text as="p" variant="bodyMd" tone="subdued">
              Availability mode: {availability.mode[0]}<br />
              Assigned teammates: {availability.assignedTeammates.length > 0 ? availability.assignedTeammates.map(t => t.name).join(', ') : 'None'}<br />
              Scheduling interval: Every {availability.schedulingInterval} min<br />
              Minimum notice: {availability.minimumNotice}
            </Text>
          </Box>
        )}
      </Card>

      {/* Section 4: Advanced settings summary */}
      <Card>
        <div style={{ cursor: 'pointer' }} onClick={() => setExpandedSummary(p => ({ ...p, advanced: !p.advanced }))}>
          <InlineStack align="space-between" blockAlign="center">
            <Text as="h3" variant="headingSm">Advanced settings summary</Text>
            <Icon source={expandedSummary.advanced ? ChevronUpIcon : ChevronDownIcon} />
          </InlineStack>
        </div>
        {expandedSummary.advanced && (
          <Box paddingBlockStart="300">
            <Text as="p" variant="bodyMd" tone="subdued">
              Contact info: {advancedSettings.contactInfo}<br />
              Notifications: {advancedSettings.emailNotifications ? 'Email' : 'None'}
            </Text>
          </Box>
        )}
      </Card>

      <Banner tone="warning">
        <p>
          These group services can only be booked through the Group Booking Widget.<br />
          The Shopify products and variants will be set to Unlisted status and will not be visible in your store.
        </p>
      </Banner>
    </BlockStack>
  );
}
