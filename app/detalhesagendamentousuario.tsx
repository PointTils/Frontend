import { Button } from '@/src/components/ui/button';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import type {AppointmentResponse} from '@/src/types/api/appointments';
import type { UserResponseData } from '@/src/types/api/user';
import { UserType } from '@/src/types/common';
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
} from 'react-native';
 
const { height } = Dimensions.get('window');

  const { data: appointmentData } = useApiGet<AppointmentResponse>(
    ApiRoutes.appointments.detail(id || ''),
  );

type TabKey = 'agendamento' | 'profissional';

export default function DetalhesAgendamentoUsuario() {
  const colors = useColors();
  const params = useLocalSearchParams();
  const SAFE_TOP = height * 0.12;
  const SAFE_BOTTOM = height * 0.15;

  const [tab, setTab] = React.useState<TabKey>('agendamento');
  const formattedDoc = (data as any).cpf || (data as any).cnpj || '';


    function formatRange(iniISO?: string, fimISO?: string) {
    if (!iniISO || !fimISO) return '';
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
 
  const pickColor = (...vals: (string | undefined)[]) =>
    vals.find(Boolean) as string;

  const { user } = useAuth();
  const prefer = <T,>(...vals: (T | undefined | null)[]) =>
    vals.find((v) => v !== undefined && v !== null) as T | undefined;

  const nome =
    prefer<string>(
      user?.name as any,
      (user as any)?.fullName,
      params.nome as string,
    ) || 'Nome Sobrenome';

  const ocupacao = (params.ocupacao as string) || 'Intérprete de Libras';
  const nota: number = params.nota ? Number(params.nota) : 5.0;
  const notaTxt = nota.toFixed(1).replace('.', ',');
    
 

  const email = data.email;
  const telefone = data.phone;
  const avatarUrl = data.picture;
  const [avatarSrc, _setAvatarSrc] = React.useState<{ uri: string }>({
    uri: avatarUrl,
  });


  const dataInicio = appointmentData?.data.startTime
  const dataFim = appointmentData?.data.endTime
  const endereco = formatEndereco(params as any) || 'Endereço não informado';

  type Endereco = {
    uf?: string | null;
    city?: string | null;
    neighborhood?: string | null;
    street?: string | null;
    streetNumber?: number | null;
    addressDetails?: string | null;
  };

  function formatEndereco(endereco?: Endereco) {
    if (!endereco) return '';

    const { street, streetNumber, neighborhood, city, uf, addressDetails } = endereco;

    return [
      street && `${street}${streetNumber ? `, ${streetNumber}` : ''}`,
      neighborhood,
      city && uf ? `${city}/${uf}` : city || uf,
      addressDetails,
    ]
      .filter(Boolean)
      .join(' - ');
  }
  

   const openWhatsApp = () => {
      const phone = onlyDigits(telefone);
      const message = `Olá, ${nome}.`;
      Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
    };


  const handleCancelar = () => router.back();

  const lbl = {
    tituloTopo: Strings.detalhesAgendamento.title,
    agendamento: Strings.detalhesAgendamento.tabs.scheduling,
    profissional:
      (Strings as any)?.scheduling?.tabs?.professional ?? 'Profissional',
    descricao: Strings.detalhesAgendamento.sections.description,
    servicos:
      (Strings as any)?.scheduling?.sections?.services ??
      'Serviços e experiência',
    data: Strings.detalhesAgendamento.sections.date,
    localizacao: Strings.detalhesAgendamento.sections.location,
    telefone: Strings.detalhesAgendamento.sections.phone,
    email: Strings.detalhesAgendamento.sections.email,
    cancelar: Strings.detalhesAgendamento.cta.cancel,
    whatsapp: Strings.detalhesAgendamento.cta.whatsapp,
  };

  const isAgendamento = tab === 'agendamento';
  const agendamentoColor = isAgendamento ? colors.primaryBlue : colors.disabled;
  const profissionalColor = !isAgendamento
    ? colors.primaryBlue
    : colors.disabled;
 
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
        { }
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

        {}
        <View style={styles.header}>
          <Image
            source={avatarSrc}
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
                  <StarIcon
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

        { }
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

        { }
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
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {endereco}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              { }
              <View style={styles.block}>
                <View style={styles.rowAlign}>
                  <FileText size={18} color={colors.primaryBlue} />
                  <Text style={[styles.blockTitle, { color: colors.text }]}>
                    {lbl.servicos}
                  </Text>
                </View>
                <Text style={[styles.blockText, { color: colors.text }]}>
                  {descricao}
                </Text>
              </View>

              { }
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

              {}
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

      { }
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
