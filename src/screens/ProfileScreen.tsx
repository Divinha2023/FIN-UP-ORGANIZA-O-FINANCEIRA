import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { Bell, ChevronRight, Database, LockKeyhole, Palette, ShieldCheck, UserRound } from "lucide-react-native";

import { GlassCard } from "@/components/GlassCard";
import { LogoMark } from "@/components/Logo";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useFinance } from "@/store/FinanceStore";
import { colors, radius, typography } from "@/theme/tokens";

const settings = [
  { id: "personal", label: "Dados pessoais", icon: UserRound },
  { id: "security", label: "Seguranca e privacidade", icon: LockKeyhole },
  { id: "notifications", label: "Notificacoes", icon: Bell },
  { id: "premium", label: "Plano Premium", icon: ShieldCheck }
];

export function ProfileScreen() {
  const { state, toggleDarkMode, resetLocalData } = useFinance();

  return (
    <View style={styles.root}>
      <ScreenHeader title="Perfil" subtitle="Preferencias e seguranca" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <GlassCard style={styles.profileCard}>
          <View style={styles.avatar}>
            <LogoMark size={48} />
          </View>
          <Text style={styles.name}>Seu perfil</Text>
          <Text style={styles.email}>Dados locais do FinUp</Text>
          <View style={styles.status}>
            <ShieldCheck color={colors.green} size={16} strokeWidth={2.4} />
            <Text style={styles.statusText}>Conta protegida</Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.preference}>
          <View style={styles.preferenceIcon}>
            <Palette color={colors.yellow} size={19} strokeWidth={2.4} />
          </View>
          <View style={styles.preferenceCopy}>
            <Text style={styles.preferenceTitle}>Tema escuro</Text>
            <Text style={styles.preferenceBody}>Preferencia salva no dispositivo.</Text>
          </View>
          <Switch value={state.preferences.darkMode} onValueChange={toggleDarkMode} trackColor={{ true: colors.green, false: colors.muted }} thumbColor={colors.ice} />
        </GlassCard>

        <GlassCard style={styles.preference}>
          <View style={styles.preferenceIcon}>
            <Database color={colors.green} size={19} strokeWidth={2.4} />
          </View>
          <View style={styles.preferenceCopy}>
            <Text style={styles.preferenceTitle}>Persistencia local ativa</Text>
            <Text style={styles.preferenceBody}>
              {state.transactions.length} transacoes e {state.goals.length} metas salvas.
            </Text>
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={styles.sectionTitle}>Configuracoes</Text>
          <View style={styles.settingsList}>
            {settings.map((item) => {
              const Icon = item.icon;
              return (
                <View key={item.id} style={styles.settingRow}>
                  <View style={styles.settingIcon}>
                    <Icon color={colors.green} size={18} strokeWidth={2.3} />
                  </View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <ChevronRight color="rgba(245,247,250,0.5)" size={18} strokeWidth={2.3} />
                </View>
              );
            })}
          </View>
        </GlassCard>

        <GlassCard style={styles.securityCard}>
          <Text style={styles.sectionTitle}>Seguranca financeira</Text>
          <Text style={styles.securityText}>Os dados deste prototipo ficam no armazenamento local do dispositivo. Em producao, a camada pode evoluir para criptografia local, JWT e PostgreSQL.</Text>
          <Pressable accessibilityRole="button" onPress={resetLocalData} style={styles.resetButton}>
            <Text style={styles.resetText}>Zerar dados locais</Text>
          </Pressable>
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 112
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 28
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderColor: "rgba(0,200,83,0.25)",
    borderRadius: radius.round,
    borderWidth: 1,
    height: 92,
    justifyContent: "center",
    width: 92
  },
  name: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 14
  },
  email: {
    color: "rgba(245,247,250,0.56)",
    fontFamily: typography.regular,
    fontSize: 13,
    marginTop: 4
  },
  status: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderRadius: radius.round,
    flexDirection: "row",
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  statusText: {
    color: colors.green,
    fontFamily: typography.semibold,
    fontSize: 12,
    fontWeight: "700"
  },
  preference: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  preferenceIcon: {
    alignItems: "center",
    backgroundColor: colors.yellowSoft,
    borderRadius: radius.round,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  preferenceCopy: {
    flex: 1,
    gap: 3
  },
  preferenceTitle: {
    color: colors.ice,
    fontFamily: typography.semibold,
    fontSize: 14,
    fontWeight: "700"
  },
  preferenceBody: {
    color: "rgba(245,247,250,0.55)",
    fontFamily: typography.regular,
    fontSize: 12
  },
  sectionTitle: {
    color: colors.ice,
    fontFamily: typography.bold,
    fontSize: 15,
    fontWeight: "800"
  },
  settingsList: {
    gap: 5,
    marginTop: 15
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: 52
  },
  settingIcon: {
    alignItems: "center",
    backgroundColor: colors.greenSoft,
    borderRadius: radius.round,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  settingLabel: {
    color: colors.ice,
    flex: 1,
    fontFamily: typography.medium,
    fontSize: 14
  },
  securityCard: {
    gap: 12
  },
  securityText: {
    color: "rgba(245,247,250,0.58)",
    fontFamily: typography.regular,
    fontSize: 12,
    lineHeight: 18
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: colors.redSoft,
    borderRadius: radius.md,
    minHeight: 44,
    justifyContent: "center"
  },
  resetText: {
    color: colors.red,
    fontFamily: typography.bold,
    fontSize: 13,
    fontWeight: "800"
  }
});
