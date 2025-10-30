import TransactionForm from "../components/TransactionForm/TransactionForm";
import { useNavigate } from "react-router";

const AddTransaction = () => {
  const navigate = useNavigate();
  return (
    <TransactionForm
      transactionId={null}
      onSave={() => navigate(-1)}
      onCancel={() => navigate(-1)}
    />
  );
};

export default AddTransaction;


