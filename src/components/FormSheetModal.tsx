import { type PropsWithChildren, useEffect, useState } from "react";
import { Keyboard, Modal, Platform, ScrollView, StyleSheet, type StyleProp, type ViewStyle, View } from "react-native";

import { colors, shadows } from "@/theme/tokens";

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function FormSheetModal({ visible, onClose, contentStyle, children }: Props) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, shadows.card, keyboardHeight > 0 && { marginBottom: keyboardHeight }]}>
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, contentStyle]}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(7, 22, 34, 0.72)",
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: Platform.OS === "android" ? 28 : 0
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
    overflow: "hidden"
  },
  content: {
    gap: 13,
    padding: 20,
    paddingBottom: 28
  }
});
