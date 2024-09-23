import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { clientQuotation } from '@/services/crmServiceApi';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import QuotationProduct from './QuotationProduct';

const AddEditQuotation = ({ quotation = {}, isEditMode = false }) => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate()
  const { id } = useParams();
  const [staffMembers, setStaffMembers] = useState([]);
  const [totals, setTotals] = useState({
    totalUnitPrice: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });
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
  const [quotationItems, setQuotationItems] = useState([
    {
      id: 1,
      product: null,
      sku: "",
      quantity: 1,
      discount: 0,
      unitPrice: 0,
      taxRate: 5,
      total: 0,
    }
  ]);

  const handleTotalsUpdate = (totalUnitPrice, totalAmount, totalDiscount) => {
    setTotals({ totalUnitPrice, totalAmount, totalDiscount });
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;
    let updatedFormData = {
      ...formData,
      [name]: updatedValue
    };
    if (name === 'subtotal' || name === 'discount_amount') {
      const total = updatedFormData.subtotal - updatedFormData.discount_amount;
      updatedFormData.total_amount = total > 0 ? total : 0;
    }
    setFormData(updatedFormData);
  };
  const handleBack = () => {
    navigate("/admin/quotation");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        items: quotationItems.map(item => ({
          product: item.product.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          discount_percentage: item.discount,
          tax_percentage: item.taxRate,
          subtotal: item.total,
        })),
      };
      let response;
      if (isEditMode) {
        response = await clientQuotation.update(id, dataToSubmit);
        console.log("edittt:", response)
      } else {
        response = await clientQuotation.create(dataToSubmit);
      }
      navigate('/admin/quotation');
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };
  useEffect(() => {
    if (isEditMode && id) {
      const fetchQuotation = async () => {
        try {
          const response = await clientQuotation.get(id);
          console.log(response, "quoation")
          setFormData(prevState => ({
            ...prevState,
            ...response.data,
          }));
          setQuotationItems(response.data.items.map((item, index) => ({
            ...item,
            id: index + 1,
            product: products.find(p => p.id === item.product),
          })));
        } catch (error) {
          console.error('Error fetching quotation:', error);
        }
      };
      fetchQuotation();
    }
  }, [isEditMode, id, products]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await api.get('/clients/');
        setClients(clientResponse.data.results);
        const staffResponse = await api.get('/staff');
        setStaffMembers(staffResponse.data);
        const productResponse = await api.get('/products/');
        setProducts(productResponse.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-7xl mx-auto mb-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold mb-6 text-left">
            {isEditMode ? 'Edit Quotation' : 'Add New Quotation'}
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <Input
                  type="date"
                  className="mt-1 block w-full"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
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
                  {staffMembers.map(staffMember => (
                    <option key={staffMember.id} value={staffMember.id}>
                      {staffMember.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <QuotationProduct
              onTotalsUpdate={handleTotalsUpdate}
              items={quotationItems}
              setItems={setQuotationItems}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Terms and Conditions</h3>
                  <textarea
                    name="terms_and_conditions"
                    value={formData.terms_and_conditions}
                    onChange={handleChange}
                    rows="4"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtotal</label>
                <input
                  type="number"
                  name="subtotal"
                  value={totals.totalUnitPrice}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
                <input
                  type="number"
                  name="discount_amount"
                  value={totals.totalDiscount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <input
                  type="number"
                  name="total_amount"
                  value={totals.totalAmount}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="mr-4"
            >
              Back
            </Button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditQuotation;
