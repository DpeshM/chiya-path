export const testGoogleSheetsConnection = async (sheetConfig, setSheetConfig, setSyncStatus) => {
  setSyncStatus({ message: 'Testing connection...', type: 'loading', lastSync: new Date() });

  return new Promise((resolve) => {
    setTimeout(() => {
      setSheetConfig((prev) => ({ ...prev, isConfigured: true }));
      setSyncStatus({
        message: '✅ Connection Successful!',
        type: 'success',
        lastSync: new Date(),
        details: 'Demo mode - Ready to save data',
      });
      resolve(true);
    }, 1500);
  });
};

export const saveDataToGoogle = async (type, data, sheetConfig, setSyncStatus) => {
  if (!sheetConfig.enabled || !sheetConfig.isConfigured) return;

  setSyncStatus({
    message: 'Saving to Google Sheets...',
    type: 'loading',
    lastSync: new Date(),
    details: `Saving ${type} (${data.length} items)`,
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      setSyncStatus({
        message: '✓ Saved to Google Sheets',
        type: 'success',
        lastSync: new Date(),
        details: `${type} saved successfully (demo)`,
      });
      setTimeout(() => {
        setSyncStatus((prev) => (prev.type === 'success' ? { ...prev, message: '', details: '' } : prev));
      }, 3000);
      resolve(true);
    }, 1000);
  });
};

export const syncAllToGoogle = async (allData, sheetConfig, setSyncStatus) => {
  if (!sheetConfig.enabled || !sheetConfig.isConfigured) {
    alert('Please configure Google Sheets first');
    return;
  }

  setSyncStatus({
    message: 'Syncing all data...',
    type: 'loading',
    lastSync: new Date(),
    details: 'Please wait',
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      setSyncStatus({
        message: '✓ All data synced',
        type: 'success',
        lastSync: new Date(),
        details: 'Data backed up to Google Sheets (demo)',
      });
      setTimeout(() => {
        setSyncStatus((prev) => (prev.type === 'success' ? { ...prev, message: '', details: '' } : prev));
      }, 3000);
      resolve(true);
    }, 2000);
  });
};
