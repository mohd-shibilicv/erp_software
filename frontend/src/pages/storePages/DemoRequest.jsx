import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";


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

function ClientDetails({ client, onBack }) {
    if (!client) {
        return <div>Client not found</div>;
    }
    const [assignTo, setAssignTo] = useState(client.assignedTo || '');
    const [status, setStatus] = useState(client.status || 'Pending');
    const dummyNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Brown'];
    const statusOptions = ['Pending', 'Approved', 'Cancelled'];

    return (
        <div className="max-w-7xl mx-auto p-7 bg-gray-50 shadow-lg rounded-lg">
            <div className="mb-6">
                <a className="text-violet-500 hover:underline cursor-pointer" onClick={onBack}>Home</a>
                <span className="mx-2 text-gray-500">/</span>
                <span className="text-gray-700">{client.clientName}</span>
            </div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">Client Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                    <div className="flex">
                        <span className="font-semibold w-1/3">Name:</span>
                        <span className="w-2/3">{client.clientName}</span>
                    </div>
                    <div className="flex">
                        <span className="font-semibold w-1/3">Email:</span>
                        <span className="w-2/3">{client.email}</span>
                    </div>
                    <div className="flex">
                        <span className="font-semibold w-1/3">Number:</span>
                        <span className="w-2/3">{client.number}</span>
                    </div>
                    <div className="flex">
                        <span className="font-semibold w-1/3">Company:</span>
                        <span className="w-2/3">{client.companyName}</span>
                    </div>
                    <div className="flex">
                        <span className="font-semibold w-1/3">Schedule Date:</span>
                        <span className="w-2/3">{client.scheduleDate}</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex">
                        <span className="font-semibold w-1/3">Company Size:</span>
                        <span className="w-2/3">{client.companySize}</span>
                    </div>
                    <div className="flex">
                        <span className="font-semibold w-1/3">Platform:</span>
                        <span className="w-2/3">{client.platform}</span>
                    </div>
                    <div className="flex">
                        <span className="font-semibold w-1/3">Type of Service:</span>
                        <span className="w-2/3">{client.serviceType}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-1/3">Assign To:</span>
                        <select
                            className="w-1/3 p-2 shadow-md"
                            value={assignTo}
                            onChange={(e) => setAssignTo(e.target.value)}
                        >
                            <option value="">Select a person</option>
                            {dummyNames.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold w-1/3">Status:</span>
                        <select
                            className="w-1/3 p-2 shadow-md"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {statusOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="mb-8">
                <h3 className="font-semibold mb-3">More Details About the Project</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                    {client.projectDetails} Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishin
                </p>
            </div>
            <div
                onClick={onBack}
                className="cursor-pointer text-violet-500 px-1"
            >
                Back to list
            </div>
        </div>
    );
}
