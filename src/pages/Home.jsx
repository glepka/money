import BudgetList from "../components/BudgetList/BudgetList";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return <BudgetList onAdd={() => navigate("/add")} />;
};

export default Home;


