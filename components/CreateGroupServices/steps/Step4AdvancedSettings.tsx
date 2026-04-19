import React, { useState, useCallback } from 'react';
import {
  BlockStack,
  Text,
  Card,
  InlineStack,
  Icon,
  Badge,
  Checkbox,
  TextField,
  Select,
  Divider,
  Button,
  Box,
} from '@shopify/polaris';
import { ChevronUpIcon, ChevronDownIcon, DeleteIcon } from '@shopify/polaris-icons';
import { AdvancedSettings } from '../types';

interface Step4Props {
  settings: AdvancedSettings;
  onChange: (settings: AdvancedSettings) => void;
}

export default function Step4AdvancedSettings({ settings, onChange }: Step4Props) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    customQuestions: false,
    reminders: false,
    customerNotifications: false,
    minReschedulingNotice: false,
    minCancellingNotice: false,
    postBookingNotification: false,
  });

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const updateField = (field: keyof AdvancedSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <BlockStack gap="400">
      <Text as="p" variant="bodyMd">
        Configure advanced settings for your group services.
      </Text>

      {/* Section 2: Custom questions */}
      <Card>
        <BlockStack gap="400">
          <div style={{ cursor: 'pointer' }} onClick={() => toggleSection('customQuestions')}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingSm">Custom questions</Text>
                <Badge tone="info">PRO</Badge>
              </InlineStack>
              <Icon source={expandedSections.customQuestions ? ChevronUpIcon : ChevronDownIcon} />
            </InlineStack>
          </div>
          {expandedSections.customQuestions && (
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd" tone="subdued">Add custom questions to the booking form</Text>
              <Select
                label="What contact information to ask?"
                options={['Email only', 'Email & phone', 'None']}
                value={settings.contactInfo}
                onChange={(val) => updateField('contactInfo', val)}
              />
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodyMd">Name</Text>
                  <InlineStack gap="200">
                    <Badge>Text</Badge>
                    <Badge tone="success">Required</Badge>
                  </InlineStack>
                </InlineStack>
                <Divider />
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodyMd">Email</Text>
                  <InlineStack gap="200">
                    <Badge>Email</Badge>
                    <Badge tone="success">Required</Badge>
                  </InlineStack>
                </InlineStack>
                <Divider />
                <InlineStack align="space-between" blockAlign="center">
                  <Text as="p" variant="bodyMd">Phone number</Text>
                  <InlineStack gap="200">
                    <Badge>Phone</Badge>
                    <Badge tone="info">Optional</Badge>
                  </InlineStack>
                </InlineStack>
              </BlockStack>
              <InlineStack>
                <Button variant="plain">+ Add a question</Button>
              </InlineStack>
              <Checkbox
                label="Ask confirmation email to the customer"
                checked={settings.askConfirmationEmail}
                onChange={(val) => updateField('askConfirmationEmail', val)}
              />
            </BlockStack>
          )}
        </BlockStack>
      </Card>

      {/* Section 3: Reminders */}
      <Card>
        <BlockStack gap="400">
          <div style={{ cursor: 'pointer' }} onClick={() => toggleSection('reminders')}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingSm">Reminders</Text>
                <Badge tone="info">PRO</Badge>
              </InlineStack>
              <Icon source={expandedSections.reminders ? ChevronUpIcon : ChevronDownIcon} />
            </InlineStack>
          </div>
          {expandedSections.reminders && (
            <BlockStack gap="300">
              {settings.reminders.map((reminder: any, index: number) => (
                <InlineStack key={reminder.id} gap="300" blockAlign="center">
                  <Box width="80px">
                    <TextField
                      label="Value"
                      labelHidden
                      type="number"
                      value={reminder.value}
                      onChange={(val) => {
                        const newReminders = [...settings.reminders];
                        newReminders[index].value = val;
                        updateField('reminders', newReminders);
                      }}
                      autoComplete="off"
                    />
                  </Box>
                  <Box width="120px">
                    <Select
                      label="Unit"
                      labelHidden
                      options={['minutes', 'hours', 'days']}
                      value={reminder.unit}
                      onChange={(val) => {
                        const newReminders = [...settings.reminders];
                        newReminders[index].unit = val;
                        updateField('reminders', newReminders);
                      }}
                    />
                  </Box>
                  <Button
                    icon={DeleteIcon}
                    accessibilityLabel="Delete reminder"
                    onClick={() => {
                      updateField('reminders', settings.reminders.filter((_: any, i: number) => i !== index));
                    }}
                  />
                </InlineStack>
              ))}
              <InlineStack>
                <Button
                  variant="plain"
                  onClick={() => {
                    updateField('reminders', [...settings.reminders, { id: `rem-${Date.now()}`, value: '1', unit: 'hours' }]);
                  }}
                >
                  + Add a reminder
                </Button>
              </InlineStack>
            </BlockStack>
          )}
        </BlockStack>
      </Card>

      {/* Section 4: Customer notifications */}
      <Card>
        <BlockStack gap="400">
          <div style={{ cursor: 'pointer' }} onClick={() => toggleSection('customerNotifications')}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingSm">Customer notifications</Text>
                <Badge tone="info">PRO</Badge>
              </InlineStack>
              <Icon source={expandedSections.customerNotifications ? ChevronUpIcon : ChevronDownIcon} />
            </InlineStack>
          </div>
          {expandedSections.customerNotifications && (
            <BlockStack gap="300">
              <Checkbox
                label="Email notifications"
                checked={settings.emailNotifications}
                onChange={(val) => updateField('emailNotifications', val)}
              />
              <InlineStack gap="200" blockAlign="center">
                <Checkbox
                  label="SMS notifications"
                  checked={settings.smsNotifications}
                  onChange={(val) => updateField('smsNotifications', val)}
                />
                <Badge tone="success">ULTRA</Badge>
              </InlineStack>
              <InlineStack gap="200" blockAlign="center">
                <Checkbox
                  label="WhatsApp notifications"
                  checked={settings.whatsappNotifications}
                  onChange={(val) => updateField('whatsappNotifications', val)}
                />
                <Badge tone="success">ULTRA</Badge>
              </InlineStack>
            </BlockStack>
          )}
        </BlockStack>
      </Card>

      {/* Section 5: Minimum rescheduling notice */}
      <Card>
        <BlockStack gap="400">
          <div style={{ cursor: 'pointer' }} onClick={() => toggleSection('minReschedulingNotice')}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingSm">Minimum rescheduling notice</Text>
                <Badge tone="info">PRO</Badge>
              </InlineStack>
              <Icon source={expandedSections.minReschedulingNotice ? ChevronUpIcon : ChevronDownIcon} />
            </InlineStack>
          </div>
          {expandedSections.minReschedulingNotice && (
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd" tone="subdued">To prevent last minute rescheduling.</Text>
              <Select
                label="Minimum rescheduling notice"
                labelHidden
                options={['1 hour', '2 hours', '1 day', '2 days', '1 week', '2 weeks']}
                value={settings.minReschedulingNotice}
                onChange={(val) => updateField('minReschedulingNotice', val)}
              />
            </BlockStack>
          )}
        </BlockStack>
      </Card>

      {/* Section 6: Minimum cancelling notice */}
      <Card>
        <BlockStack gap="400">
          <div style={{ cursor: 'pointer' }} onClick={() => toggleSection('minCancellingNotice')}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingSm">Minimum cancelling notice</Text>
                <Badge tone="info">PRO</Badge>
              </InlineStack>
              <Icon source={expandedSections.minCancellingNotice ? ChevronUpIcon : ChevronDownIcon} />
            </InlineStack>
          </div>
          {expandedSections.minCancellingNotice && (
            <BlockStack gap="300">
              <Text as="p" variant="bodyMd" tone="subdued">To prevent last minute cancelling.</Text>
              <Select
                label="Minimum cancelling notice"
                labelHidden
                options={['1 hour', '2 hours', '1 day', '2 days', '1 week', '2 weeks']}
                value={settings.minCancellingNotice}
                onChange={(val) => updateField('minCancellingNotice', val)}
              />
              <Checkbox
                label="Show cancel button in emails"
                checked={settings.showCancelButton}
                onChange={(val) => updateField('showCancelButton', val)}
              />
              <Checkbox
                label="Show reschedule button in emails"
                checked={settings.showRescheduleButton}
                onChange={(val) => updateField('showRescheduleButton', val)}
              />
            </BlockStack>
          )}
        </BlockStack>
      </Card>

      {/* Section 7: Post booking notification */}
      <Card>
        <BlockStack gap="400">
          <div style={{ cursor: 'pointer' }} onClick={() => toggleSection('postBookingNotification')}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="200" blockAlign="center">
                <Text as="h3" variant="headingSm">Post booking notification</Text>
                <Badge tone="success">ULTRA</Badge>
              </InlineStack>
              <Icon source={expandedSections.postBookingNotification ? ChevronUpIcon : ChevronDownIcon} />
            </InlineStack>
          </div>
          {expandedSections.postBookingNotification && (
            <BlockStack gap="300">
              <Checkbox
                label="Should we send an email after the booking date?"
                checked={settings.enablePostBooking}
                onChange={(val) => updateField('enablePostBooking', val)}
              />
              {settings.enablePostBooking && (
                <BlockStack gap="300">
                  <InlineStack gap="300" blockAlign="center">
                    <Text as="p" variant="bodyMd">Send after this delay:</Text>
                    <Box width="80px">
                      <TextField
                        label="Delay value"
                        labelHidden
                        type="number"
                        value={settings.postBookingDelayValue}
                        onChange={(val) => updateField('postBookingDelayValue', val)}
                        autoComplete="off"
                      />
                    </Box>
                    <Box width="120px">
                      <Select
                        label="Delay unit"
                        labelHidden
                        options={['hours', 'days']}
                        value={settings.postBookingDelayUnit}
                        onChange={(val) => updateField('postBookingDelayUnit', val)}
                      />
                    </Box>
                  </InlineStack>
                  <Select
                    label="Language"
                    options={['English', 'Spanish', 'French', 'German']}
                    value={settings.postBookingLanguage}
                    onChange={(val) => updateField('postBookingLanguage', val)}
                  />
                  <TextField
                    label="Subject"
                    value={settings.postBookingSubject}
                    onChange={(val) => updateField('postBookingSubject', val)}
                    autoComplete="off"
                  />
                  <TextField
                    label="Body"
                    value={settings.postBookingBody}
                    onChange={(val) => updateField('postBookingBody', val)}
                    autoComplete="off"
                    multiline={6}
                  />
                </BlockStack>
              )}
            </BlockStack>
          )}
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
