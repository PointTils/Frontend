import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Strings } from '@/src/constants/Strings';
import { Colors } from '@/src/constants/Colors';
import MultiSelect from '@/src/components/MultiSelect';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { Textarea, TextareaInput } from '@/src/components/ui/textarea';
import {
  FileText,
  Bookmark,
  BriefcaseBusiness,
  Check,
  X,
  ChevronLeft,
} from 'lucide-react-native';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/src/components/ui/form-control';
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
  // Estados para os campos de edição
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
  const [imageRight, setImageRight] = useState('Autoriza');
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

  const type = 'Intérprete';
  // const type = "Solicitante";
  // const type = "Empresa";

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
    <ScrollView>
      {/* Header */}
      <View className="flex-row justify-center py-12 w-full">
        <TouchableOpacity
          className="absolute top-12 left-2"
          onPress={handleBack}
        >
          <ChevronLeft color={Colors.light.primaryOrange} />
        </TouchableOpacity>

        <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
          {Strings.edit.title}
        </Text>
      </View>

      <View className="flex-col items-center gap-4 w-full">
        <View className="w-full flex-row self-start items-center px-8 gap-2 ">
          <FileText />
          <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
            {Strings.edit.data}
          </Text>
        </View>

        {/* Formulário de edição */}
        <FormControl size="lg" className="gap-2 w-full items-center">
          {/* Campos em comum para um usuário do tipo Solicitante ou Intérprete */}
          {(type === `${Strings.edit.client}` ||
            type === `${Strings.edit.interpreter}`) && (
            <>
              {/* Campo para Nome */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.name}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChangeText={setName}
                  />
                </Input>
              </View>

              {/* Campo para Data de Nascimento */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.birthDate}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="dd/mm/yyyy"
                    value={birthDate}
                    onChangeText={setBirthDate}
                  />
                </Input>
              </View>

              {/* Selector para Gênero */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.gender}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Era pra ser um selector"
                    value={gender}
                    onChangeText={setGender}
                  />
                </Input>
              </View>

              {/* Campo para telefone */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.phone}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </Input>
              </View>

              {/* Campo para E-mail */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.email}
                  </FormControlLabelText>
                </FormControlLabel>
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

          {/* Campos para usuário do tipo Empresa */}
          {type === `${Strings.edit.enterprise}` && (
            <>
              {/* Campo para Razão Social */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.companyName}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Digite o nome da empresa"
                    value={name}
                    onChangeText={setName}
                  />
                </Input>
              </View>

              {/* Campo para Telefone */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.phone}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </Input>
              </View>

              {/* Campo para E-mail */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.email}
                  </FormControlLabelText>
                </FormControlLabel>
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

          {/* Seção Preferências ou Área do Profissional */}
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

          {/* Campos para um usuário do tipo Intérprete */}
          {type === `${Strings.edit.interpreter}` && (
            <>
              {/* Campo para CNPJ */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.cnpj}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="XX.XXX.XXX/0001-XX"
                    value={cnpj}
                    onChangeText={setCnpj}
                  />
                </Input>
              </View>

              {/* Campo para Descrição */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.description}
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea size="lg" className="w-80">
                  <TextareaInput
                    className=""
                    type="text"
                    placeholder=""
                    value={description}
                    onChangeText={setDescription}
                  />
                </Textarea>
              </View>

              {/* Checkboxes para Modalidade */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.modality}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Placeholder para os checkboxes"
                    value={''}
                    onChangeText={() => {}}
                  />
                </Input>
                {/* Faltam os checkboxes para as modalidades */}
              </View>

              {/* Selectors de Location (UF, Cidade e Bairro) */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.location}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Placeholder para os selectors"
                    value={''}
                    onChangeText={setLocation}
                  />
                </Input>
                {/* Faltam os selectors para a location */}
              </View>

              {/* Radios para Direito de Imagem */}
              <View>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.image}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input size="lg" className="w-80">
                  <InputField
                    type="text"
                    placeholder="Placeholder para os radios"
                    value={''}
                    onChangeText={setImageRight}
                  />
                </Input>
                {/* Faltam os radios para o direito de imagem */}
              </View>

              {/* Campos para Valor Mínimo/Máximo */}
              <View className="w-80">
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.edit.valueRange}
                  </FormControlLabelText>
                </FormControlLabel>
                <View className="flex-row justify-between">
                  <View>
                    {/* Valor Mínimo */}
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.edit.min}
                      </FormControlLabelText>
                    </FormControlLabel>
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
                    {/* Valor Máximo */}
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.edit.max}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input size="lg" className="w-36">
                      <InputField
                        type="text"
                        placeholder="100"
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                      />
                    </Input>
                  </View>
                </View>
              </View>

              {/* Horários de Trabalho */}
              <View className="w-80 mt-4">
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-large text-text-light dark:text-text-dark">
                    {Strings.edit.workingHours}
                  </FormControlLabelText>
                </FormControlLabel>

                {/* Campos de horário de Segunda à Domingo */}
                {(Object.keys(weekHours) as Day[]).map((day) => (
                  <View key={day} className="mb-4">
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.edit[day]}
                      </FormControlLabelText>
                    </FormControlLabel>

                    <View className="flex-row w-80 justify-between">
                      {/* Horário Início */}
                      <View>
                        <View>
                          <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                              {Strings.edit.from}
                            </FormControlLabelText>
                          </FormControlLabel>
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
                      </View>

                      {/* Horário Fim */}
                      <View>
                        <View>
                          <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                              {Strings.edit.to}
                            </FormControlLabelText>
                          </FormControlLabel>
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
                  </View>
                ))}
              </View>
            </>
          )}

          <FormControlHelper>
            <FormControlHelperText />
          </FormControlHelper>
          <FormControlError>
            <FormControlErrorIcon />
            <FormControlErrorText />
          </FormControlError>
        </FormControl>

        <View className="flex-col gap-4 self-center">
          <TouchableOpacity className="w-96 py-2 rounded justify-center gap-2 flex-row text-primary-500 bg-primary-500 ">
            <Check color={'white'} />
            <Text className="font-ifood-medium text-typography-white">
              {Strings.edit.save}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-96 py-2 rounded flex-row justify-center gap-2 text-primary-500 bg-background-light"
            onPress={handleBack}
          >
            <X color={Colors.light.primaryOrange} />
            <Text className="font-ifood-medium text-primary-500 ">
              {Strings.edit.cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
