import { useCurrencyStore } from "../../store/currenciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTheme } from "../../hooks/useTheme";
import styles from "./CurrencySettings.module.css";

const CurrencySettings = ({ onBack }) => {
  const theme = useTheme();
  const currencies = useCurrencyStore((state) => state.currencies);
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const handleDefaultCurrencyChange = async (currency) => {
    await updateSettings({ defaultCurrency: currency });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Валюты</h2>
      </div>

      <div
        className={styles.section}
        style={{
          backgroundColor: theme.secondaryBgColor,
        }}
      >
        <h3 className={styles.sectionTitle}>Валюта по умолчанию</h3>
        <div className={styles.currencyList}>
          {currencies.map((currency) => (
            <label
              key={currency.code}
              className={styles.currencyItem}
              style={{
                backgroundColor:
                  settings.defaultCurrency === currency.code
                    ? theme.buttonColor
                    : "transparent",
                color:
                  settings.defaultCurrency === currency.code
                    ? theme.buttonTextColor
                    : theme.textColor,
              }}
            >
              <input
                type="radio"
                name="defaultCurrency"
                value={currency.code}
                checked={settings.defaultCurrency === currency.code}
                onChange={() => handleDefaultCurrencyChange(currency.code)}
              />
              <span className={styles.currencySymbol}>{currency.symbol}</span>
              <span className={styles.currencyCode}>{currency.code}</span>
              <span className={styles.currencyName}>{currency.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrencySettings;
