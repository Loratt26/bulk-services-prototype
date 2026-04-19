'use client';

import { AppProvider, Page, Layout, Card, InlineStack, Text } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';
import CreateGroupServicesWizard from '@/components/CreateGroupServices';

export default function Home() {
  return (
    <AppProvider i18n={enTranslations}>
      <Page title="My services">
        <Layout>
          <Layout.Section>
            <Card>
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">
                  Services
                </Text>
                <CreateGroupServicesWizard />
              </InlineStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
}
