import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import MultiSelect from '@/src/components/MultiSelect';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from '@/src/components/ui/radio';
import {
  FileText,
  Bookmark,
  BriefcaseBusiness,
  Check,
  X,
  ChevronLeft,
  CircleIcon,
} from 'lucide-react-native';
import {
  handleBirthDateChange,
  handleCnpjChange,
  handlePhoneChange,
} from '@/src/utils/mask';
import { useRouter } from 'expo-router';

type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
type TimeRange = [string, string];

export default function EditScreen() {
  // Estados
  const [name, setName] = useState('Jefinho');
  const [birthDate, setBirthDate] = useState('30/09/1996');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('(51) 99876-4422');
  const [email, setEmail] = useState('exemplo@exemplo.com');
  const [cnpj, setCnpj] = useState('XX.XXX.XXX/0001-XX');
  const [description, setDescription] = useState(
    'Descreva o seu trabalho, como tipos de serviços prestados e experiências.',
  );
  const [modality, setModality] = useState(['Presencial', 'Online']);
  const [location, setLocation] = useState('Floresta, Porto Alegre - RS');
  const [imageRight, setImageRight] = useState('authorize');
  const [minPrice, setMinPrice] = useState('100');
  const [maxPrice, setMaxPrice] = useState('1000');

  const [weekHours, setWeekHours] = useState<Record<Day, TimeRange>>({
    monday: ['12:30', '19:30'],
    tuesday: ['12:30', '19:30'],
    wednesday: ['12:30', '19:30'],
    thursday: ['12:30', '19:30'],
    friday: ['12:30', '19:30'],
    saturday: ['12:30', '19:30'],
    sunday: ['12:30', '19:30'],
  });

  const router = useRouter();
  const colors = useColors();

  const type = 'Intérprete';
  const options: any[] = ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5'];

  const handleChange = (options: any[]) => {
    console.log(options);
  };

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  };

  return (
    <>
      {/* Header */}
      <View className="flex-row justify-center py-12 w-full">
        <TouchableOpacity
          className="absolute top-12 left-2"
          onPress={handleBack}
        >
          <ChevronLeft color={colors.primaryOrange} />
        </TouchableOpacity>

        <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
          {Strings.edit.title}
        </Text>
      </View>
      <ScrollView>
        <View className="flex-col items-center gap-4 w-full">
          <View className="w-full flex-row self-start items-center px-8 gap-2">
            <FileText />
            <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.edit.data}
            </Text>
          </View>

          {/* Campos comuns para Intérprete/Solicitante */}
          {(type === `${Strings.edit.client}` ||
            type === `${Strings.edit.interpreter}`) && (
            <>
              {/* Nome */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.name}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChangeText={setName}
                  />
                </Input>
              </View>

              {/* Data Nascimento */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.birthDate}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={birthDate}
                    onChangeText={(text) =>
                      setBirthDate(handleBirthDateChange(text))
                    }
                  />
                </Input>
              </View>

              {/* Gênero */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.gender}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Era pra ser um selector"
                    value={gender}
                    onChangeText={setGender}
                  />
                </Input>
              </View>

              {/* Telefone */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.phone}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChangeText={(text) => setPhone(handlePhoneChange(text))}
                  />
                </Input>
              </View>

              {/* Email */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.email}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="exemplo@exemplo.com"
                    value={email}
                    onChangeText={setEmail}
                  />
                </Input>
              </View>
            </>
          )}

          {/* Campos para Empresa */}
          {type === `${Strings.edit.enterprise}` && (
            <>
              {/* Razão Social */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.companyName}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Digite o nome da empresa"
                    value={name}
                    onChangeText={setName}
                  />
                </Input>
              </View>

              {/* Telefone */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.phone}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChangeText={(text) => setPhone(handlePhoneChange(text))}
                  />
                </Input>
              </View>

              {/* E-mail */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.email}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="exemplo@exemplo.com"
                    value={email}
                    onChangeText={setEmail}
                  />
                </Input>
              </View>
            </>
          )}

          {/* Preferências ou Área Profissional */}
          <View className="flex-row self-start w-full pt-8 px-8 gap-2">
            {type === `${Strings.edit.client}` ||
            type === `${Strings.edit.enterprise}` ? (
              <>
                <Bookmark />
                <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.preferences}
                </Text>
              </>
            ) : (
              <>
                <BriefcaseBusiness />
                <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.professionalArea}
                </Text>
              </>
            )}
          </View>

          <MultiSelect
            label="Especialidades"
            options={options}
            width="w-80"
            placeholder="Especialidades"
            onChange={handleChange}
          />

          {/* Intérprete */}
          {type === `${Strings.edit.interpreter}` && (
            <>
              {/* CNPJ */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.cnpj}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="XX.XXX.XXX/0001-XX"
                    value={cnpj}
                    onChangeText={(text) => setCnpj(handleCnpjChange(text))}
                  />
                </Input>
              </View>

              {/* Descrição */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.description}
                </Text>
                <TextInput
                  className="w-80 border rounded border-primary-0 focus:border-primary-950 p-2"
                  multiline
                  numberOfLines={4}
                  placeholder=""
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Modalidade */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.modality}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Placeholder para os checkboxes"
                    value={''}
                    onChangeText={() => {}}
                  />
                </Input>
              </View>

              {/* Localização */}
              <View>
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.location}
                </Text>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Placeholder para os selectors"
                    value={location}
                    onChangeText={setLocation}
                  />
                </Input>
              </View>

              {/* Direito de Imagem */}
              <View className="w-80">
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.imageRight}
                </Text>
                <RadioGroup
                  value={imageRight}
                  onChange={setImageRight}
                  className="flex-row items-center justify-around"
                >
                  <Radio value="authorize">
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>
                      <Text className="font-ifood-regular">
                        {Strings.edit.authorize}
                      </Text>
                    </RadioLabel>
                  </Radio>
                  <Radio value="deny">
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel>
                      <Text className="font-ifood-regular">
                        {Strings.edit.deny}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </RadioGroup>
              </View>

              {/* Valores Max/Min */}
              <View className="w-80">
                <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.edit.valueRange}
                </Text>
                <View className="flex-row justify-between">
                  <View>
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.min}
                    </Text>
                    <Input size="lg" className="w-36">
                      <InputField
                        type="text"
                        placeholder="100"
                        value={minPrice}
                        onChangeText={setMinPrice}
                      />
                    </Input>
                  </View>
                  <View>
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.max}
                    </Text>
                    <Input size="lg" className="w-36">
                      <InputField
                        type="text"
                        placeholder="1000"
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                      />
                    </Input>
                  </View>
                </View>
              </View>

              {/* Horários */}
              <View className="w-80 mt-4">
                <Text className="font-ifood-large text-text-light dark:text-text-dark">
                  {Strings.edit.workingHours}
                </Text>
                {(Object.keys(weekHours) as Day[]).map((day) => (
                  <View key={day} className="mb-4">
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit[day]}
                    </Text>

                    <View className="flex-row w-80 justify-between">
                      <View>
                        <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.edit.from}
                        </Text>
                        <Input size="lg" className="w-36">
                          <InputField
                            type="text"
                            placeholder="hh:mm"
                            value={weekHours[day][0]}
                            onChangeText={(text) =>
                              setWeekHours((prev) => ({
                                ...prev,
                                [day]: [text, prev[day][1]],
                              }))
                            }
                          />
                        </Input>
                      </View>

                      <View>
                        <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.edit.to}
                        </Text>
                        <Input size="lg" className="w-36">
                          <InputField
                            type="text"
                            placeholder="hh:mm"
                            value={weekHours[day][1]}
                            onChangeText={(text) =>
                              setWeekHours((prev) => ({
                                ...prev,
                                [day]: [prev[day][0], text],
                              }))
                            }
                          />
                        </Input>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Botões */}
          <View className="flex-col gap-4 self-center mb-8">
            <TouchableOpacity className="w-96 py-2 rounded justify-center gap-2 flex-row text-primary-500 bg-primary-500">
              <Check color={'white'} />
              <Text className="font-ifood-medium text-typography-white">
                {Strings.edit.save}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-96 py-2 rounded flex-row justify-center gap-2 text-primary-500 bg-background-light"
              onPress={handleBack}
            >
              <X color={colors.primaryOrange} />
              <Text className="font-ifood-medium text-primary-500 ">
                {Strings.edit.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
