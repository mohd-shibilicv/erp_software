  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { InputWithLabel } from "@/components/ui/InputWithLabel";
  import { UploadIcon, X } from "lucide-react";
  import { useState, useEffect } from "react";
  import { api } from "@/services/api"; 
  import { toast } from "@/components/ui/use-toast";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";

  export function EditCompany({ companyId, isOpen, onClose, onCompanyUpdated }) {
    const [companyData, setCompanyData] = useState({
      company_name: "",
      cr_no: "",
      cr_expiry: null,
      ruksa_number: "",
      ruksa_expiry: null,
      computer_card: "",
      computer_card_expiry: null,
      cr_image: null,
      ruksa_image: null,
      computer_card_image: null,
    });

    const [newImages, setNewImages] = useState({
      cr_image: null,
      ruksa_image: null,
      computer_card_image: null,
    });

    useEffect(() => {
      if (companyId && isOpen) {
        fetchCompanyData();
      }
    }, [companyId, isOpen]);

    const fetchCompanyData = async () => {
      try {
        const response = await api.get(`/company-details/${companyId}/`);
        const fetchedData = response.data;
        
        setCompanyData({
          ...fetchedData,
          cr_expiry: fetchedData.cr_expiry ? new Date(fetchedData.cr_expiry) : null,
          ruksa_expiry: fetchedData.ruksa_expiry ? new Date(fetchedData.ruksa_expiry) : null,
          computer_card_expiry: fetchedData.computer_card_expiry ? new Date(fetchedData.computer_card_expiry) : null,
        });

        setNewImages({
          cr_image: null,
          ruksa_image: null,
          computer_card_image: null,
        });
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch company data.",
          variant: "destructive",
        });
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCompanyData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, value) => {
      setCompanyData(prev => ({ ...prev, [name]: new Date(value) }));
    };

    const handleImageChange = (e, imageType) => {
      const file = e.target.files[0];
      setNewImages(prev => ({ ...prev, [imageType]: file }));
    };

    const handleCompanyEdit = async (e) => {
      e.preventDefault();
      const formData = new FormData();

      Object.keys(companyData).forEach(key => {
        if (key.includes('expiry') && companyData[key]) {
          formData.append(key, companyData[key].toISOString().split("T")[0]);
        } else if (!key.includes('image')) {
          formData.append(key, companyData[key]);
        }
      });

      Object.keys(newImages).forEach(key => {
        if (newImages[key]) {
          formData.append(key, newImages[key]);
        }
      });

      try {
        const response = await api.put(`/company-details/${companyId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        

        toast({
          title: "Success",
          description: "Company updated successfully.",
        });
        
        if (typeof onCompanyUpdated === 'function') {
          onCompanyUpdated();
        }
        onClose();
      } catch (error) {
        console.error("Error updating company:", error);
        toast({
          title: "Error",
          description: "Failed to update company.",
          variant: "destructive",
        });
      }
    };

    const renderImageUpload = (imageType, label) => (
      <div className="flex flex-col gap-1">
        <input
          type="file"
          id={`${imageType}Input`}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageChange(e, imageType)}
        />
        <label
          htmlFor={`${imageType}Input`}
          className="w-full h-48 rounded-md border bg-white/90 flex flex-col gap-2 cursor-pointer justify-center items-center"
        >
          {newImages[imageType] || companyData[imageType] ? (
            <div className="w-full h-full relative">
              <X
                className="w-4 absolute right-2 top-2 z-10"
                onClick={(e) => {
                  e.preventDefault();
                  setNewImages(prev => ({ ...prev, [imageType]: null }));
                  setCompanyData(prev => ({ ...prev, [imageType]: null }));
                }}
              />
              <img
                src={newImages[imageType] ? URL.createObjectURL(newImages[imageType]) : companyData[imageType]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <>
              <UploadIcon className="w-5" />
              <h4 className="text-sm">Click and Upload {label} image</h4>
            </>
          )}
        </label>
      </div>
    );

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Company</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCompanyEdit}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 py-4">
              <InputWithLabel
                label="Company name"
                name="company_name"
                placeholder="Enter company name"
                value={companyData.company_name}
                onChange={handleInputChange}
              />
              <InputWithLabel
                label="Cr NO"
                name="cr_no"
                placeholder="Enter cr number"
                value={companyData.cr_no}
                onChange={handleInputChange}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="crExpiry" className="text-sm">Cr expiry</label>
                <Input
                  id="crExpiry"
                  name="cr_expiry"
                  value={companyData.cr_expiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => handleDateChange("cr_expiry", e.target.value)}
                  type="date"
                />
              </div>
              <InputWithLabel
                label="Ruksa number"
                name="ruksa_number"
                placeholder="Enter Ruksa number"
                value={companyData.ruksa_number}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="ruksaExpiry" className="text-sm">Ruksa expiry</label>
                <Input
                  id="ruksaExpiry"
                  name="ruksa_expiry"
                  value={companyData.ruksa_expiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => handleDateChange("ruksa_expiry", e.target.value)}
                  type="date"
                />
              </div>
              <InputWithLabel
                label="Computer Card"
                name="computer_card"
                placeholder="computer card"
                value={companyData.computer_card}
                onChange={handleInputChange}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="cardExpireDate" className="text-sm">Computer card expiry</label>
                <Input
                  id="cardExpireDate"
                  name="computer_card_expiry"
                  value={companyData.computer_card_expiry?.toISOString().split("T")[0] || ""}
                  onChange={(e) => handleDateChange("computer_card_expiry", e.target.value)}
                  type="date"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              {renderImageUpload("cr_image", "CR")}
              {renderImageUpload("ruksa_image", "Ruksa")}
              {renderImageUpload("computer_card_image", "Computer card")}
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Update Company</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }