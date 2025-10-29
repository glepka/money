import { useThemeStore } from "../../store/themeStore";
import { useTheme } from "../../hooks/useTheme";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const theme = useTheme();
  const telegramTheme = useTelegramTheme();

  // Определяем, темная ли текущая тема Telegram
  const isTelegramDark = () => {
    const bgColor = telegramTheme.bgColor || "#ffffff";
    let hex = bgColor.replace("#", "");

    // Поддержка 3-символьных hex-кодов
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const handleToggle = () => {
    let currentMode = themeMode;

    // Если тема еще Telegram, определяем по текущей теме Telegram, какая должна быть
    if (themeMode === "telegram") {
      currentMode = isTelegramDark() ? "dark" : "light";
    }

    // Переключаем между light и dark
    const newMode = currentMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
  };

  // Определяем, темная ли текущая тема
  const isDark =
    themeMode === "telegram" ? isTelegramDark() : themeMode === "dark";

  // Определяем позицию слайдера
  // Контейнер: 52px, шарик: 24px, отступы: 4px слева и справа
  // Максимальная позиция: 52px - 4px (right) - 24px (ширина) = 24px
  // translateX: 24px - 4px (начальный left) = 20px
  const sliderPosition = isDark ? "20px" : "0px";

  return (
    <div className={styles.toggleContainer}>
      <span className={styles.label} style={{ color: theme.textColor }}>
        {isDark ? "Темная тема" : "Светлая тема"}
      </span>
      <button
        className={styles.toggle}
        onClick={handleToggle}
        style={{
          backgroundColor: isDark ? theme.buttonColor : "#ccc",
        }}
        aria-label="Переключить тему"
      >
        <span
          className={styles.slider}
          style={{
            transform: `translateX(${sliderPosition})`,
          }}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
