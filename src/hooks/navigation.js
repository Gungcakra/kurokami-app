import { useCallback } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Kembali ke screen sebelumnya. Kalau screen ini adalah screen pertama
 * di stack (misal dibuka lewat deep link), jatuhkan ke tab utama.
 */
export const goBackOrHome = (navigation) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate("Main");
  }
};

/**
 * Mendaftarkan tombol back fisik Android HANYA selama screen sedang fokus,
 * supaya handler milik screen yang tertimbun tidak ikut jalan.
 *
 * Handler harus mengembalikan true kalau event-nya sudah ditangani.
 */
export const useBackHandler = (handler) => {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handler
      );
      return () => subscription.remove();
    }, [handler])
  );
};
