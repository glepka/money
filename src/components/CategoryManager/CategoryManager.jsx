import { useState } from "react";
import { useCategoryStore } from "../../store/categoriesStore";
import { useTheme } from "../../hooks/useTheme";
import CategoryBadge from "../shared/CategoryBadge/CategoryBadge";
import ColorPicker from "../shared/ColorPicker/ColorPicker";
import styles from "./CategoryManager.module.css";

const CategoryManager = ({ onBack }) => {
  const theme = useTheme();
  const categories = useCategoryStore((state) => state.categories);
  const addCategory = useCategoryStore((state) => state.addCategory);
  const updateCategory = useCategoryStore((state) => state.updateCategory);
  const removeCategory = useCategoryStore((state) => state.removeCategory);
  const getSubcategories = useCategoryStore((state) => state.getSubcategories);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    icon: "📁",
    color: "#999999",
    parentId: null,
  });

  const incomeCategories = categories.filter(
    (c) => c.type === "income" && !c.parentId
  );
  const expenseCategories = categories.filter(
    (c) => c.type === "expense" && !c.parentId
  );

  const handleAdd = () => {
    setFormData({
      name: "",
      type: "expense",
      icon: "📁",
      color: "#999999",
      parentId: null,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setFormData({ ...category });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;

    if (editingId) {
      await updateCategory(editingId, formData);
    } else {
      await addCategory(formData);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      type: "expense",
      icon: "📁",
      color: "#999999",
      parentId: null,
    });
  };

  const handleDelete = async (id) => {
    const subcats = getSubcategories(id);
    const category = categories.find((c) => c.id === id);
    let message =
      "Удалить категорию? Все связанные транзакции останутся без категории.";

    if (subcats.length > 0) {
      message = `Удалить категорию "${category?.name}"? Это также удалит ${
        subcats.length
      } подкатегори${
        subcats.length === 1 ? "ю" : "й"
      }. Все связанные транзакции останутся без категории.`;
    }

    if (confirm(message)) {
      // Удаляем сначала все подкатегории
      for (const subcat of subcats) {
        await removeCategory(subcat.id);
      }
      // Затем удаляем саму категорию
      await removeCategory(id);
    }
  };

  const handleAddSubcategory = (parentCategory) => {
    setFormData({
      name: "",
      type: parentCategory.type,
      icon: "📁",
      color: parentCategory.color,
      parentId: parentCategory.id,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const icons = ["📁", "💰", "💵", "🍔", "🚗", "🛒", "💳", "📦", "🏠", "🎮"];

  const renderCategoryList = (cats, type) => (
    <div className={styles.categorySection}>
      <h3 className={styles.sectionTitle}>
        {type === "income" ? "Доходы" : "Расходы"}
      </h3>
      {cats.map((cat) => {
        const subcats = getSubcategories(cat.id);
        return (
          <div key={cat.id} className={styles.categoryItem}>
            <div
              className={styles.categoryCard}
              style={{
                backgroundColor: theme.secondaryBgColor,
              }}
            >
              <CategoryBadge category={cat} />
              <div className={styles.categoryInfo}>
                <div className={styles.categoryName}>{cat.name}</div>
                {subcats.length > 0 && (
                  <div className={styles.subcategoriesCount}>
                    {subcats.length} подкатегори
                    {subcats.length === 1 ? "я" : "й"}
                  </div>
                )}
              </div>
              <div className={styles.categoryActions}>
                <button
                  onClick={() => handleAddSubcategory(cat)}
                  style={{ color: theme.linkColor }}
                  title="Добавить подкатегорию"
                >
                  ➕
                </button>
                <button
                  onClick={() => handleEdit(cat)}
                  style={{ color: theme.linkColor }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  style={{ color: "#F44336" }}
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className={styles.subcategories}>
              {subcats.length > 0 && (
                <>
                  {subcats.map((sub) => (
                    <div
                      key={sub.id}
                      className={styles.subcategoryItem}
                      style={{
                        backgroundColor: theme.bgColor,
                      }}
                    >
                      <CategoryBadge category={sub} />
                      <span className={styles.subcategoryName}>{sub.name}</span>
                      <button
                        onClick={() => handleEdit(sub)}
                        style={{ color: theme.linkColor }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        style={{ color: "#F44336" }}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Категории</h2>
        <button
          onClick={handleAdd}
          className={styles.addButton}
          style={{
            backgroundColor: theme.buttonColor,
            color: theme.buttonTextColor,
          }}
        >
          + Добавить
        </button>
      </div>

      {showForm && (
        <div
          className={styles.form}
          style={{
            backgroundColor: theme.secondaryBgColor,
          }}
        >
          <input
            type="text"
            placeholder="Название категории"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
            }}
          />
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
                parentId:
                  formData.parentId && !editingId ? null : formData.parentId,
              })
            }
            disabled={!!formData.parentId}
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
            }}
          >
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
          {!editingId && (
            <select
              value={formData.parentId || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parentId: e.target.value || null,
                  type: e.target.value
                    ? categories.find((c) => c.id === e.target.value)?.type ||
                      formData.type
                    : formData.type,
                })
              }
              style={{
                backgroundColor: theme.bgColor,
                color: theme.textColor,
              }}
            >
              <option value="">Категория верхнего уровня</option>
              {categories
                .filter((c) => !c.parentId && c.type === formData.type)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
            </select>
          )}
          {formData.parentId && editingId && (
            <div className={styles.parentInfo}>
              Родительская категория:{" "}
              {categories.find((c) => c.id === formData.parentId)?.name || ""}
            </div>
          )}
          <div className={styles.iconSelector}>
            <label>Иконка (эмодзи)</label>
            <div className={styles.emojiInput}>
              <input
                type="text"
                placeholder="Введите эмодзи"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                maxLength={2}
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.textColor,
                  fontSize: "24px",
                  textAlign: "center",
                  padding: "12px",
                }}
              />
            </div>
            <div className={styles.icons}>
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={formData.icon === icon ? styles.selected : ""}
                  style={{
                    backgroundColor: theme.bgColor,
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <ColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
          />
          <div className={styles.formActions}>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      {renderCategoryList(incomeCategories, "income")}
      {renderCategoryList(expenseCategories, "expense")}
    </div>
  );
};

export default CategoryManager;
