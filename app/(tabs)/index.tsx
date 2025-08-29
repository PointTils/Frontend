import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import  MultiSelect   from '@/src/components/MultiSelect/MultiSelect'

export default function HomeScreen() {

    const options = ['Teste 1', 'Teste 2', 'Teste 3', 'Teste 4', 'Teste 5', 'Teste 6', 'Teste 7', 'Teste 8'];

      const handleChange = (values) => {
        console.log('Selecionados:', values);
      };

  return (
    <View
      className="flex-1 items-center justify-center"
      accessibilityLabel={Strings.home.title}
    >
      <Text className="font-ifood-regular">{Strings.home.title}</Text>
      <MultiSelect
         label="Teste Componente 1"
         options={options}
         placeholder="Selecione uma ou mais opções"
         onChange={handleChange}
      />
      <Text className="font-ifood-regular">{Strings.home.title}</Text>
      <MultiSelect
         label="Teste Componente 2"
         options={options}
         placeholder="Selecione uma ou mais opções"
         onChange={handleChange}
      />
      <Text className="font-ifood-regular">{Strings.home.title}</Text>
      <MultiSelect
         label="Teste Componente 3"
         options={options}
         placeholder="Selecione uma ou mais opções"
         onChange={handleChange}
      />

    </View>
  );
}
