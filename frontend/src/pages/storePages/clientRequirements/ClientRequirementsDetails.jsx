import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Trash2, Save, Loader2 } from "lucide-react";
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

const ClientRequirementsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientRequirement, setClientRequirement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchClientRequirement = async () => {
      setLoading(true);
      try {
        const response = await clientRequirementService.get(id);
        setClientRequirement(response.data);
        setStatus(response.data.status);
      } catch (error) {
        setError("Error fetching client requirement details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientRequirement();
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleUpdateClick = async () => {
    try {
      await clientRequirementService.get(id, { status });
      navigate(`/admin/client-requirements/new/${id}`);
    } catch (error) {
      setError("Error updating client requirement.");
    }
  };

  const handleDeleteClick = async () => {
    try {
      setIsLoading(true);
      await clientRequirementService.delete(id);
      setIsLoading(false);
      navigate("/admin/client-requirements");
    } catch (error) {
      setError("Error deleting client requirement.");
      setIsLoading(false);
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
    <div className="bg-white shadow-md rounded-lg p-8 max-w-7xl mx-auto mt-8">
      <h2 className="text-3xl font-semibold mb-6">
        Client Requirement Details
      </h2>

      <div className="flex flex-col md:flex-row mb-8">
        <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
          <div className="mb-4">
            <p className="font-semibold">
              Client Name: <span className="font-normal">{client?.name}</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">
              File Number: <span className="font-normal">{file_number}</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">
              Color Theme: <span className="font-normal">{color_theme}</span>
            </p>
          </div>
        </div>
        <div className="md:w-1/2 md:pl-4">
          <div className="mb-4">
            <p className="font-semibold">
              Layout: <span className="font-normal">{layout}</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">
              Additional Requirements:{" "}
              <span className="font-normal">{additional_requirements}</span>
            </p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">
              Status: <span className="font-normal capitalize">{status}</span>
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mt-8 mb-4">Features</h3>
      <ul className="list-disc pl-6 mb-8">
        {custom_features.map((feature, index) => (
          <li key={index} className="py-1">
            {feature}
          </li>
        ))}
        {predefined_features.map((feature) => (
          <li key={feature.id} className="py-1">
            {feature.name}
          </li>
        ))}
      </ul>

      <h3 className="text-2xl font-semibold mt-8 mb-4">Images</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {images.map((image) => (
          <a
            key={image.id}
            href={image.image}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={image.image}
              alt={`Image ${image.id}`}
              className="w-full h-40 object-cover rounded-lg shadow-md hover:opacity-75 transition-opacity"
            />
          </a>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBackClick}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
        >
          Back
        </button>
        <div className="flex gap-2">
          {id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this client requirements record?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteClick}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            variant="default"
            onClick={handleUpdateClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientRequirementsDetails;
