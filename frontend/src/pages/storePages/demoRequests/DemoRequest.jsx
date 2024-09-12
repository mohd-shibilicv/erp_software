import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import ClientDetails from './ClientDetails';


const dummyClients = [
    {
        id: 1,
        clientName: "John Doe",
        email: "john@example.com",
        number: "123-456-7890",
        companyName: "Acme Inc.",
        scheduleDate: "2023-09-15 03:30 AM",
        companySize: "50-100 employees",
        platform: "Web",
        serviceType: "Full-stack Development",
        projectDetails: "Lorem ipsum dolor sit amet...",
        assignedTo: "Jane Smith",
        status: "Pending"
    },
    {
        id: 2,
        clientName: 'Jane Smith',
        email: 'jane@example.com',
        number: '0987654321',
        companyName: 'XYZ Inc',
        scheduleDate: '2024-09-16 02:30 PM',
        companySize: "50-100 employees",
        platform: "Web",
        serviceType: "Full-stack Development",
        projectDetails: "Lorem ipsum dolor sit amet...",
        assignedTo: "Jane Smith",
        status: "Pending"
    },
    {
        id: 3,
        clientName: 'Alice Brown',
        email: 'alice@example.com',
        number: '5555555555',
        companyName: 'LMN Ltd',
        scheduleDate: '2024-09-17 01:00 PM',
        companySize: "50-100 employees",
        platform: "Web",
        serviceType: "Full-stack Development",
        projectDetails: "Lorem ipsum dolor sit amet...",
        assignedTo: "Jane Smith",
        status: "Pending"
    },
];

export default function DemoRequest() {
    const [data, setData] = useState(dummyClients);
    const [filterValue, setFilterValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);

    const handleClearDates = () => {
        setStartDate("");
        setEndDate("");
    };

    const columns = [
        {
            id: 'clientName',
            header: 'Client Name',
            accessorKey: 'clientName',
            cell: ({ row }) => <span>{row.original.clientName}</span>,
        },
        {
            id: 'email',
            header: 'Email',
            accessorKey: 'email',
            cell: ({ row }) => <span>{row.original.email}</span>,
        },
        {
            id: 'number',
            header: 'Number',
            accessorKey: 'number',
            cell: ({ row }) => <span>{row.original.number}</span>,
        },
        {
            id: 'companyName',
            header: 'Company Name',
            accessorKey: 'companyName',
            cell: ({ row }) => <span>{row.original.companyName}</span>,
        },
        {
            id: 'scheduleDate',
            header: 'Schedule Date',
            accessorKey: 'scheduleDate',
            cell: ({ row }) => (
                <div>
                    <p>{row.original.scheduleDate}</p>
                </div>
            ),
        },

        {
            id: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <button
                    className="text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-50 text-sm"
                    onClick={() => handleView(row.original.id)}
                >
                    View
                </button>
            ),
        },
    ];

    const handleView = (id) => {
        const client = data.find(c => c.id === id);
        setSelectedClient(client);
    };

    const handleBack = () => {
        setSelectedClient(null);
    };

    if (selectedClient) {
        return <ClientDetails client={selectedClient} onBack={handleBack} />;
    }
    const filteredData = data.filter(
        (client) => {
            const matchesText =
                client.clientName.toLowerCase().includes(filterValue.toLowerCase()) ||
                client.email.toLowerCase().includes(filterValue.toLowerCase()) ||
                client.number.includes(filterValue) ||
                client.companyName.toLowerCase().includes(filterValue.toLowerCase());

            const clientDate = new Date(client.scheduleDate);
            const isAfterStartDate = startDate ? clientDate >= new Date(startDate) : true;
            const isBeforeEndDate = endDate ? clientDate <= new Date(endDate) : true;

            return matchesText && isAfterStartDate && isBeforeEndDate;
        }
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Demo Request Lists</h1>
            <div className="mb-4 flex flex-wrap gap-4 items-end">
                <div className="relative">
                    <input
                        placeholder="Filter clients..."
                        value={filterValue}
                        onChange={(event) => setFilterValue(event.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-full"
                    />
                    {filterValue && (
                        <button
                            onClick={() => setFilterValue('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            &#x2715;
                        </button>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        className="border border-gray-300 p-2 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        className="border border-gray-300 p-2 rounded-lg"
                    />
                </div>
                {(startDate || endDate) && (
                    <div>
                        <button
                            onClick={handleClearDates}
                            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm"
                        >
                            Clear Dates
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <table className="min-w-full border-collapse block md:table border border-gray-200">
                <thead className="block md:table-header-group">
                    <tr className="border-b border-gray-200 block md:table-row">
                        {columns.map((column) => (
                            <th key={column.id} className="p-5 text-left block md:table-cell">
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="block md:table-row-group">
                    {filteredData.map((client, index) => (
                        <tr
                            key={client.id}
                            className={`block md:table-row ${index !== filteredData.length - 1 ? 'border-b border-gray-200' : ''
                                }`}
                        >
                            {columns.map((column) => (
                                <td key={column.id} className="p-4 block md:table-cell">
                                    {column.cell({ row: { original: client } })}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end space-x-2 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick=""
                    disabled=""
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick=""
                    disabled=""
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
