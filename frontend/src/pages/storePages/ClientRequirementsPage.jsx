import React, { useState } from "react";
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

const clients = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
];

const features = [
  { id: "dashboard", label: "Dashboard" },
  { id: "reports", label: "Reports" },
  { id: "userManagement", label: "User Management" },
  { id: "notifications", label: "Notifications" },
  { id: "analytics", label: "Analytics" },
];

const colorThemes = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "custom", label: "Custom" },
];

const layouts = [
  { value: "sidebarLeft", label: "Sidebar Left" },
  { value: "sidebarRight", label: "Sidebar Right" },
  { value: "topNavigation", label: "Top Navigation" },
];

const ClientRequirementsPage = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [fileNumber, setFileNumber] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [colorTheme, setColorTheme] = useState("");
  const [layout, setLayout] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFeatureChange = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Handle form submission
    console.log({
      selectedClient,
      fileNumber,
      uploadedImages,
      selectedFeatures,
      colorTheme,
      layout,
      additionalRequirements,
    });
    // Reset form or show success message
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="overflow-y-hidden">
        <Card className="w-full mx-auto">
          <CardHeader>
            <h2 className="text-2xl font-bold">Client Requirements</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
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
                className={`border-2 border-dashed rounded-md p-4 mt-2 text-center cursor-pointer ${
                  isDragActive ? "border-primary" : "border-gray-300"
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
                      <div key={index} className="relative mt-2">
                        <img
                          src={file.preview}
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
              <ScrollArea className="h-40 w-full border rounded-md p-4 mt-2">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={feature.id}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={() => handleFeatureChange(feature.id)}
                    />
                    <label htmlFor={feature.id}>{feature.label}</label>
                  </div>
                ))}
              </ScrollArea>
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
                "Save Requirements"
              )}
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default ClientRequirementsPage;
