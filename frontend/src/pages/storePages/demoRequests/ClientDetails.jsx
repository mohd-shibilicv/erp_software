import React, { useState } from 'react';

function ClientDetails({ client, onBack }) {
  if (!client) {
    return <div>Client not found</div>;
  }
  const [assignTo, setAssignTo] = useState(client.assignedTo || "");
  const [status, setStatus] = useState(client.status || "Pending");
  const dummyNames = ["John Doe", "Jane Smith", "Mike Johnson", "Emily Brown"];
  const statusOptions = ["Pending", "Approved", "Cancelled"];

  return (
    <div className="max-w-7xl mx-auto p-7 bg-gray-50 shadow-lg rounded-lg">
      <div className="mb-6">
        <a
          className="text-violet-500 hover:underline cursor-pointer"
          onClick={onBack}
        >
          Home
        </a>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-700">{client.clientName}</span>
      </div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Client Details
      </h2>
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
                <option key={index} value={name}>
                  {name}
                </option>
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
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="font-semibold mb-3">More Details About the Project</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          {client.projectDetails} Lorem Ipsum is simply dummy text of the
          printing and typesetting industry. Lorem Ipsum has been the industry's
          standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has
          survived not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged. It was popularised in
          the 1960s with the release of Letraset sheets containing Lorem Ipsum
          passages, and more recently with desktop publishin
        </p>
      </div>
      <div onClick={onBack} className="cursor-pointer text-violet-500 px-1">
        Back to list
      </div>
    </div>
  );
}

export default ClientDetails;
