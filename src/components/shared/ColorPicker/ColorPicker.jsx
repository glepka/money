import { useTheme } from "../../../hooks/useTheme";
import styles from "./ColorPicker.module.css";

const ColorPicker = ({ value, onChange }) => {
  const theme = useTheme();

  const presetColors = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#9C27B0",
    "#E91E63",
    "#F44336",
    "#607D8B",
    "#795548",
    "#009688",
    "#00BCD4",
    "#FFEB3B",
    "#FF5722",
    "#3F51B5",
    "#FFC107",
    "#CDDC39",
  ];

  const handleColorChange = (e) => {
    onChange(e.target.value);
  };

  const handlePresetClick = (color) => {
    onChange(color);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainPicker}>
        <label className={styles.label}>Цвет</label>
        <div className={styles.pickerRow}>
          <input
            type="color"
            value={value || "#999999"}
            onChange={handleColorChange}
            className={styles.colorInput}
            title="Выбрать цвет"
          />
          <input
            type="text"
            value={value || "#999999"}
            onChange={handleColorChange}
            placeholder="#999999"
            className={styles.colorTextInput}
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
              border: `1px solid ${theme.hintColor}30`,
            }}
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          />
        </div>
      </div>
      <div className={styles.presetColors}>
        <label className={styles.presetLabel}>Быстрый выбор</label>
        <div className={styles.colorsGrid}>
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handlePresetClick(color)}
              className={`${styles.colorButton} ${
                value === color ? styles.selected : ""
              }`}
              style={{
                backgroundColor: color,
                borderColor: value === color ? theme.textColor : "transparent",
              }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
