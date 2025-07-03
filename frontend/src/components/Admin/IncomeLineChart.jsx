import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../../config/axiosinstance";

const IncomeLineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await api.get('/admin/income-summary', { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch income data", err);
      }
    };

    fetchIncome();
  }, []);

  return (
    <div className="w-full h-80 bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Income</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="income" stroke="#06b6d4" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeLineChart;
