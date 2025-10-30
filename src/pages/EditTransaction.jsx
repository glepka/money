import TransactionForm from "../components/TransactionForm/TransactionForm";
import { useNavigate, useParams } from "react-router";

const EditTransaction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <TransactionForm
      transactionId={id}
      onSave={() => navigate(-1)}
      onCancel={() => navigate(-1)}
    />
  );
};

export default EditTransaction;


