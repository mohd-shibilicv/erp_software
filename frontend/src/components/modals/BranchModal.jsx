/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderIcon } from "react-hot-toast";

const BranchModal = ({ isOpen, onClose, onSave, branch, branchSaveLoad }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact_details: "",
    manager: "",
  });

  useEffect(() => {
    if (branch) {
      setFormData(branch);
    } else {
      setFormData({
        name: "",
        location: "",
        contact_details: "",
        manager: "",
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{branch ? "Edit Branch" : "Add Branch"}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name" className="text-start">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3 bg-slate-50 "
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="location" className="text-start">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3 bg-slate-50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="contact_details" className="text-start">
                Contact Details
              </Label>
              <Input
                id="contact_details"
                name="contact_details"
                value={formData.contact_details}
                onChange={handleChange}
                className="col-span-3 bg-slate-50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="manager" className="text-start">
                Manager ID
              </Label>
              <Input
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="col-span-3 bg-slate-50"
              />
            </div>
          </div>
          <DialogFooter>
            {branchSaveLoad ? (
              <>
                <Button
                  type="button"
                  className="pointer-events-none bg-purple-700 flex items-center gap-2"
                >
                  Loading.. <LoaderIcon className="w-5 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button type="submit">
                  {branch ? "Update" : "Add"} Branch
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BranchModal;
