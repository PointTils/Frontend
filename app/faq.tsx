import Header from '@/src/components/Header';
import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { ParametersKeys } from '@/src/types/api';
import type { ParameterResponse } from '@/src/types/api';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp, PackageSearchIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Toast } from 'toastify-react-native';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQScreen() {
  const colors = useColors();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Fetch FAQ data from API
  const { data, loading, error } = useApiGet<ParameterResponse>(
    ApiRoutes.parameters.byKey(ParametersKeys.faq),
  );

  // Fetch contact email from API
  const { data: contactEmailData, loading: contactEmailLoading } =
    useApiGet<ParameterResponse>(
      ApiRoutes.parameters.byKey(ParametersKeys.test_contact_email),
    );

  // Parse FAQ items from JSON string
  const faqData: FAQItem[] = useMemo(() => {
    if (!data?.success || !data.data?.value) {
      return [];
    }

    try {
      const parsed = JSON.parse(data.data.value) as FAQItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [data]);

  // Extract contact email
  const contactEmail = useMemo(() => {
    if (contactEmailData?.success && contactEmailData.data?.value) {
      return contactEmailData.data.value;
    }
    return null;
  }, [contactEmailData]);

  // Handle contact button press
  const handleContactPress = async () => {
    if (!contactEmail) return;

    const mailtoUrl = `mailto:${contactEmail}`;

    try {
      // Check if the URL can be opened
      const canOpen = await Linking.canOpenURL(mailtoUrl);

      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        // Show error toast if cannot open
        Toast.show({
          type: 'error',
          text1: Strings.faq.toast.contactEmailErrorTitle,
          text2: Strings.faq.toast.contactEmailErrorDescription,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          closeIconSize: 1,
        });
      }
    } catch {
      // Show error toast if opening fails
      Toast.show({
        type: 'error',
        text1: Strings.faq.toast.contactEmailErrorTitle,
        text2: Strings.faq.toast.contactEmailErrorDescription,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        closeIconSize: 1,
      });
    }
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <View className="flex-1 justify-center">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.faq.header}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      {/* FAQ Content */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {loading && (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator color={colors.primaryBlue} size="small" />
            <Text className="mt-2 font-ifood-regular text-primary-blue-light">
              {Strings.common.loading}
            </Text>
          </View>
        )}

        {error && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="font-ifood-regular text-primary-800 text-center">
              {Strings.faq.error}
            </Text>
          </View>
        )}

        {!loading && !error && faqData.length === 0 && (
          <View className="flex-1 justify-center gap-y-4 items-center">
            <PackageSearchIcon size={38} color={colors.detailsGray} />
            <Text className="font-ifood-regular text-typography-400 text-md">
              {Strings.common.noResults}
            </Text>
          </View>
        )}

        {!loading && !error && faqData.length > 0 && (
          <>
            {faqData.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => toggleExpanded(index)}
                  className="py-4 px-2 flex-row items-center justify-between border-b border-gray-200"
                >
                  <Text className="flex-1 text-md font-ifood-regular text-text-light pr-2">
                    {item.question}
                  </Text>
                  {expandedItems.has(index) ? (
                    <ChevronUp size={20} color={colors.faqChevron} />
                  ) : (
                    <ChevronDown size={20} color={colors.faqChevron} />
                  )}
                </TouchableOpacity>

                {expandedItems.has(index) && (
                  <View className="px-2 pt-2 pb-4">
                    <Text className="text-sm font-ifood-regular text-primary-300 leading-5">
                      {item.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* Contact Section */}
        <View className="mt-8 p-4 bg-primary-blue-light rounded-lg">
          <Text className="text-base font-ifood-medium text-text-dark mb-2">
            {Strings.faq.contactTitle}
          </Text>
          <Text className="text-sm font-ifood-regular text-text-dark mb-6">
            {Strings.faq.contactDescription}
          </Text>
          <Button
            size="md"
            variant="solid"
            className="bg-primary-orange-light"
            onPress={handleContactPress}
            disabled={!contactEmail || contactEmailLoading}
          >
            <Text className="font-ifood-medium text-white">
              {Strings.faq.contactButton}
            </Text>
          </Button>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
