import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '@/src/components/ui/view';
import { Card } from '@/src/components/ui/card';

export default function CardTestScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-50">
      <View className="flex-1 items-center p-4 gap-y-6">
        {/* CARD 1 — Appointment com avaliação */}
        <Card
          photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
          fullName="Nome Sobrenome"
          specialty="Intérprete de Libras"
          rating={4.4}
          showRating
          date="20/08/2025 11:30 - 12:30"
          location="Av. Ipiranga 6681, Parte..."
        />

        {/* CARD 2 — TIL (CPF) sem estrelas */}
        <Card
          photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
          fullName="Nome Sobrenome"
          subtitle="XXX.XXX.XXX-XX"
          showRating={false}
          date="20/08/2025 11:30 - 12:30"
          location="Online"
        />

        {/* CARD 3 — TIL (CNPJ) sem estrelas + Pendente */}
        <Card
          photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
          fullName="Razão social"
          subtitle="XX.XXX.XXX/0001-XX"
          showRating={false}
          pending
          date="20/08/2025 11:30 - 12:30"
          location="Av. Ipiranga 6681, Parte..."
        />

        {/* CARD 4 — Search (com Localização) */}
        <Card
          variant="search"
          photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
          fullName="Nome Sobrenome"
          specialty="Intérprete de Libras"
          rating={4.5}
          modality="Presencial/Online"
          priceRange="R$ 100 - R$ 2.500"
          location="Porto Alegre, Canoas & Gravataí"
        />
      </View>
    </SafeAreaView>
  );
}
