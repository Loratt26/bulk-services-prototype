import React, { useState, useCallback, useMemo } from 'react';
import {
  Button,
  Modal,
  ProgressBar,
  Text,
  BlockStack,
  InlineStack,
  Box,
  Divider,
  Banner,
  Spinner,
  Icon,
} from '@shopify/polaris';
import { CheckCircleIcon } from '@shopify/polaris-icons';

import { WizardState, ShopifyProduct } from './types';
import { generateShopifyProducts, validatePrimaryServices, validateAddOns, getPreDefinedPrimaries, getPreDefinedAddOns, getTotalVariantCount } from './utils';
import Step1BusinessType from './steps/Step1BusinessType';
import Step2Services from './steps/Step2Services';
import Step3Availability from './steps/Step3Availability';
import Step4AdvancedSettings from './steps/Step4AdvancedSettings';
import Step5Confirm from './steps/Step5Confirm';

const STEPS = [
  'Business type',
  'Services',
  'Availability',
  'Settings',
  'Confirm',
];

const INITIAL_STATE: WizardState = {
  currentStep: 1,
  businessType: null,
  primaries: [],
  addOns: [],
  availability: {
    mode: ['teammate'],
    assignedTeammates: [],
    schedulingInterval: '30',
    minimumNotice: '1 day',
    lookAhead: '3 months',
  },
  advancedSettings: {
    contactInfo: 'Email only',
    askConfirmationEmail: false,
    reminders: [{ id: '1', value: '1', unit: 'days' }],
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    minReschedulingNotice: '1 day',
    minCancellingNotice: '1 day',
    showCancelButton: true,
    showRescheduleButton: true,
    enablePostBooking: false,
    postBookingDelayValue: '1',
    postBookingDelayUnit: 'days',
    postBookingLanguage: 'English',
    postBookingSubject: 'Thank you for your visit!',
    postBookingBody: 'We hope to see you again soon.',
  },
};

export default function CreateGroupServicesWizard() {
  const [active, setActive] = useState(false);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [primaryErrors, setPrimaryErrors] = useState<Record<string, string>>({});
  const [addOnErrors, setAddOnErrors] = useState<Record<string, string>>({});

  // Loading and Success state
  const [isCreating, setIsCreating] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleModal = useCallback(() => {
    setActive((prev) => !prev);
    if (!active) {
      // Reset state when opening
      setState(INITIAL_STATE);
      setValidationError(null);
      setPrimaryErrors({});
      setAddOnErrors({});
      setIsCreating(false);
      setCreatedCount(0);
      setIsSuccess(false);
    }
  }, [active]);

  const products = useMemo(() => {
    return generateShopifyProducts(state.primaries, state.addOns);
  }, [state.primaries, state.addOns]);

  const totalVariants = useMemo(() => {
    return getTotalVariantCount(state.primaries, state.addOns);
  }, [state.primaries, state.addOns]);

  const handleNext = useCallback(() => {
    setValidationError(null);
    setPrimaryErrors({});
    setAddOnErrors({});

    if (state.currentStep === 1) {
      if (!state.businessType) {
        setValidationError('Please select a business type to continue.');
        return;
      }

      // Auto-populate services if moving from step 1 to 2 and services are empty
      if (state.primaries.length === 0 && state.addOns.length === 0) {
        const preDefinedPrimaries = getPreDefinedPrimaries(state.businessType);
        const preDefinedAddOns = getPreDefinedAddOns(state.businessType);

        setState((prev) => ({
          ...prev,
          primaries: preDefinedPrimaries.map((s, i) => ({ ...s, id: `primary-${Date.now()}-${i}` })),
          addOns: preDefinedAddOns.map((s, i) => ({ ...s, id: `addon-${Date.now()}-${i}` })),
          currentStep: 2,
        }));
        return;
      }
    }

    if (state.currentStep === 2) {
      const primaryValidation = validatePrimaryServices(state.primaries);
      const addOnValidation = validateAddOns(state.addOns);

      if (!primaryValidation.valid || !addOnValidation.valid) {
        setPrimaryErrors(primaryValidation.errors);
        setAddOnErrors(addOnValidation.errors);
        setValidationError('Please fix the errors in your services before continuing.');
        return;
      }
    }

    if (state.currentStep === 3) {
      if (state.availability.assignedTeammates.length === 0) {
        setValidationError('You must assign at least one teammate to proceed.');
        return;
      }
    }

    if (state.currentStep < 5) {
      setState((prev) => ({ ...prev, currentStep: (prev.currentStep + 1) as any }));
    }
  }, [state]);

  const handleBack = useCallback(() => {
    setValidationError(null);
    if (state.currentStep > 1) {
      setState((prev) => ({ ...prev, currentStep: (prev.currentStep - 1) as any }));
    }
  }, [state.currentStep]);

  const createShopifyProduct = useCallback(async (product: ShopifyProduct) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1000));
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          availability: state.availability,
          advancedSettings: state.advancedSettings,
        }),
      });
    } catch {
      // Ignore fetch errors for this demo
    }
  }, [state.advancedSettings, state.availability]);

  const handleCreate = useCallback(async () => {
    setActive(false);
    setIsCreating(true);
    setCreatedCount(0);

    let completed = 0;
    const promises = products.map(async (product) => {
      await createShopifyProduct(product);
      completed++;
      setCreatedCount(completed);
    });

    await Promise.all(promises);

    setIsCreating(false);
    setIsSuccess(true);
  }, [createShopifyProduct, products]);

  const progress = (state.currentStep / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <Step1BusinessType
            businessType={state.businessType}
            onChange={(type) => setState({ ...state, businessType: type, primaries: [], addOns: [] })}
          />
        );
      case 2:
        return (
          <Step2Services
            primaries={state.primaries}
            addOns={state.addOns}
            onChangePrimaries={(primaries) => setState({ ...state, primaries })}
            onChangeAddOns={(addOns) => setState({ ...state, addOns })}
            primaryErrors={primaryErrors}
            addOnErrors={addOnErrors}
          />
        );
      case 3:
        return (
          <Step3Availability
            availability={state.availability}
            onChange={(availability) => setState({ ...state, availability })}
            primaries={state.primaries}
            addOns={state.addOns}
          />
        );
      case 4:
        return (
          <Step4AdvancedSettings
            settings={state.advancedSettings}
            onChange={(advancedSettings) => setState({ ...state, advancedSettings })}
          />
        );
      case 5:
        return (
          <Step5Confirm
            primaries={state.primaries}
            addOns={state.addOns}
            availability={state.availability}
            advancedSettings={state.advancedSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Button onClick={toggleModal}>Create Group services</Button>

      <Modal
        open={active}
        onClose={toggleModal}
        title="Create Group Services"
        primaryAction={{
          content: state.currentStep === 5 ? 'Create group services' : 'Next',
          onAction: state.currentStep === 5 ? handleCreate : handleNext,
          disabled: (state.currentStep === 1 && !state.businessType) || (state.currentStep === 2 && (state.primaries.length === 0 || state.addOns.length === 0)),
        }}
        secondaryActions={[
          {
            content: state.currentStep === 1 ? 'Cancel' : 'Back',
            onAction: state.currentStep === 1 ? toggleModal : handleBack,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Box>
              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text as="h2" variant="headingSm">
                    Step {state.currentStep} of {STEPS.length}: {STEPS[state.currentStep - 1]}
                  </Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    {Math.round(progress)}%
                  </Text>
                </InlineStack>
                <ProgressBar progress={progress} size="small" tone="primary" />
                <Box paddingBlockStart="200">
                  <InlineStack gap="200" align="center">
                    {STEPS.map((step, idx) => (
                      <React.Fragment key={step}>
                        <Text
                          as="span"
                          variant="bodySm"
                          fontWeight={state.currentStep === idx + 1 ? 'bold' : 'regular'}
                          tone={state.currentStep === idx + 1 ? 'base' : 'subdued'}
                        >
                          {step}
                        </Text>
                        {idx < STEPS.length - 1 && (
                          <Text as="span" variant="bodySm" tone="subdued">
                            {'->'}
                          </Text>
                        )}
                      </React.Fragment>
                    ))}
                  </InlineStack>
                </Box>
              </BlockStack>
            </Box>

            <Divider />

            {validationError && (
              <Banner tone="critical">
                <p>{validationError}</p>
              </Banner>
            )}

            <Box paddingBlockStart="400" paddingBlockEnd="400">
              {renderStepContent()}
            </Box>
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Loading Modal */}
      <Modal open={isCreating} onClose={() => {}} title="Creating services" titleHidden>
        <Modal.Section>
          <Box padding="400">
            <BlockStack gap="400" align="center" inlineAlign="center">
              <Spinner size="large" />
              <Text as="h2" variant="headingMd">Creating your group services...</Text>
              <Text as="p" variant="bodyMd" tone="subdued">Creating product {createdCount} of {products.length}...</Text>
            </BlockStack>
          </Box>
        </Modal.Section>
      </Modal>

      {/* Success Modal */}
      <Modal open={isSuccess} onClose={() => setIsSuccess(false)} title="Success" titleHidden>
        <Modal.Section>
          <Box padding="400">
            <BlockStack gap="400" align="center" inlineAlign="center">
              <div style={{ transform: 'scale(2)', margin: '20px 0' }}>
                <Icon source={CheckCircleIcon} tone="success" />
              </div>
              <Text as="h2" variant="headingLg">Group services created!</Text>
              <Text as="p" variant="bodyMd">Your {products.length} products and {totalVariants} variants are now ready for bookings.</Text>
              <Box paddingBlockStart="200" paddingBlockEnd="200">
                <Banner tone="info">
                  <p>Next step: Add the Group Booking widget to your store. These services are exclusively bookable through the Group Booking widget.</p>
                </Banner>
              </Box>
              <InlineStack gap="300" align="center">
                <Button variant="plain" onClick={() => setIsSuccess(false)}>View created services</Button>
                <Button variant="primary" onClick={() => setIsSuccess(false)}>Add widget to store</Button>
                <Button onClick={() => setIsSuccess(false)}>Close</Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Modal.Section>
      </Modal>
    </>
  );
}
