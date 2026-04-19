import React, { useState, useMemo } from 'react';
import { Modal, TextField, Icon, Box, InlineStack, Text, Badge, Link, ResourceList, ResourceItem, Avatar, BlockStack } from '@shopify/polaris';
import { SearchIcon, CheckIcon } from '@shopify/polaris-icons';
import { SelectedTeammate } from './types';

const TEAMMATES = [
  { id: "tm_1", name: "Leo",   initials: "L",  available: true  },
  { id: "tm_2", name: "Marc",  initials: "M",  available: true  },
  { id: "tm_3", name: "Theo",  initials: "T",  available: true  },
  { id: "tm_4", name: "Mateo", initials: "MA", available: false },
];

interface TeammateChooserModalProps {
  open: boolean;
  onClose: () => void;
  selectedTeammates: SelectedTeammate[];
  onSelect: (teammate: SelectedTeammate) => void;
  onDeselect: (id: string) => void;
}

export default function TeammateChooserModal({ open, onClose, selectedTeammates, onSelect, onDeselect }: TeammateChooserModalProps) {
  const [searchValue, setSearchValue] = useState('');

  const filteredTeammates = useMemo(() => {
    return TEAMMATES.filter(t => t.name.toLowerCase().includes(searchValue.toLowerCase()));
  }, [searchValue]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Choose a teammate"
      footer={
        <InlineStack align="space-between" blockAlign="center">
          <Link url="/team">Manage teammates in Team settings</Link>
          <Box>
            {/* The prompt says "Footer buttons: Cancel (plain)". But it also says "No Create new teammate button... Instead show a subtle text link". 
                I'll put the link on the left and the Cancel button on the right. */}
          </Box>
        </InlineStack>
      }
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: onClose,
        }
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          <TextField
            label=""
            labelHidden
            placeholder="Search for a teammate..."
            prefix={<Icon source={SearchIcon} />}
            value={searchValue}
            onChange={setSearchValue}
            autoComplete="off"
          />
          <Box>
            <ResourceList
              resourceName={{ singular: 'teammate', plural: 'teammates' }}
              items={filteredTeammates}
              renderItem={(teammate) => {
                const isSelected = selectedTeammates.some(t => t.id === teammate.id);
                return (
                  <ResourceItem
                    key={teammate.id}
                    id={teammate.id}
                    onClick={() => {
                      if (isSelected) {
                        onDeselect(teammate.id);
                      } else {
                        onSelect({
                          ...teammate,
                          displayOrder: selectedTeammates.length
                        });
                        onClose();
                      }
                    }}
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <InlineStack gap="300" blockAlign="center">
                        <Avatar customer size="md" name={teammate.name} initials={teammate.initials} />
                        <Text as="span" variant="bodyMd" fontWeight="bold" tone={isSelected ? 'subdued' : 'base'}>
                          {teammate.name}
                        </Text>
                      </InlineStack>
                      <InlineStack gap="300" blockAlign="center">
                        {teammate.available ? (
                          <Badge tone="success">Available</Badge>
                        ) : (
                          <Badge tone="critical">Unavailable</Badge>
                        )}
                        {isSelected && <Icon source={CheckIcon} tone="subdued" />}
                      </InlineStack>
                    </InlineStack>
                  </ResourceItem>
                );
              }}
            />
          </Box>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
