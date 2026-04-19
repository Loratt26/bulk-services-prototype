import React, { useMemo } from 'react';
import { BlockStack, Text, InlineStack, Box, TextField, Select, Button, Banner, DataTable, Divider } from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';
import { PrimaryService, AddOnService } from '../types';
import { generateShopifyProducts, formatPrice, formatDuration } from '../utils';

interface Step2Props {
  primaries: PrimaryService[];
  addOns: AddOnService[];
  onChangePrimaries: (primaries: PrimaryService[]) => void;
  onChangeAddOns: (addOns: AddOnService[]) => void;
  primaryErrors: Record<string, string>;
  addOnErrors: Record<string, string>;
}

const PRIMARY_DURATION_OPTIONS = [
  { label: '15 min', value: '15' },
  { label: '20 min', value: '20' },
  { label: '30 min', value: '30' },
  { label: '45 min', value: '45' },
  { label: '60 min', value: '60' },
  { label: '75 min', value: '75' },
  { label: '90 min', value: '90' },
  { label: '120 min', value: '120' },
];

const ADDON_DURATION_OPTIONS = [
  { label: '10 min', value: '10' },
  { label: '15 min', value: '15' },
  { label: '20 min', value: '20' },
  { label: '30 min', value: '30' },
  { label: '45 min', value: '45' },
  { label: '60 min', value: '60' },
];

export default function Step2Services({ primaries, addOns, onChangePrimaries, onChangeAddOns, primaryErrors, addOnErrors }: Step2Props) {
  const products = useMemo(() => {
    return generateShopifyProducts(primaries, addOns);
  }, [primaries, addOns]);

  const previewRows = useMemo(() => {
    const rows: any[][] = [];
    products.forEach(product => {
      product.variants.forEach(variant => {
        rows.push([
          variant.title,
          formatDuration(variant.durationMinutes),
          formatPrice(variant.price),
        ]);
      });
    });
    return rows;
  }, [products]);

  return (
    <BlockStack gap="600">
      {(primaryErrors['general'] || addOnErrors['general']) && (
        <Banner tone="critical">
          <p>{primaryErrors['general'] || addOnErrors['general']}</p>
        </Banner>
      )}

      {/* Section A — Primary service(s) */}
      <BlockStack gap="400">
        <BlockStack gap="100">
          <Text as="h3" variant="headingMd">Primary service</Text>
          <Text as="p" variant="bodyMd" tone="subdued">
            The main service customers will book. Each primary service becomes a separate Shopify product.
          </Text>
        </BlockStack>

        <BlockStack gap="300">
          {primaries.map((primary, index) => (
            <InlineStack key={primary.id} gap="300" blockAlign="start" wrap={false}>
              <Box width="100%">
                <TextField
                  label="Service name"
                  labelHidden
                  value={primary.title}
                  onChange={(val) => {
                    const newPrimaries = [...primaries];
                    newPrimaries[index].title = val;
                    onChangePrimaries(newPrimaries);
                  }}
                  autoComplete="off"
                  placeholder="e.g. Haircut"
                  error={primaryErrors[primary.id]}
                />
              </Box>
              <Box minWidth="120px">
                <Select
                  label="Duration"
                  labelHidden
                  options={PRIMARY_DURATION_OPTIONS}
                  value={primary.durationMinutes.toString()}
                  onChange={(val) => {
                    const newPrimaries = [...primaries];
                    newPrimaries[index].durationMinutes = parseInt(val, 10);
                    onChangePrimaries(newPrimaries);
                  }}
                />
              </Box>
              <Box minWidth="120px">
                <TextField
                  label="Base price"
                  labelHidden
                  type="number"
                  prefix="$"
                  min={0}
                  step={0.01}
                  value={(primary.basePrice / 100).toString()}
                  onChange={(val) => {
                    const newPrimaries = [...primaries];
                    newPrimaries[index].basePrice = Math.round(parseFloat(val || '0') * 100);
                    onChangePrimaries(newPrimaries);
                  }}
                  autoComplete="off"
                />
              </Box>
              {primaries.length > 1 && (
                <Button
                  icon={DeleteIcon}
                  accessibilityLabel="Delete primary service"
                  onClick={() => {
                    const newPrimaries = primaries.filter((_, i) => i !== index);
                    onChangePrimaries(newPrimaries);
                  }}
                />
              )}
            </InlineStack>
          ))}
        </BlockStack>
        <InlineStack>
          <Button
            variant="plain"
            onClick={() => {
              onChangePrimaries([
                ...primaries,
                { id: `primary-${Date.now()}`, title: '', durationMinutes: 30, basePrice: 0 },
              ]);
            }}
          >
            + Add another primary service
          </Button>
        </InlineStack>

        {primaries.length > 1 && (
          <Banner tone="info">
            <p>Each primary service will be created as a separate Shopify product with its own booking page.</p>
          </Banner>
        )}
      </BlockStack>

      <Divider />

      {/* Section B — Add-on services */}
      <BlockStack gap="400">
        <BlockStack gap="100">
          <Text as="h3" variant="headingMd">Add-on services</Text>
          <Text as="p" variant="bodyMd" tone="subdued">
            Extras that customers can add to any primary service. Add-ons cannot be booked alone.
          </Text>
        </BlockStack>

        {addOns.length === 0 && (
          <Banner tone="warning">
            <p>You must add at least one add-on service to create group combinations.</p>
          </Banner>
        )}

        <BlockStack gap="300">
          {addOns.map((addOn, index) => (
            <InlineStack key={addOn.id} gap="300" blockAlign="start" wrap={false}>
              <Box width="100%">
                <TextField
                  label="Add-on name"
                  labelHidden
                  value={addOn.title}
                  onChange={(val) => {
                    const newAddOns = [...addOns];
                    newAddOns[index].title = val;
                    onChangeAddOns(newAddOns);
                  }}
                  autoComplete="off"
                  placeholder="e.g. Beard trim"
                  error={addOnErrors[addOn.id]}
                />
              </Box>
              <Box minWidth="120px">
                <Select
                  label="Duration"
                  labelHidden
                  options={ADDON_DURATION_OPTIONS}
                  value={addOn.durationMinutes.toString()}
                  onChange={(val) => {
                    const newAddOns = [...addOns];
                    newAddOns[index].durationMinutes = parseInt(val, 10);
                    onChangeAddOns(newAddOns);
                  }}
                />
              </Box>
              <Box minWidth="120px">
                <TextField
                  label="Additional price"
                  labelHidden
                  type="number"
                  prefix="+$"
                  min={0}
                  step={0.01}
                  value={(addOn.additionalPrice / 100).toString()}
                  onChange={(val) => {
                    const newAddOns = [...addOns];
                    newAddOns[index].additionalPrice = Math.round(parseFloat(val || '0') * 100);
                    onChangeAddOns(newAddOns);
                  }}
                  autoComplete="off"
                />
              </Box>
              <Button
                icon={DeleteIcon}
                accessibilityLabel="Delete add-on service"
                onClick={() => {
                  const newAddOns = addOns.filter((_, i) => i !== index);
                  onChangeAddOns(newAddOns);
                }}
              />
            </InlineStack>
          ))}
        </BlockStack>
        <InlineStack>
          <Button
            variant="plain"
            onClick={() => {
              onChangeAddOns([
                ...addOns,
                { id: `addon-${Date.now()}`, title: '', durationMinutes: 15, additionalPrice: 0 },
              ]);
            }}
          >
            + Add another add-on
          </Button>
        </InlineStack>
      </BlockStack>

      <Divider />

      {/* Section C — Live preview */}
      <BlockStack gap="400">
        <Text as="h3" variant="headingMd">Variants that will be created</Text>
        {previewRows.length > 0 ? (
          <Box borderWidth="025" borderColor="border" borderRadius="100">
            <DataTable
              columnContentTypes={['text', 'text', 'numeric']}
              headings={['Variant name', 'Duration', 'Total price']}
              rows={previewRows}
            />
          </Box>
        ) : (
          <Text as="p" variant="bodyMd" tone="subdued">
            Add primary services and add-ons to see the variants that will be created.
          </Text>
        )}
      </BlockStack>
    </BlockStack>
  );
}
