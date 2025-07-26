import { useState, useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useSession } from "next-auth/react";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const { data: session } = useSession();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };
  useEffect(() => {
    //console.log(session);
    const fetchTransactions = async () => {
      if (session?.user) {
        try {
          const response = await axios.get(
            "https://admin.xpertbid.com/api/wallet/transactions",
            {
              headers: {
                Authorization: `Bearer ${session.user.token}`,
              },
            }
          );
          setTransactions(response.data);
        } catch (error) {
          console.error("Error fetching transactions", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [session]);
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading ? (
        // Show loader while loading
        <div className="loader-container">
          <Oval
            height={80}
            width={80}
            color="#3498db"
            secondaryColor="#f3f3f3"
            ariaLabel="loading-indicator"
          />
        </div>
      ) : (
        <div>

<div className="transections ">
                                <h3 className="heading">Recent Transactions</h3>
                                <form action>
                                    <select name id>
                                        <option value>Most Recent</option>
                                        <option value>Last 7 Days</option>
                                        <option value>Last Month</option>
                                    </select>
                                </form>
                            </div>

          <table id="wallet" className="table table-striped">
            <thead style={{backgroundColor:"transparent"}}>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.status}</td>
                  <td>{formatDate(transaction.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <style jsx>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
      `}</style>
    </>
  );
};

export default TransactionHistory;
