// app/detalhesagendamento.tsx
import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking } from 'react-native';
import { Button } from '@/src/components/ui/button';
import { useColors } from '@/src/hooks/useColors';
import { router, useLocalSearchParams } from 'expo-router';
import { Strings } from '@/src/constants/Strings';
import { handleCpfChange } from '@/src/utils/mask';

export default function DetalhesAgendamento() {
  const colors = useColors();
  const params = useLocalSearchParams();

  const [tab, setTab] = React.useState<'agendamento' | 'solicitante'>('agendamento');

  // dados simples (params -> defaults)
  const nome = (params.nome as string) || 'Nome Sobrenome';
  const cpf = (params.cpf as string) || '00000000000';
  const avatarUrl = (params.avatar as string) || 'https://i.pravatar.cc/150?img=3';
  const descricao =
    (params.descricao as string) ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.';
  const inicio = (params?.inicio as string) || '2025-08-20T11:30:00.000Z';
  const fim = (params?.fim as string) || '2025-08-20T12:30:00.000Z';
  const endereco = (params?.endereco as string) || 'Endereço do usuário';
  const telefone = (params?.telefone as string) || 'Telefone do usuário';
  const email = (params?.email as string) || 'Email do usuário';

  const pad2 = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) =>
    `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(
      d.getHours(),
    )}:${pad2(d.getMinutes())}`;
  const s = new Date(inicio);
  const e = new Date(fim);
  const dataIntervalo = `${fmt(s)} – ${pad2(e.getHours())}:${pad2(e.getMinutes())}`;

  const openWhatsApp = () => {
    const phone = telefone.replace(/\D/g, '');
    if (phone) Linking.openURL(`https://wa.me/${phone}`);
  };

  const onCancel = () => {
    // TODO: integrar com sua API de cancelamento
    router.back();
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
          <Text style={[styles.backTxt, { color: colors.primaryOrange }]}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{Strings.scheduling.title}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Topo */}
      <View style={styles.topCard}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{nome}</Text>
          <Text style={styles.cpf}>{handleCpfChange(cpf)}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable onPress={() => setTab('agendamento')} style={styles.tabBtn}>
          <Text
            style={[
              styles.tabTxt,
              tab === 'agendamento' && { color: colors.primaryBlue, fontFamily: 'iFoodRC-Medium' },
            ]}
          >
            {Strings.scheduling.tabs.scheduling}
          </Text>
          {tab === 'agendamento' && (
            <View style={[styles.underline, { backgroundColor: colors.primaryBlue }]} />
          )}
        </Pressable>

        <Pressable onPress={() => setTab('solicitante')} style={styles.tabBtn}>
          <Text
            style={[
              styles.tabTxt,
              tab === 'solicitante' && { color: colors.primaryBlue, fontFamily: 'iFoodRC-Medium' },
            ]}
          >
            {Strings.scheduling.tabs.requester}
          </Text>
          {tab === 'solicitante' && (
            <View style={[styles.underline, { backgroundColor: colors.primaryBlue }]} />
          )}
        </Pressable>
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'agendamento' ? (
          <View style={{ gap: 20 }}>
            <Section title={Strings.scheduling.sections.description}>
              <Text style={styles.body}>{descricao}</Text>
            </Section>

            <Section title={Strings.scheduling.sections.date}>
              <Text style={styles.body}>{dataIntervalo}</Text>
            </Section>

            <Section title={Strings.scheduling.sections.location}>
              <Text style={styles.body}>{endereco}</Text>
            </Section>
          </View>
        ) : (
          <View style={{ gap: 24 }}>
            <Section title={Strings.scheduling.sections.phone}>
              <View style={styles.row}>
                <Text style={styles.body}>{telefone}</Text>
                <Button className="px-3 py-1 h-8" onPress={openWhatsApp} accessibilityLabel="WhatsApp">
                  <Text style={styles.whatsTxt}>{Strings.scheduling.cta.whatsapp}</Text>
                </Button>
              </View>
            </Section>

            <Section title={Strings.scheduling.sections.email}>
              <Text style={styles.body}>{email}</Text>
            </Section>
          </View>
        )}
      </ScrollView>

      {/* Footer (padrão do onboarding) */}
      <View className="absolute bottom-10 w-full px-6">
        <Button className="w-full" onPress={onCancel} accessibilityLabel={Strings.scheduling.cta.cancel} size="lg">
          <Text style={[styles.ctaText, { color: colors.white }]}>
            {Strings.scheduling.cta.cancel}
          </Text>
        </Button>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },
  header: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 28, lineHeight: 28, fontFamily: 'iFoodRC-Regular' },
  headerTitle: { fontSize: 14, letterSpacing: 1, fontFamily: 'iFoodRC-Bold' },

  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#eee' },
  name: { fontSize: 18, fontFamily: 'iFoodRC-Medium' },
  cpf: { marginTop: 2, color: '#6B7280', fontFamily: 'iFoodRC-Regular' },

  tabs: { marginTop: 8, paddingHorizontal: 24, flexDirection: 'row', gap: 24 },
  tabBtn: { paddingVertical: 8 },
  tabTxt: { fontSize: 16, color: '#6B7280', fontFamily: 'iFoodRC-Regular' },
  underline: { height: 2, marginTop: 4, borderRadius: 999 },

  sectionTitle: { fontSize: 14, fontFamily: 'iFoodRC-Medium', color: '#374151' },
  body: { fontSize: 14, lineHeight: 20, color: '#111827', fontFamily: 'iFoodRC-Regular' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
 
  ctaText: {
    fontSize: 16,
    fontFamily: 'iFoodRC-Medium',
  },

  whatsTxt: { color: '#FFF', fontSize: 12, fontFamily: 'iFoodRC-Medium' },
});
