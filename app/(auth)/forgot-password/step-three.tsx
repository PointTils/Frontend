import Header from '@/src/components/Header';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { router, useLocalSearchParams } from 'expo-router';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';

const TOKEN_LENGTH = 6;
const MIN_PASSWORD = 8;

export default function ForgotPasswordStepThree() {
  const colors = useColors();
  const { token: tokenFromUrl } = useLocalSearchParams<{ token?: string }>();

  const [resetToken, setResetToken] = useState<string>(tokenFromUrl ?? '');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const { post: recoverPassword, loading: recovering } = useApiPost(
    ApiRoutes.auth.recoverPassword,
  );

  const Title = useMemo(() => Strings.auth.reset.title, []);
  const handleBack = () => router.replace('/login' as any);

  const handleRecover = async () => {
    const clean = (resetToken || '').trim();

    // token obrigatório e com tamanho correto
    if (clean.length !== TOKEN_LENGTH) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.tokenMissingTitle,
        text2: `${Strings.auth.reset.tokenMissingDesc} (${TOKEN_LENGTH} dígitos)`,
        position: 'top',
      });
      return;
    }

    // senhas obrigatórias
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.pwdMissingTitle,
        text2: Strings.auth.reset.pwdMissingDesc,
        position: 'top',
      });
      return;
    }

    // tamanho mínimo
    if (newPassword.length < MIN_PASSWORD) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.shortPwdTitle,
        text2: Strings.auth.reset.shortPwdDesc.replace(
          '{min}',
          String(MIN_PASSWORD),
        ),
        position: 'top',
      });
      return;
    }

    // senhas iguais
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.pwdMismatchTitle,
        text2: Strings.auth.reset.pwdMismatchDesc,
        position: 'top',
      });
      return;
    }

    try {
      const body = { resetToken: clean, newPassword };
      const resp: any = await recoverPassword(body as any);
      const ok = resp?.success ?? true;
      if (!ok) throw new Error(resp?.message || Strings.auth.reset.failedDesc);

      Toast.show({
        type: 'success',
        text1: Strings.auth.reset.successTitle,
        text2: resp?.message || Strings.auth.reset.successDesc,
        position: 'top',
        visibilityTime: 1800,
      });

      setNewPassword('');
      setConfirmPassword('');
      router.replace('/login' as any);
    } catch (e: any) {
      const msg =
        e?.message && typeof e.message === 'string'
          ? e.message
          : Strings.auth.reset.failedDesc;

      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.failedTitle,
        text2: msg,
        position: 'top',
      });

      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (recovering) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primaryOrange} />
        <Text className="text-typography-600 font-ifood-regular mt-4">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="mt-12 pb-2">
        <Header title={Title} showBackButton handleBack={handleBack} />
      </View>

      <View className="w-full h-6" />

      <ScrollView
        className="w-full"
        contentContainerClassName="grow px-6 pb-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-typography-500 font-ifood-regular mb-2">
          {Strings.auth.reset.step} 3 {Strings.auth.reset.of} 3
        </Text>

        <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-1">
          {Strings.auth.reset.redefineTitle}
        </Text>
        <Text className="font-ifood-regular text-typography-600 mb-6">
          {Strings.auth.reset.redefineDesc}
        </Text>

        {/* Se não vier token pelo link, exibe o campo do código */}
        {!tokenFromUrl && (
          <>
            <Text className="font-ifood-medium mb-2">
              {Strings.auth.reset.codeLabel}
            </Text>
            <Input className="mb-4">
              <InputField
                value={resetToken}
                onChangeText={(v: string) =>
                  setResetToken(v.replace(/[^0-9]/g, '').slice(0, TOKEN_LENGTH))
                }
                placeholder={Strings.auth.reset.codePlaceholder}
                keyboardType="numeric"
                autoCapitalize="none"
              />
            </Input>
          </>
        )}

        <Text className="font-ifood-medium mb-2">
          {Strings.auth.reset.newPwdLabel}
        </Text>
        <Input className="mb-2">
          <InputField
            value={newPassword}
            onChangeText={(v: string) => setNewPassword(v)}
            placeholder={Strings.auth.reset.newPwdPlaceholder}
            secureTextEntry={!showPwd1}
            autoCapitalize="none"
          />
          <Pressable
            onPress={() => setShowPwd1((s) => !s)}
            className="absolute right-3 top-3"
          >
            {showPwd1 ? (
              <EyeOff size={18} color={colors.text} />
            ) : (
              <Eye size={18} color={colors.text} />
            )}
          </Pressable>
        </Input>

        <Text className="font-ifood-medium mt-4 mb-2">
          {Strings.auth.reset.confirmPwdLabel}
        </Text>
        <Input>
          <InputField
            value={confirmPassword}
            onChangeText={(v: string) => setConfirmPassword(v)}
            placeholder={Strings.auth.reset.confirmPwdPlaceholder}
            secureTextEntry={!showPwd2}
            autoCapitalize="none"
          />
          <Pressable
            onPress={() => setShowPwd2((s) => !s)}
            className="absolute right-3 top-3"
          >
            {showPwd2 ? (
              <EyeOff size={18} color={colors.text} />
            ) : (
              <Eye size={18} color={colors.text} />
            )}
          </Pressable>
        </Input>

        <View className="mt-10 gap-3">
          <Button
            size="md"
            onPress={handleRecover}
            disabled={
              (!tokenFromUrl && resetToken.trim().length !== TOKEN_LENGTH) ||
              !newPassword ||
              !confirmPassword ||
              recovering
            }
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <ButtonIcon as={Lock} className="text-white" />
            <Text className="font-ifood-regular text-text-dark">
              {Strings.auth.reset.saveCta}
            </Text>
          </Button>

          <Pressable onPress={handleBack} className="items-center">
            <Text className="text-primary-orange-light dark:text-primary-orange-dark">
              {Strings.common.buttons.cancel}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
