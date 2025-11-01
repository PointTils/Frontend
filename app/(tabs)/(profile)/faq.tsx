import { Button } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { router } from 'expo-router';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Como posso agendar um intérprete?',
    answer:
      'Para agendar um intérprete, vá até a aba "Intérpretes" e use a busca para encontrar profissionais disponíveis. Selecione o intérprete desejado e clique em "Agendar" para escolher data e horário.',
  },
  {
    question: 'Quais são os tipos de modalidade disponíveis?',
    answer:
      'Oferecemos três modalidades: Presencial (atendimento físico), Online (atendimento remoto) e Híbrido (combinação de presencial e online).',
  },
  {
    question: 'Como funciona o sistema de avaliações?',
    answer:
      'Após cada atendimento, você pode avaliar o intérprete com notas de 1 a 5 estrelas e deixar comentários sobre sua experiência. Essas avaliações ajudam outros usuários na escolha.',
  },
  {
    question: 'Posso cancelar um agendamento?',
    answer:
      'Sim, você pode cancelar agendamentos através da aba "Agendamentos". Consulte nossa política de cancelamento para informações sobre reembolsos.',
  },
  {
    question: 'Como atualizo meus dados pessoais?',
    answer:
      'Você pode atualizar seus dados pessoais acessando "Editar Perfil" na sua tela de perfil. Lá você pode modificar informações como nome, telefone, email e preferências.',
  },
  {
    question: 'O que fazer se tiver problemas técnicos?',
    answer:
      'Se você encontrar problemas técnicos, entre em contato conosco através do email de suporte ou use o formulário de contato disponível no aplicativo.',
  },
  {
    question: 'Como funciona o pagamento?',
    answer:
      'Os pagamentos são processados de forma segura através de nossa plataforma. Aceitamos cartões de crédito e débito, além de PIX.',
  },
  {
    question: 'Posso agendar para outras pessoas?',
    answer:
      'Sim, você pode agendar intérpretes para outras pessoas. Durante o processo de agendamento, você pode especificar se o atendimento é para você ou para outra pessoa.',
  },
];

export default function FAQScreen() {
  const colors = useColors();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

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
        {faqData.map((item, index) => (
          <View key={index} className="mb-2">
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
            onPress={() => {
              // TODO: Implement contact support functionality
            }}
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
