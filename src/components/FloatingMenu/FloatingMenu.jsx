import { useState } from "react";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import styles from "./FloatingMenu.module.css";

const FloatingMenu = ({
  onViewTransactions,
  onViewCategories,
  onViewStatistics,
  onViewBudgets,
  onViewCurrencies,
  onViewExport,
}) => {
  const theme = useTelegramTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleMenuItemClick = (handler) => {
    handler();
    handleMenuClose();
  };

  return (
    <>
      <button
        className={styles.menuButton}
        onClick={handleMenuToggle}
        style={{
          backgroundColor: theme.buttonColor,
          color: theme.buttonTextColor,
        }}
        aria-label="Меню"
      >
        ☰
      </button>
      {isMenuOpen && (
        <>
          <div className={styles.menuOverlay} onClick={handleMenuClose} />
          <div
            className={styles.menu}
            style={{
              backgroundColor: theme.secondaryBgColor || theme.bgColor,
              borderBottom: `1px solid ${theme.hintColor}20`,
            }}
          >
            <button
              className={styles.menuItem}
              onClick={() => handleMenuItemClick(onViewTransactions)}
              style={{
                color: theme.textColor,
              }}
            >
              📋 Транзакции
            </button>
            <button
              className={styles.menuItem}
              onClick={() => handleMenuItemClick(onViewStatistics)}
              style={{
                color: theme.textColor,
              }}
            >
              📊 Статистика
            </button>
            <button
              className={styles.menuItem}
              onClick={() => handleMenuItemClick(onViewBudgets)}
              style={{
                color: theme.textColor,
              }}
            >
              💰 Бюджеты
            </button>
            <button
              className={styles.menuItem}
              onClick={() => handleMenuItemClick(onViewCategories)}
              style={{
                color: theme.textColor,
              }}
            >
              🏷️ Категории
            </button>
            <button
              className={styles.menuItem}
              onClick={() => handleMenuItemClick(onViewCurrencies)}
              style={{
                color: theme.textColor,
              }}
            >
              💱 Валюты
            </button>
            <button
              className={styles.menuItem}
              onClick={() => handleMenuItemClick(onViewExport)}
              style={{
                color: theme.textColor,
              }}
            >
              📤 Экспорт
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingMenu;

