import React from 'react';
import { View } from '@/src/components/ui/view';
import { Card } from '@/src/components/ui/card';
import { useColors } from '@/src/hooks/useColors';

/**
 * PÁGINA DE TESTE DO COMPONENTE CARD
 * 
 * Esta página foi criada temporariamente para testar o componente Card.
 * Para voltar ao comportamento normal do app:
 * 1. Delete este arquivo (app/card-test.tsx)
 * 2. No arquivo app/_layout.tsx, remova a linha "router.replace('/card-test');" 
 *    e descomente o código de navegação normal
 * 3. Remova a rota "card-test" do Stack Navigator
 */
export default function CardTestScreen() {
  const colors = useColors();
  
  // Dados do mockup
  const profileData = {
    photoUrl: 'https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg',
    fullName: 'Nome Sobrenome',
    specialty: 'Intérprete de Tátil',
    rating: 4.4,
    date: '20/08/2025 11:30 - 12:30',
    location: 'Av. Ipiranga 6681, Parte...'
  };

  return (
    <View className="flex-1 bg-background-50 items-center justify-center p-4">
      {/* 
        EXEMPLOS DE COMO USAR AS CORES GLOBAIS:
        
        1. Com Tailwind (recomendado para estilos simples):
           - bg-background-0, bg-background-50, bg-background-100
           - text-typography-900, text-typography-600
           - bg-primary-500, bg-secondary-200
        
        2. Com hook useColors (para lógica dinâmica):
           - colors.background, colors.text, colors.primaryOrange
        
        3. Com style inline usando as cores:
           - style={{ backgroundColor: colors.fieldGray }}
      */}

      <Card
        photoUrl={profileData.photoUrl}
        fullName={profileData.fullName}
        specialty={profileData.specialty}
        rating={profileData.rating}
        date={profileData.date}
        location={profileData.location}
      />
      
    </View>
  );
}
