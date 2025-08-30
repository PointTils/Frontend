import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Animated,
    Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


interface MultiSelectProps {
    label: string,
    options: string[],
    placeholder: string,
    width?: string,
    onChange: (selected: string[]) => {}
}

/**
  Componente cria um seletor que possibilita a escolha de
  múltiplos elementos

  @param label Texto título do componente
  @param options Uma lista com opções para escolha
  @param placeholder Placeholder para informações do componente
  @param onChange Função que o componente pai envia para a seleção de elementos
  @param width Largura do selector, assume valor padrão: w-full
  @example <MultiSelect
               label="Especialidades"
               options={options}
               width='w-80'
               placeholder="Selecione uma ou mais opções"
               onChange={handleChange}
           />
 */
export default function MultiSelect({ label, options, placeholder, width, onChange }: MultiSelectProps) {
    const [selected, setSelected] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const fieldRef = useRef<View>(null);
    const slideAnim = useRef(new Animated.Value(0)).current;



    // Função para fazer a adição / remoção de um item da lista de selecionados.
    const toggleSelection = (item: string) => {
        const updated = new Set(selected);

        if (updated.has(item)){
            updated.delete(item);
        } else {
            updated.add(item);
        }
        setSelected(Array.from(updated));
        onChange?.(Array.from(updated));
    };

    // Função para renderizar as opções da lista
    const renderOption = ({ item }: { item: string }) => {
        const isSelected = selected.includes(item);
        return (
            <TouchableOpacity className='px-3 py-2' onPress={() => toggleSelection(item)}>
                <Text className={`font-ifood-regular ${isSelected ? 'font-bold text-success-950 bg-primary-blue-light dark:bg-primary-blue-dark rounded' : ''}`}>
                    {item}
                </Text>
            </TouchableOpacity>
        );
    };

    // Ancorar o Modal do dropdown no bottom do campo
    const openDropdown = () => {
        fieldRef.current?.measureInWindow?.((x, y, width, height) => {
            setAnchor({ x, y, width, height });
            setOpen(true);
        });
    };

    const handleOutsidePress = () => setOpen(false);

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: open ? 1 : 0,
            duration: 180,
            useNativeDriver: true,
        }).start();
    }, [open]);

    const slideStyle = {
        transform: [
            {
                translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                }),
            },
        ],
        opacity: slideAnim,
    };

    /*
        Renderer para a lista de opções.
        Quando não houver nada selecionado mostra o placeholder;
        Quando houver apenas um selecionado mostra como uma label;
        Quando houver mais de um selecionado mostra um contador.
    */
    const renderSelectedTags = () => {
        if (selected.length === 0) {
            return <Text className='font-ifood-regular w-fit flex-nowrap text-typography-400'>{placeholder}</Text>;
        } else if (selected.length === 1) {
            return (
                <View className='flex-row flex-wrap'>
                    <View className='bg-background-100 px-2 rounded-full mr-2'>
                        <Text className='font-ifood-regular text-sm'>{selected[0]}</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View className='flex-row flex-wrap'>
                    <View className='bg-background-100 px-2 rounded-full mr-2'>
                        <Text className='font-ifood-regular text-sm'>{selected[0]}</Text>
                    </View>
                    <View className='bg-primary-blue-light dark:bg-primary-blue-dark px-2 rounded-full mr-2'>
                        <Text className='font-ifood-regular text-typography-white  text-sm'>+{selected.length - 1}</Text>
                    </View>
                </View>
            );
        }
    };

    return (
        <View className={`relative ${ width || 'w-full'}`}>
            <Text className='font-ifood-regular font-bold text-lg mb-2'>{label}</Text>

            <TouchableOpacity
                ref={fieldRef}
                className='border border-outline-300 rounded-lg p-3 justify-center bg-background-0 flex-row items-center'
                onPress={open ? () => setOpen(false) : openDropdown}
                activeOpacity={0.8}
            >
                <View className='flex-1'>{renderSelectedTags()}</View>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color='#333'
                />
            </TouchableOpacity>

            <Modal visible={open} transparent animationType='fade' onRequestClose={handleOutsidePress}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleOutsidePress}
                    className='absolute inset-0 bg-transparent'
                />

                {anchor && (
                    <Animated.View
                        className='bg-white border border-outline-300 rounded-lg max-h-40 shadow-hard-2'
                        style={[
                            {
                                position: 'absolute',
                                left: anchor.x,
                                top: anchor.y + anchor.height,
                                width: anchor.width,
                                zIndex: 9999,
                            },
                            slideStyle,
                        ]}
                    >
                        <FlatList
                            data={options}
                            keyExtractor={(item) => String(item)}
                            renderItem={renderOption}
                            keyboardShouldPersistTaps='handled'
                        />
                    </Animated.View>
                )}
            </Modal>
        </View>
    );
}
