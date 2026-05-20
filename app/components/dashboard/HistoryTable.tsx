export default function HistoryTable() {

  const data = [
    { date: "2026-05-01", poids: 75, bmi: 26 },
    { date: "2026-05-05", poids: 73, bmi: 25 },
    { date: "2026-05-10", poids: 70, bmi: 24 }
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-xl">

      <h2 className="mb-4 text-lg">📋 History</h2>

      <table className="w-full text-left">

        <thead className="text-gray-400">
          <tr>
            <th>Date</th>
            <th>Weight</th>
            <th>BMI</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-t border-gray-800">
              <td>{item.date}</td>
              <td>{item.poids} kg</td>
              <td>{item.bmi}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
