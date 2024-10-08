/* eslint-disable react/prop-types */
export const StatCard = ({ title, value, bgColor }) => (
    <div
      to={
        title == "Total Employees"
          ? "/employees/emp-list"
          : `/employees/dashboard-details?detailType=${title}`
      }
      className={`${bgColor} rounded-xl shadow-lg p-5 text-white`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
  