import { useLocalSearchParams } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '@/src/contexts/AuthProvider'; 
import DetalheAgendamento from './detalhesagendamento';
import DetalheAgendamentoUsuario from './detalhesagendamentousuario';
import { UserType } from '@/src/types/api/common'

export default function AppointmentDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (user?.type === UserType.INTERPRETER) {
    return <DetalheAgendamento/>;
  }
  return <DetalheAgendamentoUsuario/>;
  
}
