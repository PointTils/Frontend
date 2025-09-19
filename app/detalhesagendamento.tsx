// app/detalhesagendamentos.tsx
import { Button } from '@/src/components/ui/button';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type TabKey = 'agendamento' | 'solicitante';

export default function DetalhesAgendamentos() {
  const colors = useColors();
  const params = useLocalSearchParams();

  const [tab, setTab] = React.useState<TabKey>('agendamento');

  // params -> defaults
  const nome = (params.nome as string) || 'Nome Sobrenome';
  const cpf = (params.cpf as string) || '00000000000';
  const avatarUrl = (params.avatar as string) || 'https://i.pravatar.cc/150?img=3';
  const descricao =
    (params.descricao as string) ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  const dataInicio = (params.dataInicio as string) || '2025-08-20T11:30:00';
  const dataFim = (params.dataFim as string) || '2025-08-20T12:30:00';
  const endereco = (params.endereco as string) || 'Av. Ipiranga 6681, Partenon - Porto Alegre/RS';
  const telefone = (params.telefone as string) || '(00) 00000-0000';
  const email = (params.email as string) || 'exemplo@.com';

  // helpers
  function maskCpf(raw: string) {
    const d = (raw || '').replace(/\D/g, '').slice(0, 11);
    return d
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .padEnd(14, 'X');
  }
  function formatRange(iniISO: string, fimISO: string) {
    try {
      const ini = new Date(iniISO);
      const fim = new Date(fimISO);
      const dia = ini.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
      const hi = ini.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      const hf = fim.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      return `${dia} ${hi} – ${hf}`;
    } catch {
      return `${iniISO} – ${fimISO}`;
    }
  }
  const onlyDigits = (s: string) => (s || '').replace(/\D/g, '');
  const openWhatsApp = () => Linking.openURL(`https://wa.me/${onlyDigits(telefone)}?text=${encodeURIComponent(`Olá, ${nome}.`)}`);
  const handleCancelar = () => router.back();

  const lbl = {
    agendamento: 'Agendamento',
    solicitante: 'Solicitante',
    descricao: 'Descrição',
    data: 'Data',
    localizacao: 'Localização',
    telefone: 'Telefone',
    email: 'E-mail',
    cancelar: Strings?.common?.cancel ?? 'Cancelar agendamento',
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.white }]}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View style={styles.grow}>
          <Text style={[styles.nome, { color: colors.primaryBlue }]} numberOfLines={1}>
            {nome}
          </Text>
          <Text style={[styles.cpf, { color: colors.primaryBlue }]}>{maskCpf(cpf)}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable style={styles.tabBtn} onPress={() => setTab('agendamento')} accessibilityLabel={lbl.agendamento}>
          <Text style={[styles.tabLabel, { color: colors.primaryBlue }]}>{lbl.agendamento}</Text>
          <View style={tab === 'agendamento' ? styles.tabUnderlineActive : styles.tabUnderline} />
        </Pressable>

        <Pressable style={styles.tabBtn} onPress={() => setTab('solicitante')} accessibilityLabel={lbl.solicitante}>
          <Text style={[styles.tabLabel, { color: colors.primaryBlue }]}>{lbl.solicitante}</Text>
          <View style={tab === 'solicitante' ? styles.tabUnderlineActive : styles.tabUnderline} />
        </Pressable>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.contentGrow} showsVerticalScrollIndicator={false}>
        {tab === 'agendamento' ? (
          <View style={styles.section}>
            <View style={styles.block}>
              <Text style={[styles.blockTitle, { color: colors.primaryBlue }]}>{lbl.descricao}</Text>
              <Text style={styles.blockText}>{descricao}</Text>
            </View>

            <View style={styles.block}>
              <Text style={[styles.blockTitle, { color: colors.primaryBlue }]}>{lbl.data}</Text>
              <Text style={styles.blockText}>{formatRange(dataInicio, dataFim)}</Text>
            </View>

            <View style={styles.block}>
              <Text style={[styles.blockTitle, { color: colors.primaryBlue }]}>{lbl.localizacao}</Text>
              <Text style={styles.blockText}>{endereco}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <View style={styles.grow}>
                <Text style={[styles.blockTitle, { color: colors.primaryBlue }]}>{lbl.telefone}</Text>
                <Text style={styles.blockText}>{telefone}</Text>
              </View>
              <Button onPress={openWhatsApp} size="sm" accessibilityLabel="WhatsApp">
                <Text style={[styles.whatsText, { color: colors.primaryBlue }]}>WhatsApp</Text>
              </Button>
            </View>

            <View style={styles.block}>
              <Text style={[styles.blockTitle, { color: colors.primaryBlue }]}>{lbl.email}</Text>
              <Text style={styles.blockText}>{email}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* CTA inferior */}
      <View style={styles.bottomArea}>
        <Button className="w-full" onPress={handleCancelar} size="lg" accessibilityLabel={lbl.cancelar}>
          <Text style={[styles.cancelText, { color: colors.white }]}>{lbl.cancelar}</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  nome: { fontSize: 18, lineHeight: 22, fontFamily: 'iFoodRC-Medium' },
  cpf: { marginTop: 4, fontSize: 14, fontFamily: 'iFoodRC-Regular' },

  tabs: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 24,
    alignItems: 'flex-end',
    marginTop: 8,
  },
  tabBtn: { paddingVertical: 12, alignItems: 'center' },
  tabLabel: { fontSize: 16, fontFamily: 'iFoodRC-Medium' },
  tabUnderline: { width: '100%', borderRadius: 999, height: 0 },
  tabUnderlineActive: { width: '100%', borderRadius: 999, height: 2 },

  grow: { flex: 1 },

  contentGrow: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 120, gap: 20 },
  section: { gap: 20 },
  block: { gap: 6 },
  blockTitle: { fontSize: 16, fontFamily: 'iFoodRC-Medium' },
  blockText: { fontSize: 14, lineHeight: 20, fontFamily: 'iFoodRC-Regular' },

  rowBetween: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  bottomArea: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  cancelText: { fontSize: 16, fontFamily: 'iFoodRC-Medium' },
  whatsText: { fontSize: 14, fontFamily: 'iFoodRC-Medium' },
});
