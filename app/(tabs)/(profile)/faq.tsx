import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import type { ParameterResponse } from '@/src/types/api';
import { router } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, TouchableOpacity } from 'react-native';
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
    ApiRoutes.parameters.byKey('FAQ'),
  );

  // Fetch contact email from API
  const {
    data: contactEmailData,
    loading: contactEmailLoading,
  } = useApiGet<ParameterResponse>(
    ApiRoutes.parameters.byKey('TEST_CONTACT_EMAIL'),
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
    if (
      contactEmailData?.success &&
      contactEmailData.data?.value
    ) {
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
          text1: 'Erro',
          text2: Strings.profile.contactEmailError,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          closeIconSize: 1,
        });
      }
    } catch (err) {
      // Show error toast if opening fails
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: Strings.profile.contactEmailError,
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
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 pt-12 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color={colors.primaryOrange} />
        </TouchableOpacity>
        <Text className="text-base font-ifood-bold text-primary-800">
          {Strings.profile.faqTitle}
        </Text>
        <View className="w-10" />
      </View>

      {/* FAQ Content */}
      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
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
              Erro ao carregar perguntas frequentes. Tente novamente mais
              tarde.
            </Text>
          </View>
        )}

        {!loading && !error && faqData.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="font-ifood-regular text-primary-800 text-center">
              Nenhuma pergunta encontrada.
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
                  <Text className="flex-1 text-base font-ifood-regular text-primary-800 pr-2">
                    {item.question}
                  </Text>
                  {expandedItems.has(index) ? (
                    <ChevronUp size={20} color="#9CA3AF" />
                  ) : (
                    <ChevronDown size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>

                {expandedItems.has(index) && (
                  <View className="px-2 pt-2 pb-4">
                    <Text className="text-sm font-ifood-regular text-primary-700 leading-5">
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
          <Text className="text-base font-ifood-medium text-primary-800 mb-2">
            {Strings.profile.contactTitle}
          </Text>
          <Text className="text-sm font-ifood-regular text-primary-700 mb-4">
            {Strings.profile.contactDescription}
          </Text>
          <Button
            size="md"
            variant="solid"
            className="bg-primary-blue"
            onPress={handleContactPress}
            disabled={!contactEmail || contactEmailLoading}
          >
            <Text className="font-ifood-medium text-white">
              {Strings.profile.contactButton}
            </Text>
          </Button>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
