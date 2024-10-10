import { useSelector } from 'react-redux';
import BranchSidebar from './BranchSidebar';
import StoreSidebar from './StoreSidebar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Users, Briefcase, FileText, DollarSign, Calendar } from 'lucide-react';

const TopHeader = () => {
  const insights = [
    { title: 'New Clients', value: 5, color: 'blue', icon: UserPlus, link: '/admin/client-relationship' },
    { title: 'Total Customers', value: 120, color: 'green', icon: Users, link: '/admin' },
    { title: 'Active Projects', value: 8, color: 'yellow', icon: Briefcase, link: '/admin/projects' },
    { title: 'Pending Quotes', value: 3, color: 'red', icon: FileText, link: '/admin/quotation' },
    { title: 'Revenue', value: '$12,345', color: 'indigo', icon: DollarSign, link: '/admin' },
    { title: 'Tasks Due', value: 15, color: 'orange', icon: Calendar, link: '/admin/tasks' },
  ];

  const iconVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, 15, 0, -15, 0], 
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } 
    }
  };

  return (
    <header className="bg-white shadow-sm py-[8.5px] px-4 sm:px-6 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {insights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item.link}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-1 hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="flex items-center w-full">
                  <div className="flex-grow">
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{item.title}</p>
                    <p className={`text-sm font-bold text-${item.color}-600 group-hover:text-${item.color}-700`}>{item.value}</p>
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-600">
                    <i className="fas fa-chevron-right text-xs"></i>
                  </span>
                </div>
                <motion.span 
                    className={`text-${item.color}-500 mr-2 group-hover:text-${item.color}-600`}
                    variants={iconVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <item.icon size={16} />
                  </motion.span>
              </Link>
            </motion.div>
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
