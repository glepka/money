import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import styles from "./FloatingAddButton.module.css";

const FloatingAddButton = ({ onClick }) => {
  const theme = useTelegramTheme();

  return (
    <button
      className={styles.addButton}
      onClick={onClick}
      style={{
        backgroundColor: theme.buttonColor,
        color: theme.buttonTextColor,
      }}
      aria-label="Добавить транзакцию"
    >
      +
    </button>
  );
};

export default FloatingAddButton;

