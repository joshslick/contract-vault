import { useCallback, useMemo, useState } from 'react';
import importExportService from '../services/importExportService';

export default function useBackupFlow({
  password,          // current session password (fallback)
  sessionPassword,   // from auth context (decrypt existing records)
  loadRecords,       // refresh after import
  success,           // toast success(msg)
  addError,          // toast error(msg)
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'export' | 'import'
  const [pendingImportText, setPendingImportText] = useState(null);

  const openExportModal = useCallback(() => {
    setModalMode('export');
    setModalVisible(true);
  }, []);

  const openImportPicker = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cvb,application/json';

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const text = await file.text();
      setPendingImportText(text);
      setModalMode('import');
      setModalVisible(true);
    };

    input.click();
  }, []);

  const onCancel = useCallback(() => {
    setModalVisible(false);
    setModalMode(null);
    setPendingImportText(null);
  }, []);

  const onConfirm = useCallback(
    async (pw) => {
      setModalVisible(false);

      if (modalMode === 'export') {
        try {
          const exportPw = pw || password;
          if (!exportPw) {
            addError('Export cancelled: no password');
            return;
          }

          const { archive, filename } = await importExportService.createBackupFile(
            sessionPassword,
            exportPw
          );

          if (!archive || typeof archive !== 'string') {
            throw new Error('Export failed: empty archive');
          }

          const blob = new Blob([archive], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);

          success('Export complete — downloaded backup');
        } catch (err) {
          console.error(err);
          addError('Export failed — see console for details');
        } finally {
          setModalMode(null);
        }
        return;
      }

      if (modalMode === 'import') {
        try {
          await importExportService.importRecords(pendingImportText, pw, sessionPassword);
          await loadRecords();
          success('Import successful');
        } catch (err) {
          console.error(err);
          addError('Import failed: wrong password or corrupted file');
        } finally {
          setPendingImportText(null);
          setModalMode(null);
        }
        return;
      }

      // safety
      setModalMode(null);
      setPendingImportText(null);
    },
    [modalMode, password, pendingImportText, sessionPassword, loadRecords, success, addError]
  );

  const modalProps = useMemo(() => {
    return {
      visible: modalVisible,
      title:
        modalMode === 'export'
          ? 'Password to encrypt backup'
          : 'Password to decrypt backup',
      requireConfirm: modalMode === 'export',
      onConfirm,
      onCancel,
    };
  }, [modalVisible, modalMode, onConfirm, onCancel]);

  return {
    modalProps,
    openExportModal,
    openImportPicker,
  };
}
