import { useState } from "react";
import { Link } from "react-router";
import { useTheme } from "../../hooks/useTheme";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import styles from "./FloatingMenu.module.css";

const FloatingMenu = () => {
  const theme = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => handleMenuClose();

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
            <Link
              to="/transactions"
              className={styles.menuItem}
              onClick={handleLinkClick}
              style={{ color: theme.textColor }}
            >
              📋 Транзакции
            </Link>
            <Link
              to="/statistics"
              className={styles.menuItem}
              onClick={handleLinkClick}
              style={{ color: theme.textColor }}
            >
              📊 Статистика
            </Link>
            <Link
              to="/budgets"
              className={styles.menuItem}
              onClick={handleLinkClick}
              style={{ color: theme.textColor }}
            >
              💰 Бюджеты
            </Link>
            <Link
              to="/categories"
              className={styles.menuItem}
              onClick={handleLinkClick}
              style={{ color: theme.textColor }}
            >
              🏷️ Категории
            </Link>
            <Link
              to="/currencies"
              className={styles.menuItem}
              onClick={handleLinkClick}
              style={{ color: theme.textColor }}
            >
              💱 Валюты
            </Link>
            <Link
              to="/export"
              className={styles.menuItem}
              onClick={handleLinkClick}
              style={{ color: theme.textColor }}
            >
              📤 Экспорт
            </Link>
            <div
              style={{
                borderTop: `1px solid ${theme.hintColor}20`,
                marginTop: "8px",
                paddingTop: "8px",
              }}
            >
              <ThemeToggle />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingMenu;
