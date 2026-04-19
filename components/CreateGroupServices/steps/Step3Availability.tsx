import React, { useMemo, useState } from 'react';
import {
  BlockStack,
  Text,
  ChoiceList,
  Divider,
  Card,
  InlineStack,
  Icon,
  TextField,
  ButtonGroup,
  Button,
  Box,
  Badge,
  Select,
  Banner,
  Avatar,
} from '@shopify/polaris';
import { ChevronUpIcon, ChevronDownIcon, DeleteIcon, EditIcon, DragHandleIcon, XIcon } from '@shopify/polaris-icons';
import { AvailabilityConfig, PrimaryService, AddOnService, SelectedTeammate } from '../types';
import { generateShopifyProducts } from '../utils';
import TeammateChooserModal from '../TeammateChooserModal';

// Mock TeamIcon since it's not exported from polaris-icons
const TeamIcon = () => (
  <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true" style={{fill: 'currentColor', width: '20px', height: '20px'}}>
    <path d="M13.707 10.707a1 1 0 0 1-1.414 0l-2.293-2.293a1 1 0 0 1 0-1.414l2.293-2.293a1 1 0 0 1 1.414 1.414l-.586.586h2.879a1 1 0 0 1 0 2h-2.879l.586.586a1 1 0 0 1 0 1.414zM10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-5 6a5 5 0 0 1 10 0h-10z"></path>
  </svg>
);

interface Step3Props {
  availability: AvailabilityConfig;
  onChange: (availability: AvailabilityConfig) => void;
  primaries: PrimaryService[];
  addOns: AddOnService[];
  error?: string;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Step3Availability({ availability, onChange, primaries, addOns, error }: Step3Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggableRowId, setDraggableRowId] = useState<string | null>(null);

  const products = useMemo(() => {
    return generateShopifyProducts(primaries, addOns);
  }, [primaries, addOns]);

  const uniqueDurations = useMemo(() => {
    const durations = new Set<number>();
    products.forEach(product => {
      product.variants.forEach(variant => {
        durations.add(variant.durationMinutes);
      });
    });
    return Array.from(durations).sort((a, b) => a - b);
  }, [products]);

  const updateField = (field: keyof AvailabilityConfig, value: any) => {
    onChange({ ...availability, [field]: value });
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (index: number) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex !== null && dragIndex !== targetIndex) {
      const updated = [...availability.assignedTeammates];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(targetIndex, 0, moved);
      
      const reordered = updated.map((t, i) => ({ ...t, displayOrder: i }));
      updateField('assignedTeammates', reordered);
    }
    setDragIndex(null);
    setDragOverIndex(null);
    setDraggableRowId(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
    setDraggableRowId(null);
  };

  return (
    <BlockStack gap="600">
      {error && (
        <Banner tone="critical">
          <p>{error}</p>
        </Banner>
      )}

      {/* Section 1: Availability mode */}
      <BlockStack gap="200">
        <InlineStack gap="200" align="start" blockAlign="center">
          <Text as="h2" variant="headingMd">Availability mode</Text>
          <Badge tone="info">Teammate</Badge>
        </InlineStack>
        <Text as="p" variant="bodyMd" tone="subdued">
          Group services are always managed at the teammate level.
          Each teammate has their own schedule and availability.
        </Text>
      </BlockStack>

      <Divider />

      {/* Section 1.5: Assign teammates */}
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <Text as="h3" variant="headingSm">Assign teammates</Text>
            <Text as="p" variant="bodyMd" tone="subdued">
              Select the teammates who will be available for this group service.
              Customers will be able to choose their preferred teammate at booking time.
            </Text>
          </BlockStack>

          <BlockStack gap="200">
            {/* Fixed First Row */}
            <Box padding="300" borderBlockEndWidth="025" borderColor="border">
              <InlineStack align="space-between" blockAlign="center">
                <InlineStack gap="300" blockAlign="center">
                  <Box width="20px" /> {/* Placeholder for drag handle */}
                  <Avatar customer size="md" name="No preference" initials="?" />
                  <BlockStack>
                    <Text as="span" variant="bodyMd" fontWeight="semibold">No preference</Text>
                    <Text as="span" variant="bodySm" tone="subdued">Cowlendar will randomly assign one of your available teammates</Text>
                  </BlockStack>
                </InlineStack>
                <Badge tone="success">visible</Badge>
              </InlineStack>
            </Box>

            {/* Draggable Selected Teammates */}
            {availability.assignedTeammates.map((teammate, i) => {
              const isDragging = dragIndex === i;
              const isDragOver = dragOverIndex === i;
              
              // Determine drop indicator styles
              let dropStyle: React.CSSProperties = {};
              if (isDragOver && dragIndex !== null) {
                if (dragIndex < i) {
                  // Dragging down, show indicator below
                  dropStyle = { boxShadow: '0 2px 0 0 #005bd3', zIndex: 1, position: 'relative' };
                } else {
                  // Dragging up, show indicator above
                  dropStyle = { boxShadow: '0 -2px 0 0 #005bd3', zIndex: 1, position: 'relative' };
                }
              }

              return (
                <div
                  key={teammate.id}
                  draggable={draggableRowId === teammate.id}
                  onDragStart={(e) => {
                    e.stopPropagation();
                    if (e.dataTransfer) {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', teammate.id);
                    }
                    // Defer state update so browser can snapshot the element properly
                    setTimeout(() => handleDragStart(i), 0);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDragEnter(i);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer) {
                      e.dataTransfer.dropEffect = 'move';
                    }
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDragLeave(i);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDrop(i);
                  }}
                  onDragEnd={handleDragEnd}
                  style={{ 
                    ...dropStyle,
                    opacity: isDragging ? 0.4 : 1,
                    transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <Box
                    padding="300"
                    borderBlockEndWidth="025"
                    borderColor="border"
                    background={isDragging ? 'bg-surface-secondary' : 'bg-surface'}
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="300" blockAlign="center">
                        <div 
                          style={{ cursor: 'grab', padding: '4px' }}
                          onMouseEnter={() => setDraggableRowId(teammate.id)}
                          onMouseLeave={() => setDraggableRowId(null)}
                        >
                          <Icon source={DragHandleIcon} tone="subdued" />
                        </div>
                        <Avatar customer size="md" name={teammate.name} initials={teammate.initials} />
                        <Text as="span" variant="bodyMd" fontWeight="semibold">{teammate.name}</Text>
                      </InlineStack>
                      <InlineStack gap="300" blockAlign="center">
                        {teammate.available ? (
                          <Badge tone="success">visible</Badge>
                        ) : (
                          <Badge tone="critical">unavailable</Badge>
                        )}
                        <Button
                          icon={XIcon}
                          variant="plain"
                          tone="critical"
                          accessibilityLabel="Remove teammate"
                          onClick={() => {
                            const updated = availability.assignedTeammates.filter(t => t.id !== teammate.id);
                            updateField('assignedTeammates', updated);
                          }}
                        />
                      </InlineStack>
                    </InlineStack>
                  </Box>
                </div>
              );
            })}
          </BlockStack>

          {availability.assignedTeammates.length > 0 ? (
            <InlineStack>
              <Button variant="plain" onClick={() => setIsModalOpen(true)}>+ Add teammates</Button>
            </InlineStack>
          ) : (
            <div onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
              <Box
                borderStyle="dashed"
                borderColor="border"
                borderWidth="025"
                borderRadius="200"
                padding="600"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                  <Icon source={TeamIcon} tone="subdued" />
                  <Text as="span" tone="subdued">Choose teammates for this Group service</Text>
                </div>
              </Box>
            </div>
          )}
        </BlockStack>
      </Card>

      <Divider />
      
      {/* Section 2: Scheduling options */}
      <BlockStack gap="300">
        <Text as="h3" variant="headingMd">
          Scheduling options
        </Text>
        <Select
          label="Customer should be able to book..."
          options={[
            { label: 'Every 15 min', value: '15' },
            { label: 'Every 30 min', value: '30' },
            { label: 'Every 60 min', value: '60' },
          ]}
          value={availability.schedulingInterval}
          onChange={(val) => updateField('schedulingInterval', val)}
        />
        <Select
          label="Minimum scheduling notice"
          options={[
            { label: '1 hour', value: '1 hour' },
            { label: '2 hours', value: '2 hours' },
            { label: '1 day', value: '1 day' },
            { label: '2 days', value: '2 days' },
            { label: '1 week', value: '1 week' },
            { label: '2 weeks', value: '2 weeks' },
            { label: '4 weeks', value: '4 weeks' },
            { label: '6 weeks', value: '6 weeks' },
          ]}
          value={availability.minimumNotice}
          onChange={(val) => updateField('minimumNotice', val)}
        />
        <Select
          label="Look ahead"
          options={[
            { label: '1 month', value: '1 month' },
            { label: '2 months', value: '2 months' },
            { label: '3 months', value: '3 months' },
            { label: '6 months', value: '6 months' },
            { label: 'Indefinitely', value: 'Indefinitely' },
          ]}
          value={availability.lookAhead}
          onChange={(val) => updateField('lookAhead', val)}
        />
      </BlockStack>

      <TeammateChooserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTeammates={availability.assignedTeammates}
        onSelect={(teammate) => {
          updateField('assignedTeammates', [...availability.assignedTeammates, teammate]);
        }}
        onDeselect={(id) => {
          updateField('assignedTeammates', availability.assignedTeammates.filter(t => t.id !== id));
        }}
      />
    </BlockStack>
  );
}
