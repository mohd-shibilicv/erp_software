import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { clientQuotation } from '@/services/crmServiceApi';
import { Button } from '@/components/ui/button';

const AddEditQuotation = ({ quotation = {}, isEditMode = false }) => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate()
  const { id } = useParams();
  const [staffMembers, setStaffMembers] = useState([]);
  let sam = id
  const [formData, setFormData] = useState({
    quotation_number: quotation.quotation_number || '',
    version: quotation.version || 1,
    status: quotation.status || 'DRAFT',
    valid_until: quotation.valid_until || '',
    customer: quotation.customer || '',
    customer_reference: quotation.customer_reference || '',
    assigned_to: quotation.assigned_to || '',
    subtotal: quotation.subtotal || 0,
    discount_amount: quotation.discount_amount || 0,
    total_amount: quotation.total_amount || 0,
    notes: quotation.notes || '',
    terms_and_conditions: quotation.terms_and_conditions || '',
    requires_approval: quotation.requires_approval || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBack = () => {
    navigate("/admin/quotation");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      delete dataToSubmit.total_amount;
      delete dataToSubmit.client_name;
      let response;
      if (isEditMode) {
        console.log("this is updateee")
        response = await clientQuotation.update(sam, dataToSubmit);
      } else {
        console.log("this is posttt")
        response = await clientQuotation.create(dataToSubmit);
      }
      console.log("Successfully submitted:", response.data);
      navigate('/admin/quotation');
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };


  useEffect(() => {
    if (isEditMode) {
      const fetchQuotation = async () => {
        try {
          const response = await clientQuotation.get(sam);
          setFormData(prevState => ({
            ...prevState,
            ...response.data,
          }));
        } catch (error) {
          console.error('Error fetching quotation:', error);
        }
      };
      fetchQuotation();
    }
  }, [isEditMode]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await api.get('/clients/');
        setClients(clientResponse.data.results);
        const staffResponse = await api.get('/staff');
        setStaffMembers(staffResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-8xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-left">
          {isEditMode ? 'Edit Quotation' : 'Add New Quotation'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
              <input
                type="text"
                name="quotation_number"
                value={formData.quotation_number}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Version</label>
              <input
                type="number"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              >
                <option value="DRAFT">Draft</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="SENT">Sent to Customer</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              >
                <option value="">Select a customer</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.city}, {client.country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Valid Until</label>
              <input
                type="date"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Reference</label>
              <input
                type="text"
                name="customer_reference"
                value={formData.customer_reference}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              >
                <option value="">Select staff</option>
                {staffMembers.map((staffMember) => (
                  <option key={staffMember.id} value={staffMember.id}>
                    {staffMember.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtotal</label>
              <input
                type="number"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
              <input
                type="number"
                name="discount_amount"
                value={formData.discount_amount}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
            <textarea
              name="terms_and_conditions"
              value={formData.terms_and_conditions}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="requires_approval"
                checked={formData.requires_approval}
                onChange={handleChange}
                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Requires Approval</span>
            </label>
          </div>
          <div className="flex justify-end">
            <div className='mr-4'>
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
            <button type="submit" className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {isEditMode ? 'Update Quotation' : 'Create Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditQuotation;
