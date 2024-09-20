import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "@/components/layout/Layout";
import { api } from "@/services/api";
import { useParams, useNavigate } from 'react-router-dom';

const colorThemes = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "both", label: "Both" },
  { id: "custom", label: "Custom" },
];

const layouts = [
  { value: "sidebarLeft", label: "Sidebar Left" },
  { value: "sidebarRight", label: "Sidebar Right" },
  { value: "topNavigation", label: "Top Navigation" },
];

const ClientRequirementsDetails = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [fileNumber, setFileNumber] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [colorTheme, setColorTheme] = useState("");
  const [layout, setLayout] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [clients, setClients] = useState([]);
  const [features, setFeatures] = useState([])
  const [status, setStatus] = useState("pending"); 
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientRequirement, setClientRequirement] = useState(null);


  const onDrop = (acceptedFiles) => {
    setUploadedImages((prevImages) => [
      ...prevImages,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleFeatureSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      const results = features.filter(feature =>
        feature.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const addFeature = (feature) => {
    if (!selectedFeatures.some(f => f.id === feature.id)) {
      setSelectedFeatures(prev => [...prev, feature]);
    }
    setSearchTerm('');
    setSearchResults([]);
    setShowAllFeatures(false);
  };

  const addCustomFeature = (term) => {
    const newFeature = {
      id: `custom-${Date.now()}`,
      name: term.trim()
    };
    setSelectedFeatures(prev => [...prev, newFeature]);
    setSearchTerm('');
    setSearchResults([]);
    setShowAllFeatures(false);
  };

  const removeFeature = (featureId) => {
    setSelectedFeatures(prev => prev.filter(f => f.id !== featureId));
  };

  const handleBack = () => {
    navigate("/admin/client-requirements");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('client_id', parseInt(selectedClient, 10));
    formData.append('status', status);
    formData.append('file_number', fileNumber);
    formData.append('color_theme', colorTheme);
    formData.append('layout', layout);
    formData.append('additional_requirements', additionalRequirements);
  
    const predefinedFeatures = selectedFeatures
      .filter(feature => !String(feature.id).startsWith('custom'))
      .map(feature => feature.id); // Directly use the feature.id here, no need to JSON stringify
  
    const customFeatures = selectedFeatures
      .filter(feature => String(feature.id).startsWith('custom'))
      .map(feature => feature.name); // Custom features remain as a list of strings
  
    // Append directly as arrays, not JSON strings
    predefinedFeatures.forEach(featureId => formData.append('predefined_features', featureId));
    customFeatures.forEach(customFeature => formData.append('custom_features', customFeature));
  
    uploadedImages.forEach((image, index) => {
      if (image.id) {
        formData.append(`existing_images[${index}]`, image.id);
      } else {
        formData.append(`uploaded_images[${index}]`, image);
      }
    });
  
    try {
      let response;
      if (id) {
        response = await api.put(`/client-requirements/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await api.post('/client-requirements/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      console.log("Successfully submitted:", response.data);
      navigate('/admin/client-requirements');
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (id) {
      fetchClientRequirement(id);
    }
  }, [id]);

  const fetchClientRequirement = async (reqId) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/client-requirements/${reqId}/`);
      const data = response.data;
      setClientRequirement(data);
      setSelectedClient(data.client.id);
      setFileNumber(data.file_number);
      setColorTheme(data.color_theme);
      setLayout(data.layout);
      setAdditionalRequirements(data.additional_requirements);
      setStatus(data.status); 
      
      const predefinedFeatures = data.predefined_features || [];
      let customFeatures = [];
      try {
        customFeatures = JSON.parse(data.custom_features);
      } catch (e) {
        console.error("Error parsing custom features:", e);
        customFeatures = [];
      }
      
      setSelectedFeatures([
        ...predefinedFeatures.map(f => ({ id: f.id, name: f.name })),
        ...customFeatures.map(f => ({ id: `custom-${f}`, name: f }))
      ]);
      setUploadedImages(data.images.map(img => ({
        ...img,
        preview: img.image 
      })));
      
    } catch (error) {
      console.log("Form data being sent:", Object.fromEntries(formData));
      console.error("Error fetching client requirement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await api.get('/clients/');
        console.log("Client Response Data:", clientResponse.data.results);
        setClients(clientResponse.data.results);
        const featureResponse = await api.get('/features/');
        console.log("Feature Response Data:", featureResponse.data);
        setFeatures(featureResponse.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <form onSubmit={handleSubmit} className="overflow-y-hidden">
        <Card className="w-full mx-auto">
          <CardHeader>
          <h2 className="text-2xl font-bold">
            {id ? 'Edit Client Requirement' : 'New Client Requirement'}
          </h2>          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Client</Label>
                {isLoading ? (
                  <p>Loading clients...</p>
                ) : (
                  <Select
                    value={selectedClient ? selectedClient.toString() : ""}
                    onValueChange={(value) => setSelectedClient(parseInt(value, 10))}
                  >

                    <SelectTrigger>
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

              </div>
              <div className="space-y-2">
                <Label>File Number</Label>
                <Input
                  type="text"
                  value={fileNumber}
                  onChange={(e) => setFileNumber(e.target.value)}
                  placeholder="Enter File Number"
                />
              </div>
            </div>

            <div className="mb-6">
              <Label>Upload Requirement Notes</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-4 mt-2 text-center cursor-pointer ${isDragActive ? "border-primary" : "border-gray-300"
                  }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">
                  Drag & drop images here, or click to select files
                </p>
              </div>
              {uploadedImages.length > 0 && (
  <ScrollArea className="h-32 w-full border rounded-md p-4 mt-2">
    <div className="flex flex-wrap gap-4">
      {uploadedImages.map((file, index) => (
        <div key={file.id || index} className="relative mt-2">
          <img
            src={file.preview || file.image}
            alt={`uploaded-${index}`}
            className="h-20 w-20 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  </ScrollArea>
)}
            </div>
            <div className="mb-6">
              <Label>Features</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search or add features"
                  value={searchTerm}
                  onChange={(e) => handleFeatureSearch(e.target.value)}
                  onFocus={() => setShowAllFeatures(true)}
                  onBlur={() => setTimeout(() => setShowAllFeatures(false), 200)}
                />
                {(showAllFeatures || searchTerm) && (
                  <ScrollArea className="absolute z-10 w-full max-h-40 border rounded-md bg-white mt-1 shadow-md">
                    {(searchTerm ? searchResults : features).map((feature) => (
                      <div
                        key={feature.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => addFeature(feature)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <span>{feature.name}</span>
                      </div>
                    ))}
                    {searchTerm && !features.some(f => f.name.toLowerCase() === searchTerm.toLowerCase()) && (
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => addCustomFeature(searchTerm)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <span>Add "{searchTerm}"</span>
                      </div>
                    )}
                  </ScrollArea>
                )}
              </div>
              <div className="mt-4">
                <Label>Selected Features</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedFeatures.map((feature) => (
                    <span key={feature.id} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                      {feature.name}
                      <button onClick={() => removeFeature(feature.id)} className="ml-2 text-red-500 hover:text-red-700">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Label>Color Theme</Label>
              <RadioGroup value={colorTheme} onValueChange={setColorTheme} className="flex items-center gap-5 mt-2">
                {colorThemes.map((theme) => (
                  <div key={theme.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={theme.id} id={theme.id} />
                    <Label htmlFor={theme.id}>{theme.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="mb-6">
              <Label>Layout</Label>
              <Select value={layout} onValueChange={setLayout}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Layout" />
                </SelectTrigger>
                <SelectContent>
                  {layouts.map((layoutOption) => (
                    <SelectItem
                      key={layoutOption.value}
                      value={layoutOption.value}
                    >
                      {layoutOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {id && (
        <div className="mb-6">
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}

            <div>
              <Label>Additional Requirements</Label>
              <Textarea
                placeholder="Enter any additional requirements or notes"
                className="mt-2"
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              id ? "Update Requirement" : "Save Requirement"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
            Cancel
          </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default ClientRequirementsDetails;
