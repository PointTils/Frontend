import Header from '@/src/components/Header';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Input, InputField, InputIcon } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { router, useLocalSearchParams } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, RotateCcw } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TouchableOpacity, View as RNView } from 'react-native';
import { Toast } from 'toastify-react-native';


type Step = 1 | 2 | 3;

export default function ResetPasswordScreen() {
  const colors = useColors();

  // Query params: suporta deep link /reset-password?token=...&email=...
  const { token: tokenFromUrl, email: emailFromUrl } = useLocalSearchParams<{
    token?: string;
    email?: string;
  }>();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState<string>(emailFromUrl ?? '');
  const [resetToken, setResetToken] = useState<string>(tokenFromUrl ?? '');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // POST /v1/email/password-reset/{email}
  const { post: sendResetEmail, loading: sendingEmail } = useApiPost(
    `/v1/email/password-reset/${encodeURIComponent(email || '')}`,
  );

  // POST /v1/auth/recover-password { resetToken, newPassword }
  const { post: recoverPassword, loading: recovering } = useApiPost('/v1/auth/recover-password');

  const isLoading = sendingEmail || recovering;

  // Deep link: se vier token, pula pra etapa 3
  useEffect(() => {
    if (tokenFromUrl && typeof tokenFromUrl === 'string' && tokenFromUrl.length > 0) {
      setResetToken(tokenFromUrl as string);
      setStep(3);
    }
  }, [tokenFromUrl]);

  // Cooldown de 60s pro reenvio
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleBack = () => {
    router.replace('/login' as any);
  };

  // ---------- Ações ----------
  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: Strings?.auth?.reset?.invalidEmailTitle ?? 'E-mail inválido',
        text2: Strings?.auth?.reset?.invalidEmailDesc ?? 'Informe um e-mail válido para continuar.',
        position: 'top',
      });
      return;
    }

    try {
      await sendResetEmail(undefined as any); // sem body
      Toast.show({
        type: 'success',
        text1: Strings?.auth?.reset?.emailSentTitle ?? 'Código enviado',
        text2: Strings?.auth?.reset?.emailSentDesc ?? 'Confira sua caixa de entrada.',
        position: 'top',
        visibilityTime: 2000,
      });
      setStep(2);
      setResendCooldown(60); // cooldown de 60s
    } catch {
      Toast.show({
        type: 'error',
        text1: Strings?.auth?.reset?.emailFailedTitle ?? 'Não foi possível enviar',
        text2: Strings?.auth?.reset?.emailFailedDesc ?? 'Tente novamente em instantes.',
        position: 'top',
      });
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    try {
      await sendResetEmail(undefined as any);
      Toast.show({
        type: 'success',
        text1: Strings?.auth?.reset?.resendTitle ?? 'Código reenviado',
        text2: Strings?.auth?.reset?.resendDesc ?? 'Verifique seu e-mail novamente.',
        position: 'top',
        visibilityTime: 1500,
      });
      setResendCooldown(60);
    } catch {
      Toast.show({
        type: 'error',
        text1: Strings?.auth?.reset?.resendFailedTitle ?? 'Falha ao reenviar',
        text2: Strings?.auth?.reset?.resendFailedDesc ?? 'Aguarde um pouco e tente novamente.',
        position: 'top',
      });
    }
  };

  const handleGoToStep3 = () => {
    if (!resetToken || resetToken.length === 0) {
      Toast.show({
        type: 'error',
        text1: Strings?.auth?.reset?.tokenMissingTitle ?? 'Informe o código',
        text2: Strings?.auth?.reset?.tokenMissingDesc ?? 'Digite o código recebido no e-mail.',
        position: 'top',
      });
      return;
    }
    setStep(3);
  };

  const handleRecover = async () => {
    if (!resetToken) {
      Toast.show({
        type: 'error',
        text1: Strings?.auth?.reset?.tokenMissingTitle ?? 'Informe o código',
        text2: Strings?.auth?.reset?.tokenMissingDesc ?? 'Digite o código recebido no e-mail.',
        position: 'top',
      });
      return;
    }
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: Strings?.auth?.reset?.pwdMissingTitle ?? 'Campos obrigatórios',
        text2: Strings?.auth?.reset?.pwdMissingDesc ?? 'Preencha e confirme sua nova senha.',
        position: 'top',
      });
      return;
    }
    // JOÃO — validação de tamanho mínimo da nova senha
    if (newPassword.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Senha muito curta',
        text2: 'A senha deve ter pelo menos 8 caracteres.',
        position: 'top',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: Strings?.auth?.reset?.pwdMismatchTitle ?? 'Senhas não conferem',
        text2: Strings?.auth?.reset?.pwdMismatchDesc ?? 'As duas senhas devem ser iguais.',
        position: 'top',
      });
      return;
    }

    try {
      const body = { resetToken, newPassword };
      const resp = await recoverPassword(body as any);

      const success = (resp as any)?.success ?? true;
      if (!success) throw new Error((resp as any)?.message || 'recover-failed');

      Toast.show({
        type: 'success',
        text1: Strings?.auth?.reset?.successTitle ?? 'Senha atualizada',
        text2: Strings?.auth?.reset?.successDesc ?? 'Faça login com sua nova senha.',
        position: 'top',
        visibilityTime: 1800,
      });

      setNewPassword('');
      setConfirmPassword('');
      setResetToken('');
      setEmail('');
      router.replace('/login' as any);
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: Strings?.auth?.reset?.failedTitle ?? 'Não foi possível redefinir',
        text2:
          (e?.message && typeof e.message === 'string')
            ? e.message
            : (Strings?.auth?.reset?.failedDesc ?? 'Verifique o código e tente novamente.'),
        position: 'top',
      });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // ---------- Renders de cada etapa ----------
  const Title = useMemo(() => (Strings?.auth?.reset?.title ?? 'REDEFINIR SENHA'), []);

  function StepIndicator({ n }: { n: Step }) {
    return (
      <Text className="text-typography-500 font-ifood-regular mb-2">
        {(Strings?.auth?.reset?.step ?? 'Etapa')} {n} {(Strings?.auth?.reset?.of ?? 'de')} 3
      </Text>
    );
  }

  if (isLoading) {
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

      {/* padding superior para alinhar como no teu padrão */}
      <View className="w-full h-6" />

      <ScrollView
        className="w-full"
        contentContainerClassName="grow px-6 pb-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1 — EMAIL */}
        {step === 1 && (
          <View className="w-full">
            <StepIndicator n={1} />
            <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-1">
              {Strings?.auth?.reset?.forgotTitle ?? 'Esqueceu sua senha?'}
            </Text>
            <Text className="font-ifood-regular text-typography-600 mb-6">
              {Strings?.auth?.reset?.forgotDesc ??
                'Não se preocupe! Informe abaixo seu e-mail cadastrado para enviarmos o código de autenticação.'}
            </Text>

            <Text className="font-ifood-medium mb-2">
              {Strings.common.fields.email}
            </Text>

            {/* Input de e-mail (gluestack-style) */}
            <Input className="mb-2">
              <InputIcon as={Mail} />
              <InputField
                value={email}
                onChangeText={(v: string) => setEmail(v)}
                placeholder="example@empresa.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>

            <View className="mt-10 gap-3">
              <Button
                size="md"
                onPress={handleSendCode}
                disabled={!email || sendingEmail}
                className="data-[active=true]:bg-primary-orange-press-light"
              >
                <ButtonIcon as={Mail} className="text-white" />
                <Text className="font-ifood-regular text-text-dark">
                  {Strings?.auth?.reset?.sendCodeCta ?? 'Enviar código'}
                </Text>
              </Button>

              <Pressable onPress={handleBack} className="items-center">
                <Text className="text-primary-orange-light dark:text-primary-orange-dark">
                  {Strings.common.buttons.cancel}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* STEP 2 — TOKEN */}
        {step === 2 && (
          <View className="w-full">
            <StepIndicator n={2} />
            <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-1">
              {Strings?.auth?.reset?.authTitle ?? 'Autenticação'}
            </Text>
            <Text className="font-ifood-regular text-typography-600 mb-6">
              {Strings?.auth?.reset?.authDesc ??
                'Quase lá! Verifique sua caixa de entrada e informe o código enviado.'}
            </Text>

            <Text className="font-ifood-medium mb-2">
              {Strings?.auth?.reset?.codeLabel ?? 'Código'}
            </Text>

            {/* Input de token */}
            <Input className="mb-1">
              <InputField
                value={resetToken}
                onChangeText={(v: string) => setResetToken(v.trim())}
                placeholder={Strings?.auth?.reset?.codePlaceholder ?? 'Digite o código recebido'}
                keyboardType="default" // mude para "numeric" se o token for numérico
                autoCapitalize="none"
              />
            </Input>

            <Text className="text-typography-500 mt-1 mb-4">
              {Strings?.auth?.reset?.codeHint ?? 'Apenas números são permitidos (se aplicável).'}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleResend}
              disabled={resendCooldown > 0 || !email}
              className="mb-8"
            >
              <RNView className="flex-row items-center gap-2">
                <RotateCcw
                  size={18}
                  color={resendCooldown > 0 ? colors.disabled : colors.primaryBlue}
                />
                <Text
                  className={`font-ifood-regular ${resendCooldown > 0 ? 'text-typography-400' : 'text-primary-blue-light'}`}
                >
                  {resendCooldown > 0
                    ? (Strings?.auth?.reset?.resendIn ?? 'Reenviar em') + ` ${resendCooldown}s`
                    : (Strings?.auth?.reset?.resend ?? 'Reenviar código')}
                </Text>
              </RNView>
            </TouchableOpacity>

            <View className="mt-2 gap-3">
              <Button
                size="md"
                onPress={handleGoToStep3}
                disabled={!resetToken}
                className="data-[active=true]:bg-primary-orange-press-light"
              >
                <ButtonIcon as={Lock} className="text-white" />
                <Text className="font-ifood-regular text-text-dark">
                  {Strings?.auth?.reset?.verifyCta ?? 'Verificar'}
                </Text>
              </Button>

              <Pressable onPress={handleBack} className="items-center">
                <Text className="text-primary-orange-light dark:text-primary-orange-dark">
                  {Strings.common.buttons.cancel}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* STEP 3 — NOVA SENHA */}
        {step === 3 && (
          <View className="w-full">
            <StepIndicator n={3} />
            <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-1">
              {Strings?.auth?.reset?.redefineTitle ?? 'Redefinir'}
            </Text>
            <Text className="font-ifood-regular text-typography-600 mb-6">
              {Strings?.auth?.reset?.redefineDesc ?? 'Defina sua nova senha.'}
            </Text>

            {/* Token (pode ficar oculto se veio via deep link) */}
            {!tokenFromUrl && (
              <>
                <Text className="font-ifood-medium mb-2">
                  {Strings?.auth?.reset?.codeLabel ?? 'Código'}
                </Text>
                <Input className="mb-4">
                  <InputField
                    value={resetToken}
                    onChangeText={(v: string) => setResetToken(v.trim())}
                    placeholder={Strings?.auth?.reset?.codePlaceholder ?? 'Digite o código recebido'}
                    autoCapitalize="none"
                  />
                </Input>
              </>
            )}

            <Text className="font-ifood-medium mb-2">
              {Strings?.auth?.reset?.newPwdLabel ?? 'Nova senha'}
            </Text>
            <Input className="mb-2">
              <InputField
                value={newPassword}
                onChangeText={(v: string) => setNewPassword(v)}
                placeholder={Strings?.auth?.reset?.newPwdPlaceholder ?? 'Digite a nova senha'}
                secureTextEntry={!showPwd1}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPwd1((s) => !s)} className="absolute right-3 top-3">
                {showPwd1 ? <EyeOff size={18} color={colors.text} /> : <Eye size={18} color={colors.text} />}
              </Pressable>
            </Input>

            <Text className="font-ifood-medium mt-4 mb-2">
              {Strings?.auth?.reset?.confirmPwdLabel ?? 'Confirmar senha'}
            </Text>
            <Input>
              <InputField
                value={confirmPassword}
                onChangeText={(v: string) => setConfirmPassword(v)}
                placeholder={Strings?.auth?.reset?.confirmPwdPlaceholder ?? 'Repita a nova senha'}
                secureTextEntry={!showPwd2}
                autoCapitalize="none"
              />
              <Pressable onPress={() => setShowPwd2((s) => !s)} className="absolute right-3 top-3">
                {showPwd2 ? <EyeOff size={18} color={colors.text} /> : <Eye size={18} color={colors.text} />}
              </Pressable>
            </Input>

            <View className="mt-10 gap-3">
              <Button
                size="md"
                onPress={handleRecover}
                disabled={!resetToken || !newPassword || !confirmPassword || recovering}
                className="data-[active=true]:bg-primary-orange-press-light"
              >
                <ButtonIcon as={Lock} className="text-white" />
                <Text className="font-ifood-regular text-text-dark">
                  {Strings?.auth?.reset?.saveCta ?? 'Salvar'}
                </Text>
              </Button>

              <Pressable onPress={handleBack} className="items-center">
                <Text className="text-primary-orange-light dark:text-primary-orange-dark">
                  {Strings.common.buttons.cancel}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}
