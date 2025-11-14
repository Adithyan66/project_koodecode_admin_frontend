// Example usage of the generic Table component for different data types

import  { type TableColumn } from './Table';

// Example 1: Users table
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

const usersTableColumns: TableColumn<User>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    className: 'font-medium'
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    className: 'text-slate-600 dark:text-slate-400'
  },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    render: (value: string) => (
      <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
        {value}
      </span>
    )
  },
  {
    key: 'isActive',
    label: 'Status',
    render: (value: boolean) => (
      <span className={`px-2 py-1 rounded text-xs ${
        value 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {value ? 'Active' : 'Inactive'}
      </span>
    )
  }
];

// Example 2: Orders table
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: string;
}

const ordersTableColumns: TableColumn<Order>[] = [
  {
    key: 'orderNumber',
    label: 'Order #',
    sortable: true,
    className: 'font-mono'
  },
  {
    key: 'customerName',
    label: 'Customer',
    sortable: true
  },
  {
    key: 'total',
    label: 'Total',
    sortable: true,
    render: (value: number) => `$${value.toFixed(2)}`,
    className: 'font-mono'
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (value: string) => (
      <span className={`px-2 py-1 rounded text-xs capitalize ${
        value === 'completed' ? 'bg-green-100 text-green-800' :
        value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )
  }
];

// Example usage in components:
/*
// Users component
function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  return (
    <Table
      data={users}
      columns={usersTableColumns}
      loading={loading}
      onRowClick={(user) => navigate(`/users/${user.id}`)}
      emptyMessage="No users found"
    />
  );
}

// Orders component  
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  
  return (
    <Table
      data={orders}
      columns={ordersTableColumns}
      loading={loading}
      onRowClick={(order) => navigate(`/orders/${order.id}`)}
      emptyMessage="No orders found"
    />
  );
}
*/

export { usersTableColumns, ordersTableColumns };
export type { User, Order };
