import TransactionList from "../components/TransactionList/TransactionList";
import { useNavigate } from "react-router";

const Transactions = () => {
  const navigate = useNavigate();
  return (
    <TransactionList
      onAdd={() => navigate("/add")}
      onEdit={(id) => navigate(`/edit/${id}`)}
    />
  );
};

export default Transactions;


