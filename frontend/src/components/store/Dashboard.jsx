"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import {
  AlertCircle,
  ArrowDownIcon,
  ArrowUpIcon,
  PieChart as PieChartIcon,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";

// const fetchDashboardData = async (period) => {
//   try {
//     const response = await api.get(`/dashboard/?period=${period}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dashboard data:', error);
//     throw error;
//   }
// };

// Simulated API call
const fetchDashboardData = async (period) => {
  // Simulated data
  return {
    total_products: 1500,
    total_branches: 25,
    total_inflow: 5000,
    total_inflow_value: 250000,
    total_outflow: 4800,
    total_outflow_value: 240000,
    top_products: [
      { name: "Product A", total_outflow: 1200 },
      { name: "Product B", total_outflow: 950 },
      { name: "Product C", total_outflow: 800 },
      { name: "Product D", total_outflow: 650 },
      { name: "Product E", total_outflow: 500 },
    ],
    branch_stock: [
      { branch__name: "Branch 1", total_stock: 500 },
      { branch__name: "Branch 2", total_stock: 450 },
      { branch__name: "Branch 3", total_stock: 400 },
      { branch__name: "Branch 4", total_stock: 350 },
      { branch__name: "Branch 5", total_stock: 300 },
    ],
    expired_products: [
      { product__name: "Jan", total_expired: 50 },
      { product__name: "Feb", total_expired: 40 },
      { product__name: "Mar", total_expired: 60 },
      { product__name: "Apr", total_expired: 30 },
      { product__name: "May", total_expired: 45 },
    ],
    low_stock_products: 15,
    inventory_turnover: 4.8,
    revenue_trend: [
      { month: "Jan", revenue: 50000 },
      { month: "Feb", revenue: 55000 },
      { month: "Mar", revenue: 48000 },
      { month: "Apr", revenue: 52000 },
      { month: "May", revenue: 58000 },
    ],
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardData(period);
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [period]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Inventory Analytics Dashboard
        </h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Products"
          value={dashboardData.total_products}
          icon={<Package className="h-6 w-6 text-blue-500" />}
          description="Current inventory size"
          onClick={() => navigate("/admin/products")}
        />
        <StatCard
          title="Total Branches"
          value={dashboardData.total_branches}
          icon={<PieChartIcon className="h-6 w-6 text-green-500" />}
          description="Number of active locations"
          onClick={() => navigate("/admin/branches")}
        />
        <StatCard
          title="Total Inflow"
          value={`${dashboardData.total_inflow} units`}
          subValue={`$${dashboardData.total_inflow_value.toFixed(2)}`}
          icon={<ArrowDownIcon className="h-6 w-6 text-green-600" />}
          description="Products received"
          onClick={() => navigate("/admin/product-inflow")}
        />
        <StatCard
          title="Total Outflow"
          value={`${dashboardData.total_outflow} units`}
          subValue={`$${dashboardData.total_outflow_value.toFixed(2)}`}
          icon={<ArrowUpIcon className="h-6 w-6 text-red-600" />}
          description="Products dispatched"
          onClick={() => navigate("/admin/product-outflow")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Products by Outflow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.top_products} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_outflow" fill="#8884d8" name="Units Sold">
                    {dashboardData.top_products.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Branch Stock Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.branch_stock}
                    dataKey="total_stock"
                    nameKey="branch__name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {dashboardData.branch_stock.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Expired Products Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.expired_products}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product__name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total_expired"
                    stroke="#FF8042"
                    fill="#FF8042"
                    name="Expired Units"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.revenue_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Inventory Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Low Stock Products
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      {dashboardData.low_stock_products}
                    </span>
                  </div>
                  <Progress
                    value={
                      (dashboardData.low_stock_products /
                        dashboardData.total_products) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Expired Products
                    </span>
                    <span className="text-sm font-medium text-yellow-600">
                      {dashboardData.expired_products.reduce(
                        (sum, item) => sum + item.total_expired,
                        0
                      )}
                    </span>
                  </div>
                  <Progress
                    value={
                      (dashboardData.expired_products.reduce(
                        (sum, item) => sum + item.total_expired,
                        0
                      ) /
                        dashboardData.total_products) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Inventory Turnover</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px]">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">
                    {dashboardData.inventory_turnover.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Times per year</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  Top selling product: {dashboardData.top_products[0]?.name || 'N/A'}
                </li>
                <li className="flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                  {((dashboardData.low_stock_products / dashboardData.total_products) * 100).toFixed(1)}% of products are low in stock
                </li>
                <li className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 text-yellow-500 mr-2" />
                  {dashboardData.revenue_trend.length > 1 ? (
                    `Revenue ${
                      dashboardData.revenue_trend[dashboardData.revenue_trend.length - 1].revenue >
                      dashboardData.revenue_trend[0].revenue
                        ? 'increased'
                        : 'decreased'
                    } by ${(
                      ((dashboardData.revenue_trend[dashboardData.revenue_trend.length - 1].revenue -
                        dashboardData.revenue_trend[0].revenue) /
                        dashboardData.revenue_trend[0].revenue) *
                      100
                    ).toFixed(1)}% over the period`
                  ) : (
                    'Insufficient data for revenue trend'
                  )}
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue, icon, description, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="cursor-pointer"
    onClick={onClick}
  >
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 max-h-[20px] pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* {subValue && (
          <div className="text-xs text-muted-foreground">{subValue}</div>
        )} */}
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

export default Dashboard;