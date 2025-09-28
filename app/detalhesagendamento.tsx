import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

import { useColors } from '@/src/hooks/useColors';
import { Button } from '@/src/components/ui/button';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';

import React from 'react';

const { height } = Dimensions.get('window');

type TabKey = 'agendamento' | 'solicitante';

export default function DetalhesAgendamento() {
  const colors = useColors();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = React.useState<TabKey>('agendamento');

  const { user } = useAuth();
  const prefer = <T,>(...vals: (T | undefined | null)[]) =>
    vals.find((v) => v !== undefined && v !== null) as T | undefined;

  // INFORMAÇÃO VINDA DO BACKEND: nome completo do usuário (user.name | user.fullName). Fallback: params.nome | 'Nome Sobrenome'
  const nome =
    prefer<string>(
      user?.name as any,
      (user as any)?.fullName,
      params.nome as string,
    ) || 'Nome Sobrenome';

  // INFORMAÇÃO VINDA DO BACKEND: CPF do usuário (user.cpf). Fallback: params.cpf | '00000000000'
  const cpf =
    prefer<string>(user?.cpf as any, params.cpf as string) || '00000000000';

  // INFORMAÇÃO VINDA DO BACKEND: e-mail do usuário (user.email). Fallback: params.email | 'exemplo@.com'
  const email =
    prefer<string>(user?.email as any, params.email as string) ||
    'exemplo@.com';

  // INFORMAÇÃO VINDA DO BACKEND: telefone do usuário (user.phone | user.telephone). Fallback: params.telefone | '(00) 00000-0000'
  const telefone =
    prefer<string>(
      user?.phone as any,
      (user as any)?.telephone,
      params.telefone as string,
    ) || '(00) 00000-0000';

  // INFORMAÇÃO VINDA DO BACKEND: URL do avatar/foto do usuário (user.avatarUrl | user.photo | user.image). Fallback: params.avatar | URL padrão
  const avatarUrl =
    prefer<string>(
      (user as any)?.avatarUrl,
      (user as any)?.photo,
      (user as any)?.image,
      params.avatar as string,
    ) ||
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5f4bd7a6-f763-4518-9b81-bdfd40ce3fc9/d26yer1-421bb5b8-9fc2-4d5a-b2d1-1e1f81b26b82.png/v1/fill/w_150,h_150,q_80,strp/spongebob_4_150x150_png_by_somemilk_d26yer1-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTUwIiwicGF0aCI6Ii9mLzVmNGJkN2E2LWY3NjMtNDUxOC05YjgxLWJkZmQ0MGNlM2ZjOS9kMjZ5ZXIxLTQyMWJiNWI4LTlmYzItNGQ1YS1iMmQxLTFlMWY4MWIyNmI4Mi5wbmciLCJ3aWR0aCI6Ijw9MTUwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.1eltXyAyclTf_FLrqWbmNpW8lYkmgSbeK3qMoLvY0YI';

  // INFORMAÇÃO VINDA DO BACKEND: descrição do agendamento. Fallback: params.descricao | lorem ipsum
  const descricao =
    (params.descricao as string) ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

  // INFORMAÇÃO VINDA DO BACKEND: data/hora de início do agendamento (ISO). Fallback: params.dataInicio | '2025-08-20T11:30:00'
  const dataInicio = (params.dataInicio as string) || '2025-08-20T11:30:00';

  // INFORMAÇÃO VINDA DO BACKEND: data/hora de fim do agendamento (ISO). Fallback: params.dataFim | '2025-08-20T12:30:00'
  const dataFim = (params.dataFim as string) || '2025-08-20T12:30:00';

  // INFORMAÇÃO VINDA DO BACKEND: endereço/localização do agendamento. Fallback: params.endereco | endereço padrão
  const endereco =
    (params.endereco as string) ||
    'Av. Ipiranga 6681, Partenon - Porto Alegre/RS';

  const onlyDigits = (s: string) => (s || '').replace(/\D/g, '');
  function maskCpf(raw: string) {
    const d = onlyDigits(raw).slice(0, 11);
    return d
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  function formatRange(iniISO: string, fimISO: string) {
    try {
      const ini = new Date(iniISO);
      const fim = new Date(fimISO);
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
    } catch {
      return `${iniISO} – ${fimISO}`;
    }
  }
  const openWhatsApp = () =>
    Linking.openURL(
      `https://wa.me/${onlyDigits(telefone)}?text=${encodeURIComponent(
        `Olá, ${nome}.`,
      )}`,
    );
  const handleCancelar = () => router.back();

  const lbl = {
    tituloTopo: Strings.scheduling.title,
    agendamento: Strings.scheduling.tabs.scheduling,
    solicitante: Strings.scheduling.tabs.requester,
    descricao: Strings.scheduling.sections.description,
    data: Strings.scheduling.sections.date,
    localizacao: Strings.scheduling.sections.location,
    telefone: Strings.scheduling.sections.phone,
    email: Strings.scheduling.sections.email,
    cancelar: Strings.scheduling.cta.cancel,
    whatsapp: Strings.scheduling.cta.whatsapp,
  };

  const isAgendamento = tab === 'agendamento';
  const agendamentoColor = isAgendamento ? colors.primaryBlue : colors.disabled;
  const solicitanteColor = !isAgendamento
    ? colors.primaryBlue
    : colors.disabled;

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.white,
          paddingTop: Math.max(insets.top, height * 0.08),
          paddingBottom: height * 0.15,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backBtn}
            accessibilityLabel={Strings.common.back}
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
          {/* // INFORMAÇÃO VINDA DO BACKEND: avatarUrl */}
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <View style={styles.grow}>
            {/* // INFORMAÇÃO VINDA DO BACKEND: nome */}
            <Text
              style={[styles.nome, { color: colors.text }]}
              numberOfLines={1}
            >
              {nome}
            </Text>
            {/* // INFORMAÇÃO VINDA DO BACKEND: cpf */}
            <Text style={[styles.cpf, { color: colors.text }]}>
              {maskCpf(cpf)}
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
                {/* // INFORMAÇÃO VINDA DO BACKEND: descricao */}
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
                {/* // INFORMAÇÃO VINDA DO BACKEND: dataInicio e dataFim */}
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {formatRange(dataInicio, dataFim)}
                </Text>
              </View>

              <View style={styles.block}>
                <View style={styles.rowAlign}>
                  <MapPin size={18} color={colors.primaryBlue} />
                  <Text style={[styles.blockTitle, { color: colors.text }]}>
                    {lbl.localizacao}
                  </Text>
                </View>
                {/* // INFORMAÇÃO VINDA DO BACKEND: endereco */}
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
                  {/* // INFORMAÇÃO VINDA DO BACKEND: telefone */}
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
                {/* // INFORMAÇÃO VINDA DO BACKEND: email */}
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {email}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

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
});
