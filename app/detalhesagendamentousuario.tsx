import { Button } from '@/src/components/ui/button';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useApiGet } from '@/src/hooks/useApi';
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
  Star,
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

type TabKey = 'agendamento' | 'profissional';

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

/**
 * Componente principal para a tela de detalhes de agendamento (vista pelo Usuário Solicitante).
 */
export default function DetalhesAgendamentoUsuario() {
  const colors = useColors();
  const SAFE_TOP = height * 0.12;
  const SAFE_BOTTOM = height * 0.15;

  const [tab, setTab] = React.useState<TabKey>('agendamento');

  // Extrai o ID do agendamento
  const { id } = useLocalSearchParams<{ id: string }>();

  // 1. Fetch appointment data
  const {
    data: appointmentData,
    loading: loadingAppointment,
    error: errorAppointment,
  } = useApiGet<AppointmentResponse>(ApiRoutes.appointments.detail(id || ''));

  // 2. Fetch interpreter data usando o ID do agendamento
  const interpreterId = appointmentData?.data.interpreter_id;

  const {
    data: professionalData,
    loading: loadingProfessional,
    error: errorProfessional,
  } = useApiGet<InterpreterResponseData>(
    interpreterId
      ? ApiRoutes.interpreters.profile(interpreterId.toString())
      : '',
    { enabled: !!interpreterId },
  );

  // Lógica de validação e erro inicial
  useEffect(() => {
    if (!id) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'ID do agendamento não fornecido',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
      });
      router.back();
    }
  }, [id]);

  // CORREÇÃO: Usamos o objeto toast do DetalhesAgendamento como fallback para evitar o erro de tipagem.
  const toastStrings =
    (Strings.detalhesAgendamentoUsuario as any).toast ||
    Strings.detalhesAgendamento.toast;

  // Lógica de Carregamento
  if (loadingAppointment || loadingProfessional) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.white }}
      >
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text className="font-ifood-regular text-text-light dark:text-text-dark mt-2">
          Carregando detalhes...
        </Text>
      </View>
    );
  }

  // Lógica de Erro
  if (
    errorAppointment ||
    errorProfessional ||
    !appointmentData?.success ||
    !professionalData
  ) {
    Toast.show({
      type: 'error',
      text1: toastStrings.errorLoadTitle || 'Erro ao carregar',
      text2:
        errorAppointment ||
        errorProfessional ||
        toastStrings.errorLoadDescription ||
        'Não foi possível carregar os detalhes',
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
    });
    return null;
  }

  // --- EXTRAÇÃO E FORMATAÇÃO DE DADOS ---
  const appointment = appointmentData.data;
  const professional = professionalData;

  // Dados do Profissional (Intérprete)
  const nome = professional.name ?? 'Nome não informado';
  const ocupacao =
    professional.specialties?.[0]?.name ?? 'Intérprete de Libras';
  const email = professional.email ?? 'E-mail não informado';
  const telefone = professional.phone ?? '';
  const avatarUrl = professional.picture ?? '';
  const nota: number = professional.professional_data?.rating ?? 5.0;
  const notaTxt = nota.toFixed(1).replace('.', ',');
  const servicosDescricao =
    professional.professional_data?.description ??
    'Nenhuma descrição de serviços fornecida.';

  // Dados do Agendamento (lendo snake_case ou camelCase)
  const descricao = appointment.description ?? 'Descrição não informada';

  const dateRaw = (appointment as any).date ?? '';
  const startRaw =
    (appointment as any).startTime ?? (appointment as any).start_time ?? '';
  const endRaw =
    (appointment as any).endTime ?? (appointment as any).end_time ?? '';

  // Endereço (mapeando snake->camel só para esta função)
  const endereco =
    appointment.modality === 'ONLINE'
      ? 'Reunião Online (online)'
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

  // Funções de ação
  const onlyDigits = (s: string) => (s || '').replace(/\D/g, '');
  const openWhatsApp = () => {
    const phone = onlyDigits(telefone);
    const message = `Olá, ${nome}. Gostaria de confirmar nosso agendamento.`;
    Linking.openURL(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    );
  };

  const handleCancelar = () => router.back(); // Substituir pela lógica real de cancelamento

  const lbl = {
    tituloTopo: Strings.detalhesAgendamentoUsuario.header,
    agendamento: Strings.detalhesAgendamentoUsuario.tabs.agendamento,
    profissional: Strings.detalhesAgendamentoUsuario.tabs.profissional,
    descricao: Strings.detalhesAgendamentoUsuario.sections.description,
    servicos: Strings.detalhesAgendamentoUsuario.sections.services,
    data: Strings.detalhesAgendamentoUsuario.sections.date,
    localizacao: Strings.detalhesAgendamentoUsuario.sections.location,
    telefone: Strings.detalhesAgendamentoUsuario.sections.phone,
    email: Strings.detalhesAgendamentoUsuario.sections.email,
    cancelar: Strings.detalhesAgendamentoUsuario.cta.cancel,
    whatsapp: Strings.detalhesAgendamentoUsuario.cta.whatsapp,
  };

  const isAgendamento = tab === 'agendamento';
  const agendamentoColor = isAgendamento ? colors.primaryBlue : colors.disabled;
  const profissionalColor = !isAgendamento
    ? colors.primaryBlue
    : colors.disabled;

  // Funções de cor para o avatar (mantidas do seu código)
  const pickColor = (...vals: (string | undefined)[]) =>
    vals.find(Boolean) as string;

  const avatarBg = pickColor(
    (colors as any).surface,
    (colors as any).card,
    (colors as any).muted,
    colors.white,
  );
  const avatarBorder = pickColor(
    (colors as any).border,
    (colors as any).muted,
    colors.disabled,
  );

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
        {/* TOP ROW (BACK BUTTON + TITLE) */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backBtn}
            accessibilityLabel={Strings.common.buttons.back}
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

        {/* HEADER (AVATAR + NAME + RATING) */}
        <View style={styles.header}>
          <Image
            source={{ uri: avatarUrl }}
            style={[
              styles.avatar,
              styles.avatarDecor,
              { backgroundColor: avatarBg, borderColor: avatarBorder },
            ]}
          />

          <View style={styles.grow}>
            <Text
              style={[styles.nome, { color: colors.text }]}
              numberOfLines={1}
            >
              {nome}
            </Text>

            <Text
              style={[styles.ocupacao, { color: colors.disabled }]}
              numberOfLines={1}
            >
              {ocupacao}
            </Text>

            <View style={[styles.rowAlign, styles.ratingRow]}>
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.round(nota);
                return (
                  <Star
                    key={i}
                    size={14}
                    color={filled ? colors.primaryBlue : colors.disabled}
                    fill={filled ? colors.primaryBlue : 'transparent'}
                  />
                );
              })}
              <Text style={[styles.rating, { color: colors.primaryBlue }]}>
                {notaTxt}
              </Text>
            </View>
          </View>
        </View>

        {/* TABS */}
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
            onPress={() => setTab('profissional')}
            accessibilityLabel={lbl.profissional}
          >
            <View style={styles.tabContent}>
              <UserIcon
                size={16}
                color={profissionalColor}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, { color: profissionalColor }]}>
                {lbl.profissional}
              </Text>
            </View>
            <View
              style={[
                styles.tabUnderlineBase,
                !isAgendamento && styles.tabUnderlineActive,
                !isAgendamento && { backgroundColor: profissionalColor },
              ]}
            />
          </Pressable>
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {isAgendamento ? (
            <View style={styles.section}>
              {/* DESCRIÇÃO DO AGENDAMENTO */}
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

              {/* DATA E HORA */}
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

              {/* LOCALIZAÇÃO */}
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
              {/* SERVIÇOS E EXPERIÊNCIA (do profissional) */}
              <View style={styles.block}>
                <View style={styles.rowAlign}>
                  <FileText size={18} color={colors.primaryBlue} />
                  <Text style={[styles.blockTitle, { color: colors.text }]}>
                    {lbl.servicos}
                  </Text>
                </View>
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {servicosDescricao}
                </Text>
              </View>

              {/* TELEFONE */}
              <View style={styles.rowBetween}>
                <View className="flex-1">
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

              {/* EMAIL */}
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

      {/* CALL TO ACTION (CANCELAR) */}
      <View style={styles.ctaWrap}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
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
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarDecor: { borderWidth: 1 },
  nome: { fontSize: 18, lineHeight: 22, fontFamily: 'iFoodRC-Medium' },
  ocupacao: {
    marginTop: 2,
    marginBottom: 6,
    fontSize: 14,
    fontFamily: 'iFoodRC-Medium',
  },
  ratingRow: {
    marginTop: 4,
  },
  rating: { marginLeft: 6, fontSize: 12, fontFamily: 'iFoodRC-Medium' },
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
  tabBtn: { paddingTop: 8, paddingBottom: 10, alignItems: 'center' },
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
  ctaText: { fontSize: 16, fontFamily: 'iFoodRC-Medium' },
});
