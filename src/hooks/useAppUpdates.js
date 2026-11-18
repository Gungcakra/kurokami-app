import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Updates from "expo-updates";

/**
 * Memeriksa pembaruan OTA dari EAS Update.
 *
 * Aturannya dibuat supaya tidak mengganggu saat sedang membaca:
 * - Saat aplikasi baru dibuka, update yang ditemukan langsung dipasang.
 * - Saat aplikasi kembali dari background, update diunduh dulu dan baru
 *   dipasang pada perpindahan ke foreground berikutnya.
 *
 * Di mode development hook ini tidak melakukan apa-apa karena bundle
 * diambil dari Metro, bukan dari server update.
 */
export const useAppUpdates = () => {
  const [status, setStatus] = useState("idle");
  const checkingRef = useRef(false);
  const pendingRef = useRef(false);

  const checkForUpdate = useCallback(async (applyImmediately) => {
    if (__DEV__ || !Updates.isEnabled) return;
    if (checkingRef.current) return;

    checkingRef.current = true;

    try {
      const result = await Updates.checkForUpdateAsync();
      if (!result.isAvailable) {
        setStatus("idle");
        return;
      }

      setStatus("downloading");
      const fetched = await Updates.fetchUpdateAsync();

      if (!fetched.isNew) {
        setStatus("idle");
        return;
      }

      pendingRef.current = true;
      setStatus("ready");

      if (applyImmediately) await Updates.reloadAsync();
    } catch (e) {
      // Gagal memeriksa update tidak boleh mengganggu pemakaian aplikasi.
      console.log("Update Error:", e?.message || e);
      setStatus("idle");
    } finally {
      checkingRef.current = false;
    }
  }, []);

  useEffect(() => {
    checkForUpdate(true);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;

      if (pendingRef.current) {
        Updates.reloadAsync().catch((e) =>
          console.log("Update Error:", e?.message || e)
        );
        return;
      }

      checkForUpdate(false);
    });

    return () => subscription.remove();
  }, [checkForUpdate]);

  return status;
};
