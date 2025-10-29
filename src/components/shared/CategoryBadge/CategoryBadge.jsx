import styles from "./CategoryBadge.module.css";

const CategoryBadge = ({ category }) => {
  if (!category) {
    return (
      <div
        className={styles.badge}
        style={{
          backgroundColor: "#999999",
        }}
      >
        ?
      </div>
    );
  }

  return (
    <div
      className={styles.badge}
      style={{
        backgroundColor: category.color || "#999999",
      }}
      title={category.name}
    >
      {category.icon || "📁"}
    </div>
  );
};

export default CategoryBadge;

