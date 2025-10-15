import { Button } from '@/src/components/ui/button';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet, useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import type { AppointmentResponse } from '@/src/types/api/appointment';
import type { InterpreterResponseData } from '@/src/types/api/user';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AtSign,
  Calendar as CalendarIcon,
  ChevronLeft,
  FileText,
  MapPin,
  Phone,
  User as UserIcon,
} from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Toast } from 'toastify-react-native';

const { height } = Dimensions.get('window');

type TabKey = 'agendamento' | 'solicitante';

// Tipagem para auxiliar na função de formatação de endereço
type Endereco = {
  uf?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  street?: string | null;
  streetNumber?: number | null;
  addressDetails?: string | null;
};

/**
 * Função utilitária para formatar endereço
 */
function formatEndereco(endereco?: Endereco) {
  if (!endereco) return '';

  const { street, streetNumber, neighborhood, city, uf, addressDetails } =
    endereco;

  return [
    street && `${street}${streetNumber ? `, ${streetNumber}` : ''}`,
    neighborhood,
    city && uf ? `${city}/${uf}` : city || uf,
    addressDetails,
  ]
    .filter(Boolean)
    .join(' - ');
}

/**
 * Formata data/hora a partir de partes (robusto a snake/camel e fuso)
 */
function formatRangeByParts(
  dateStr?: string,
  startStr?: string,
  endStr?: string,
) {
  if (!dateStr || !startStr || !endStr) return '';

  // Suporta YYYY-MM-DD e DD/MM/YYYY
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/;
  const brDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  let y: number, m: number, d: number;

  if (isoDate.test(dateStr)) {
    const [, yy, mm, dd] = dateStr.match(isoDate)!;
    y = +yy;
    m = +mm - 1;
    d = +dd;
  } else if (brDate.test(dateStr)) {
    const [, dd, mm, yy] = dateStr.match(brDate)!;
    y = +yy;
    m = +mm - 1;
    d = +dd;
  } else {
    // fallback legível para debug
    return `${dateStr} ${startStr} – ${endStr}`;
  }

  // Aceita HH:mm ou HH:mm:ss
  const toHMS = (t: string) => {
    const [H = '0', M = '0', S = '0'] = t.split(':');
    return { H: +H, M: +M, S: +S };
  };

  const s = toHMS(startStr);
  const e = toHMS(endStr);

  // Monta em horário LOCAL (troque por Date.UTC se o back enviar UTC rígido)
  const ini = new Date(y, m, d, s.H, s.M, s.S);
  const fim = new Date(y, m, d, e.H, e.M, e.S);

  const dia = ini.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const hi = ini.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const hf = fim.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dia} ${hi} – ${hf}`;
}

export default function DetalhesAgendamento() {
  const colors = useColors();
  const SAFE_TOP = height * 0.12;
  const SAFE_BOTTOM = height * 0.15;

  const [tab, setTab] = React.useState<TabKey>('agendamento');

  // Removido 'user' para resolver warning de variável não utilizada
  const { user: _user } = useAuth();

  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      Toast.show({
        type: 'error',
        text1: Strings.detalhesAgendamento.toast.errorNoIdTitle,
        text2: Strings.detalhesAgendamento.toast.errorNoIdDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
      });
      router.back();
    }
  }, [id]);

  // Fetch appointment data
  const {
    data: appointmentData,
    loading: loadingAppointment,
    error: errorAppointment,
  } = useApiGet<AppointmentResponse>(ApiRoutes.appointments.detail(id || ''));

  // Fetch interpreter data (solicitante)
  const {
    data: interpreterData,
    loading: loadingInterpreter,
    error: errorInterpreter,
  } = useApiGet<InterpreterResponseData>(
    appointmentData?.success
      ? ApiRoutes.interpreters.profile(
          (appointmentData.data.interpreter_id ?? '').toString(),
        )
      : '',
    { enabled: !!appointmentData?.success },
  );

  // MUTAÇÕES: Aceitar e Recusar Agendamento
  const { post: acceptPost, loading: isAccepting } = useApiPost<
    AppointmentResponse,
    unknown
  >(`/appointments/${id}/accept`);
  const { post: rejectPost, loading: isRejecting } = useApiPost<
    AppointmentResponse,
    unknown
  >(`/appointments/${id}/reject`);

  // Lógica de Carregamento Principal
  if (loadingAppointment || loadingInterpreter || isAccepting || isRejecting) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.white }}
      >
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text className="font-ifood-regular text-text-light dark:text-text-dark mt-2">
          {loadingAppointment || loadingInterpreter
            ? 'Carregando detalhes...'
            : 'Atualizando agendamento...'}
        </Text>
      </View>
    );
  }

  // Lógica de Erro
  if (
    errorAppointment ||
    !appointmentData?.success ||
    errorInterpreter ||
    interpreterData === null
  ) {
    Toast.show({
      type: 'error',
      text1: Strings.detalhesAgendamento.toast.errorLoadTitle,
      text2:
        errorAppointment ||
        errorInterpreter ||
        Strings.detalhesAgendamento.toast.errorLoadDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
    });
    router.back();
    return null;
  }

  // --- EXTRAÇÃO E FORMATAÇÃO DE DADOS ---
  const appointment = appointmentData.data;
  const interpreter = interpreterData;

  // Campos do solicitante
  const nome = interpreter.name ?? 'Nome não informado';
  const email = interpreter.email ?? 'E-mail não informado';
  const telefone = interpreter.phone ?? '';
  const avatarUrl = interpreter.picture ?? '';
  const documentoSolicitante =
    interpreter.cpf ??
    interpreter.professional_data?.cnpj ??
    'Documento não informado';

  // Campos do appointment (lendo snake_case ou camelCase)
  const descricao = appointment.description ?? 'Descrição não informada';

  const dateRaw = (appointment as any).date ?? '';
  const startRaw =
    (appointment as any).startTime ?? (appointment as any).start_time ?? '';
  const endRaw =
    (appointment as any).endTime ?? (appointment as any).end_time ?? '';

  // Endereço (mapeando snake->camel só para esta função)
  const endereco =
    appointment.modality === 'ONLINE'
      ? 'Reunião Online'
      : formatEndereco({
          uf: (appointment as any).uf,
          city: (appointment as any).city,
          neighborhood: (appointment as any).neighborhood,
          street: (appointment as any).street,
          streetNumber:
            (appointment as any).street_number ??
            (appointment as any).streetNumber ??
            null,
          addressDetails:
            (appointment as any).address_details ??
            (appointment as any).addressDetails ??
            null,
        }) || 'Endereço não informado';

  const onlyDigits = (s: string) => (s || '').replace(/\D/g, '');
  const openWhatsApp = () => {
    const phone = onlyDigits(telefone);
    const message = `Olá, ${nome}.`;
    Linking.openURL(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    );
  };

  const handleCancelar = () => router.back();

  // Implementação da lógica de Aceitar
  const handleAceitar = async () => {
    const result = await acceptPost({});
    if (result?.success) {
      Toast.show({
        type: 'success',
        text1: 'Agendamento aceito!',
        position: 'top',
      });
      router.back();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Falha ao aceitar agendamento.',
        position: 'top',
      });
    }
  };

  // Implementação da lógica de Recusar
  const handleRecusar = async () => {
    const result = await rejectPost({});
    if (result?.success) {
      Toast.show({
        type: 'success',
        text1: 'Agendamento recusado!',
        position: 'top',
      });
      router.back();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Falha ao recusar agendamento.',
        position: 'top',
      });
    }
  };

  const lbl = {
    tituloTopo: Strings.detalhesAgendamento.header,
    agendamento: Strings.detalhesAgendamento.tabs.agendamento,
    solicitante: Strings.detalhesAgendamento.tabs.solicitante,
    descricao: Strings.detalhesAgendamento.sections.description,
    data: Strings.detalhesAgendamento.sections.date,
    localizacao: Strings.detalhesAgendamento.sections.location,
    telefone: Strings.detalhesAgendamento.sections.phone,
    email: Strings.detalhesAgendamento.sections.email,
    cancelar: Strings.detalhesAgendamento.cta.cancel,
    whatsapp: Strings.detalhesAgendamento.cta.whatsapp,
    aceitar: Strings.detalhesAgendamento.cta.accept,
    recusar: Strings.detalhesAgendamento.cta.reject,
  };

  const isAgendamento = tab === 'agendamento';
  const agendamentoColor = isAgendamento ? colors.primaryBlue : colors.disabled;
  const solicitanteColor = !isAgendamento
    ? colors.primaryBlue
    : colors.disabled;

  // Condições para exibir os botões de ação
  const isPending = appointment.status === 'PENDING';

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.white,
          paddingTop: SAFE_TOP,
          paddingBottom: SAFE_BOTTOM,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backBtn}
            accessibilityLabel={Strings.common.noResults}
          >
            <ChevronLeft size={22} color={colors.primaryBlue} />
          </Pressable>

          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {lbl.tituloTopo}
          </Text>

          <View style={styles.topSpacer} />
        </View>

        <View style={styles.header}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={styles.grow}>
            <Text
              style={[styles.nome, { color: colors.text }]}
              numberOfLines={1}
            >
              {nome}
            </Text>
            <Text style={[styles.cpf, { color: colors.text }]}>
              {documentoSolicitante}
            </Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <Pressable
            style={styles.tabBtn}
            onPress={() => setTab('agendamento')}
            accessibilityLabel={lbl.agendamento}
          >
            <View style={styles.tabContent}>
              <CalendarIcon
                size={16}
                color={agendamentoColor}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, { color: agendamentoColor }]}>
                {lbl.agendamento}
              </Text>
            </View>
            <View
              style={[
                styles.tabUnderlineBase,
                isAgendamento && styles.tabUnderlineActive,
                isAgendamento && { backgroundColor: agendamentoColor },
              ]}
            />
          </Pressable>

          <Pressable
            style={styles.tabBtn}
            onPress={() => setTab('solicitante')}
            accessibilityLabel={lbl.solicitante}
          >
            <View style={styles.tabContent}>
              <UserIcon
                size={16}
                color={solicitanteColor}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, { color: solicitanteColor }]}>
                {lbl.solicitante}
              </Text>
            </View>
            <View
              style={[
                styles.tabUnderlineBase,
                !isAgendamento && styles.tabUnderlineActive,
                !isAgendamento && { backgroundColor: solicitanteColor },
              ]}
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {isAgendamento ? (
            <View style={styles.section}>
              <View style={styles.block}>
                <View style={styles.rowAlign}>
                  <FileText size={18} color={colors.primaryBlue} />
                  <Text style={[styles.blockTitle, { color: colors.text }]}>
                    {lbl.descricao}
                  </Text>
                </View>
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {descricao}
                </Text>
              </View>

              <View style={styles.block}>
                <View style={styles.rowAlign}>
                  <CalendarIcon size={18} color={colors.primaryBlue} />
                  <Text style={[styles.blockTitle, { color: colors.text }]}>
                    {lbl.data}
                  </Text>
                </View>
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {formatRangeByParts(dateRaw, startRaw, endRaw)}
                </Text>
              </View>

              <View style={styles.block}>
                <View style={styles.rowAlign}>
                  <MapPin size={18} color={colors.primaryBlue} />
                  <Text style={[styles.blockTitle, { color: colors.text }]}>
                    {lbl.localizacao}
                  </Text>
                </View>
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {endereco}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <View style={styles.grow}>
                  <View style={styles.rowAlign}>
                    <Phone size={18} color={colors.primaryBlue} />
                    <Text style={[styles.blockTitle, { color: colors.text }]}>
                      {lbl.telefone}
                    </Text>
                  </View>
                  <Text style={[styles.blockText, { color: colors.text }]}>
                    {telefone}
                  </Text>
                </View>

                <Pressable
                  onPress={openWhatsApp}
                  style={[styles.whatsBtn, { borderColor: colors.primaryBlue }]}
                  accessibilityLabel={lbl.whatsapp}
                >
                  <Text
                    style={[styles.whatsText, { color: colors.primaryBlue }]}
                  >
                    {lbl.whatsapp}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.block}>
                <View style={styles.rowAlign}>
                  <AtSign size={18} color={colors.primaryBlue} />
                  <Text style={[styles.blockTitle, { color: colors.text }]}>
                    {lbl.email}
                  </Text>
                </View>
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {email}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.ctaWrap}>
        {isPending ? (
          <View style={styles.ctaRow}>
            <Button
              className="flex-1"
              onPress={handleRecusar}
              size="lg"
              variant="outline"
              accessibilityLabel={lbl.recusar}
              disabled={isAccepting || isRejecting}
            >
              <Text style={[styles.ctaText, { color: colors.primaryBlue }]}>
                {lbl.recusar}
              </Text>
            </Button>
            <Button
              className="flex-1 ml-4"
              onPress={handleAceitar}
              size="lg"
              accessibilityLabel={lbl.aceitar}
              disabled={isAccepting || isRejecting}
            >
              <Text style={[styles.ctaText, { color: colors.white }]}>
                {lbl.aceitar}
              </Text>
            </Button>
          </View>
        ) : (
          <Button
            className="w-full"
            onPress={handleCancelar}
            size="lg"
            accessibilityLabel={lbl.cancelar}
          >
            <Text style={[styles.ctaText, { color: colors.white }]}>
              {lbl.cancelar}
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  topRow: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 1,
    textAlign: 'center',
    flexShrink: 1,
    fontFamily: 'iFoodRC-Medium',
  },
  backBtn: { padding: 6 },
  topSpacer: { width: 22 },
  header: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  nome: { fontSize: 18, lineHeight: 22, fontFamily: 'iFoodRC-Medium' },
  cpf: { marginTop: 4, fontSize: 14, fontFamily: 'iFoodRC-Regular' },
  grow: { flex: 1 },
  tabs: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 32,
    marginTop: 8,
    alignSelf: 'center',
  },
  tabBtn: {
    paddingTop: 8,
    paddingBottom: 10,
    alignItems: 'center',
  },
  tabContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tabIcon: { marginTop: 1 },
  tabLabel: { fontSize: 16, fontFamily: 'iFoodRC-Medium' },
  tabUnderlineBase: {
    width: '100%',
    height: 0,
    borderRadius: 999,
    marginTop: 6,
  },
  tabUnderlineActive: { height: 2, borderRadius: 999 },
  scrollInner: {
    width: '100%',
    maxWidth: 360,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 20,
  },
  section: { gap: 20 },
  block: { gap: 6, width: '100%' },
  blockTitle: { fontSize: 16, fontFamily: 'iFoodRC-Medium' },
  blockText: { fontSize: 14, lineHeight: 20, fontFamily: 'iFoodRC-Regular' },
  rowAlign: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'nowrap',
  },
  whatsBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 8,
    flexShrink: 0,
    alignSelf: 'center',
  },
  whatsText: { fontSize: 14, fontFamily: 'iFoodRC-Medium' },
  ctaWrap: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'iFoodRC-Medium',
  },
  // Linha de botões Aceitar/Recusar
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
