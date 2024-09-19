import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2,Save,Loader2 } from "lucide-react";
import { clientRequirementService } from "@/services/crmServiceApi";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";



const ClientRequirementsDetails = () => {
    const { id } = useParams(); // Get the id from the route
    const navigate = useNavigate(); // For navigation (back button)
    const [clientRequirement, setClientRequirement] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("pending"); // Default status
  
    useEffect(() => {
      const fetchClientRequirement = async () => {
        setLoading(true);
        try {
          const response = await clientRequirementService.get(id); // Fetch the details using the id
          setClientRequirement(response.data); // Set the fetched data to state
          setStatus(response.data.status); // Set initial status
        } catch (error) {
          setError("Error fetching client requirement details.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchClientRequirement();
    }, [id]);
  
    // Handler for status dropdown
    const handleStatusChange = (e) => {
      setStatus(e.target.value);
    };
  
    // Navigate back to the previous page
    const handleBackClick = () => {
      navigate(-1); // Go back to the previous page
    };
  

    const handleUpdateClick = async () => {
        try {
          // Update the client requirement with the new status
          await clientRequirementService.get(id, { status });
          console.log("ljdaslkfjd a;ldkjfa ;ldksjfa ;ldjkf a;ls")
          // Navigate to the specific route after successful update
          navigate(`/admin/client-requirements/new/${id}`);
        } catch (error) {
          // Handle errors during update
          setError("Error updating client requirement.");
        }
      };
      
      

    
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!clientRequirement) return <p>No details available.</p>;
  
    const {
      client,
      file_number,
      color_theme,
      layout,
      additional_requirements,
      custom_features,
      predefined_features,
      images,
    } = clientRequirement;
  
    return (
      <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Client Requirement Details</h2>
        
        <div className="border border-gray-300 rounded-lg p-6 mb-4">
          <p><strong>Client Name:</strong> {client?.name}</p>
          <p><strong>File Number:</strong> {file_number}</p>
          <p><strong>Color Theme:</strong> {color_theme}</p>
          <p><strong>Layout:</strong> {layout}</p>
          <p><strong>Additional Requirements:</strong> {additional_requirements}</p>
  
          <div className="mt-4">
            <label htmlFor="status" className="block font-semibold mb-2">Status</label>
            <select
              id="status"
              value={status}
              onChange={handleStatusChange}
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="pending">Pending</option>
              <option value="progress">In Progress</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>
        </div>
  
        <h3 className="text-xl font-semibold mt-6">Custom Features</h3>
        <ul className="list-disc pl-6">
          {custom_features.map((feature, index) => (
            <li key={index} className="py-1">{feature}</li>
          ))}
        </ul>
  
        <h3 className="text-xl font-semibold mt-6">Predefined Features</h3>
        <ul className="list-disc pl-6">
          {predefined_features.map((feature) => (
            <li key={feature.id} className="py-1">{feature.name}</li>
          ))}
        </ul>
  
        <h3 className="text-xl font-semibold mt-6">Images</h3>
      <div className="flex gap-4 mt-4">
        {images.map((image) => (
          <a key={image.id} href={image.image} target="_blank" rel="noopener noreferrer">
            <img
              src={image.image}
              alt={`Image ${image.id}`}
              className="w-40 h-auto rounded-lg shadow-md hover:opacity-75 transition-opacity"
            />
          </a>
        ))}
      </div>
  
        {/* Buttons at the bottom */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBackClick}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Back
          </button>
          <button
            onClick={handleUpdateClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      </div>
    );
  };
  
  export default ClientRequirementsDetails;
  
