import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../../config/axiosinstance';

const COLORS = ['#06b6d4', '#10b981', '#f59e0b'];

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState([]);
  const [vehicleStats, setVehicleStats] = useState([]);
  const [vehicleApprovalStats, setVehicleApprovalStats] = useState([]);
  const [overview, setOverview] = useState({ users: 0, hosts: 0, pending: 0, vehicles: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: overviewData } = await api.get('/admin/overview', { withCredentials: true });
        const { data: userStatsData } = await api.get('/admin/user-stats', { withCredentials: true });
        const { data: vehicleStatsData } = await api.get('/admin/vehicle-stats', { withCredentials: true });
        const { data: vehicleApprovalData } = await api.get('/admin/vehicle-approval-stats', { withCredentials: true });
        setOverview(overviewData);
        setUserStats(userStatsData);
        setVehicleStats(vehicleStatsData);
        setVehicleApprovalStats(vehicleApprovalData)
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent>
            <h4 className="text-lg font-semibold text-gray-600">Total Users</h4>
            <p className="text-3xl font-bold text-cyan-600">{overview.users}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent>
            <h4 className="text-lg font-semibold text-gray-600">Total Hosts</h4>
            <p className="text-3xl font-bold text-emerald-600">{overview.hosts}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent>
            <h4 className="text-lg font-semibold text-gray-600">Pending Vehicles</h4>
            <p className="text-3xl font-bold text-yellow-500">{overview.pending}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent>
            <h4 className="text-lg font-semibold text-gray-600">Total Vehicles</h4>
            <p className="text-3xl font-bold text-blue-600">{overview.vehicles}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h4 className="text-lg font-semibold mb-4">Monthly Users & Hosts</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userStats}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#06b6d4" name="Users" />
                <Bar dataKey="hosts" fill="#10b981" name="Hosts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h4 className="text-lg font-semibold mb-4">Vehicle Status Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleStats}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {vehicleStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h4 className="text-lg font-semibold mb-4">Vehicle Approval Status</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleApprovalStats}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {vehicleApprovalStats.map((entry, index) => (
                    <Cell key={`approval-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actions Section Placeholder */}
      <div className="mt-6">
        <h4 className="text-xl font-semibold mb-4">Quick Actions</h4>
        <div className="flex gap-4 flex-wrap">
          <Button variant="default">Manage Users</Button>
          <Button variant="default">Review Vehicles</Button>
          <Button variant="default">Send Announcement</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
