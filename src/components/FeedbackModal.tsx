import { Text } from '@/src/components/ui/text/index';
import { View } from '@/src/components/ui/view/index';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, TextInput } from 'react-native';

export default function FeedbackModal({
	visible,
	onClose,
	onSubmit,
	interpreterName,
}: {
	visible: boolean;
	onClose: () => void;
	onSubmit: (details: string) => void;
	interpreterName?: string;
}) {
	const colors = useColors();
	const [details, setDetails] = useState('');
	const [rating, setRating] = useState(0);

	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.modalOverlay }}>
				<View
					className="rounded-2xl p-6 w-80"
					style={{ backgroundColor: colors.background }}
				>
					{/* Botão */}
					<TouchableOpacity
						onPress={onClose}
						className="absolute top-4 right-4 z-10"
						hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
					>
						<Text className="text-[22px]" style={{ color: colors.detailsGray }}>×</Text>
					</TouchableOpacity>

					{/* Título */}
					<Text className="font-ifood-bold text-lg mb-4 text-center" style={{ color: colors.text }}>
						Queremos saber sua opinião!
					</Text>

					{/* Clickable rating stars */}
					<View className="mb-4 flex-row items-center justify-center">
						{Array.from({ length: 5 }).map((_, i) => (
							<TouchableOpacity
								key={i}
								onPress={() => setRating(i + 1)}
								activeOpacity={0.7}
							>
								<Text
									className="text-[28px] mx-1"
									style={{ color: i < rating ? colors.primaryBlue : colors.disabled }}
								>
									★
								</Text>
							</TouchableOpacity>
						))}
					</View>

					{/*String texto*/}
					<Text className="font-ifood-regular mb-4 text-center" style={{ color: colors.detailsGray }}>
						Avalie sua experiência no atendimento realizado pelo intérprete{' '}
						<Text className="font-bold" style={{ color: colors.primaryBlue }}>
							{interpreterName || Strings.common.fields.name || 'Fulano'}
						</Text>
					</Text>

					{/* Campo de texto */}
					<TextInput
						className="mb-6 px-4 py-3 rounded border font-ifood-regular"
						style={{
							borderColor: colors.fieldGray,
							backgroundColor: colors.background,
							color: colors.text,
						}}
						placeholder="Escreva mais detalhes"
						placeholderTextColor={colors.detailsGray}
						multiline
						value={details}
						onChangeText={setDetails}
						numberOfLines={3}
						textAlignVertical="top"
					/>

					{/* Botão */}
					<View className="items-end">
						<TouchableOpacity
							onPress={() => onSubmit(details)}
							className="px-6 py-2 rounded bg-primary-blue"
						>
							<Text className="font-ifood-bold text-white">
								Avaliar
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}






