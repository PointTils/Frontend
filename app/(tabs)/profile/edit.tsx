import React, { useState } from 'react';
import { Strings } from '@/src/constants/Strings'
import {
    ScrollView,
    View
} from 'react-native';
import MultiSelect from '@/src/components/MultiSelect';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
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
import {
    Textarea,
    TextareaInput
} from '@/src/components/ui/textarea';

import { FileText, Bookmark, BriefcaseBusiness, Check, X } from 'lucide-react-native';
import { Button } from '@/src/components/ui/button';

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type TimeRange = [string, string];

export default function EditScreen() {
    const [name, setName] = useState('Jefinho');
    const [birthDate, setBirthDate] = useState('30/09/1996');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('(51) 99876-4422');
    const [email, setEmail] = useState('exemplo@exemplo.com');
    const [cnpj, setCnpj] = useState('XX.XXX.XXX/0001-XX');
    const [description, setDescription] = useState('Descreva o seu trabalho, como tipos de serviços prestados e experiências.');
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

    const type = "Intérprete";
    // const type = "Solicitante";
    // const type = "Empresa";

    const options: any[] = ["Type 1", "Type 2", "Type 3", "Type 4", "Type 5"]

    const handleChange = (options: any[]) => {
        console.log(options)
    }

    return (
        <ScrollView>
            <View className='flex-col items-center gap-4 py-24'>

                <View className='flex-row self-start px-8 items-center gap-2'>
                    <FileText />
                    <Text className='text-lg font-ifood-medium text-text-light dark:text-text-dark'>{Strings.edit.data}</Text>
                </View>
                {(type === `${Strings.edit.client}` || type === `${Strings.edit.interpreter}`) && (

                    <FormControl
                        size="lg"
                        className='gap-2'
                    >
                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.name}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="w-80">
                            <InputField type="text" placeholder="Digite seu nome" value={name} onChangeText={setName} />
                        </Input>

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.birthDate}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="w-80">
                            <InputField type="text" placeholder="dd/mm/yyyy" value={birthDate} onChangeText={setPhone} />
                        </Input>

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.phone}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="w-80">
                            <InputField type="text" placeholder="(00) 00000-0000" value={phone} onChangeText={setPhone} />
                        </Input>

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.email}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="w-80">
                            <InputField type="text" placeholder="exemplo@exemplo.com" value={email} onChangeText={setEmail} />
                        </Input>

                        <FormControlHelper>
                            <FormControlHelperText />
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon />
                            <FormControlErrorText />
                        </FormControlError>
                    </FormControl>
                )}

                {type === `${Strings.edit.enterprise}` && (
                    <FormControl
                        size="lg"
                        className='gap-2'
                    >
                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.companyName}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="w-80">
                            <InputField type="text" placeholder="Digite o nome da empresa" value={name} onChangeText={setName} />
                        </Input>

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.phone}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="w-80">
                            <InputField type="text" placeholder="(00) 00000-0000" value={phone} onChangeText={setPhone} />
                        </Input>

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.email}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="w-80">
                            <InputField type="text" placeholder="exemplo@exemplo.com" value={email} onChangeText={setEmail} />
                        </Input>

                        <FormControlHelper>
                            <FormControlHelperText />
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon />
                            <FormControlErrorText />
                        </FormControlError>
                    </FormControl>
                )}

                {(type === `${Strings.edit.client}` || type === `${Strings.edit.enterprise}`) ? (
                    < View className='flex-row self-start px-8 items-center gap-2'>
                        <Bookmark />
                        <Text className='text-lg font-ifood-medium text-text-light dark:text-text-dark'>{Strings.edit.preferences}</Text>
                    </View>
                )

                    : < View className='flex-row self-start px-8 items-center gap-2'>
                        <BriefcaseBusiness />
                        <Text className='text-lg font-ifood-medium text-text-light dark:text-text-dark'>{Strings.edit.professionalArea}</Text>
                    </View>

                }
                <MultiSelect
                    label="Especialidades"
                    options={options}
                    width='w-80'
                    placeholder="Especialidades"
                    onChange={handleChange}
                />

                {type === `${Strings.edit.interpreter}` && (
                    <FormControl
                        size="lg"
                        className='gap-2'
                    >
                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.cnpj}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="w-80">
                            <InputField type="text" placeholder="XX.XXX.XXX/0001-XX" value={cnpj} onChangeText={setCnpj} />
                        </Input>

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.description}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <Textarea size="lg" className="w-80">
                            <TextareaInput className='' type="text" placeholder="" value={description} onChangeText={setDescription} />
                        </Textarea>

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.modality}
                            </FormControlLabelText>
                        </FormControlLabel>
                        {/* Faltam os checkboxes para as modalidades */}

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.location}
                            </FormControlLabelText>
                        </FormControlLabel>
                        {/* Faltam os selectors para a location */}

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.image}
                            </FormControlLabelText>
                        </FormControlLabel>
                        {/* Faltam os radios para o direito de imagem */}

                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.valueRange}
                            </FormControlLabelText>
                        </FormControlLabel>
                        <View className='flex-row justify-between'>
                            <View>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                        {Strings.edit.min}
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="w-36">
                                    <InputField type="text" placeholder="100" value={minPrice} onChangeText={setMinPrice} />
                                </Input>
                            </View>
                            <View>
                                <FormControlLabel>
                                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                        {Strings.edit.max}
                                    </FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="w-36">
                                    <InputField type="text" placeholder="100" value={maxPrice} onChangeText={setMaxPrice} />
                                </Input>
                            </View>
                        </View>

                        {/* Horários de Trabalho */}
                        <FormControlLabel>
                            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                {Strings.edit.workingHours}
                            </FormControlLabelText>
                        </FormControlLabel>

                        {(Object.keys(weekHours) as Day[]).map((day) => (
                            <View key={day} className="mb-4">
                                <FormControlLabel>
                                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                                        {Strings.edit[day]}
                                    </FormControlLabelText>
                                </FormControlLabel>

                                <View className="flex-row justify-between gap-2">
                                    {/* From */}
                                    <View className="flex-1">
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
                                                    setWeekHours((prev) => ({ ...prev, [day]: [text, prev[day][1]] }))
                                                }
                                            />
                                        </Input>
                                    </View>

                                    {/* To */}
                                    <View className="flex-1">
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
                                                    setWeekHours((prev) => ({ ...prev, [day]: [prev[day][0], text] }))
                                                }
                                            />
                                        </Input>
                                    </View>
                                </View>
                            </View>
                        ))}

                        <FormControlHelper>
                            <FormControlHelperText />
                        </FormControlHelper>
                        <FormControlError>
                            <FormControlErrorIcon />
                            <FormControlErrorText />
                        </FormControlError>
                    </FormControl>
                )}


                <Button className='w-96'>
                    <Check className=''/>
                    <Text>
                        {Strings.edit.save}
                    </Text>
                </Button>
                <Button className='w-96 '>
                    <X className='stroke-typography-white'/>
                    <Text>
                        {Strings.edit.cancel}
                    </Text>
                </Button>
            </View>
        </ScrollView >
    );
}