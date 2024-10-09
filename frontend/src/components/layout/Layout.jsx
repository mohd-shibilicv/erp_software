import { useSelector } from 'react-redux';
import BranchSidebar from './BranchSidebar';
import StoreSidebar from './StoreSidebar';
import { Link } from 'react-router-dom';

const TopHeader = () => {
  // This is a placeholder for actual data fetching logic
  const insights = [
    { title: 'New Clients', value: 5, color: 'blue', icon: 'user-plus', link: '/admin/client-relationship' },
    { title: 'Total Customers', value: 120, color: 'green', icon: 'users', link: '/admin' },
    { title: 'Active Projects', value: 8, color: 'yellow', icon: 'briefcase', link: '/admin/projects' },
    { title: 'Pending Quotes', value: 3, color: 'red', icon: 'file-text', link: '/admin/quotation' },
    { title: 'Revenue', value: '$12,345', color: 'indigo', icon: 'dollar-sign', link: '/admin' },
    { title: 'Tasks Due', value: 15, color: 'orange', icon: 'calendar', link: '/admin/tasks' },
  ];

  return (
    <header className="bg-white shadow-sm py-[2.5px] px-4 sm:px-6 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {insights.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-1 hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="flex items-center w-full">
                <span className={`text-${item.color}-500 mr-2 group-hover:text-${item.color}-600`}>
                  <i className={`fas fa-${item.icon}`}></i>
                </span>
                <div className="flex-grow">
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{item.title}</p>
                  <p className={`text-sm font-bold text-${item.color}-600 group-hover:text-${item.color}-700`}>{item.value}</p>
                </div>
                <span className="text-gray-400 group-hover:text-gray-600">
                  <i className="fas fa-chevron-right text-xs"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-gray-100">
      {user.role === 'admin' || user.role === 'staff' ? <StoreSidebar /> : <BranchSidebar />}      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
