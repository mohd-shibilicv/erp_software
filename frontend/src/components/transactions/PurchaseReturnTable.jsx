import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/services/api";
import PurchaseReturnModal from "./PurchaseReturnModal";
import {
  Search,
  Plus,
  Filter,
  EllipsisVertical,
  Check,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PurchaseReturnTable = () => {
  const [purchaseReturns, setPurchaseReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchaseReturnId, setSelectedPurchaseReturnId] =
    useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletePurchaseReturnId, setDeletePurchaseReturnId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchPurchaseReturns();
  }, []);

  useEffect(() => {
    filterReturns();
  }, [purchaseReturns, searchTerm, statusFilter]);

  const fetchPurchaseReturns = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/purchase-returns/");
      setPurchaseReturns(response.data.results);
    } catch (error) {
      console.error("Error fetching purchase returns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReturns = () => {
    let filtered = purchaseReturns;
    if (searchTerm) {
      filtered = filtered.filter(
        (pr) =>
          pr.return_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pr.purchase_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter((pr) => pr.status === statusFilter);
    }
    setFilteredReturns(filtered);
  };

  const handleOpenModal = (id = null) => {
    setSelectedPurchaseReturnId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPurchaseReturnId(null);
    setIsModalOpen(false);
    fetchPurchaseReturns();
  };

  const handleCopyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleSoftDelete = async () => {
    try {
      await api.delete(`/purchase-returns/${deletePurchaseReturnId}/soft_delete/`);
      fetchPurchaseReturns();
      setIsAlertOpen(false);
    } catch (error) {
      console.error("Error soft deleting purchase return:", error);
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Purchase Returns</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center">
          <Plus className="mr-2" size={16} /> New Purchase Return
        </Button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search returns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <div className="flex items-center">
          <Filter className="mr-2 text-gray-400" size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Return Number</TableHead>
                <TableHead>Purchase Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReturns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No purchase returns found.
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {filteredReturns.map((purchaseReturn) => (
                    <Popover key={purchaseReturn.id}>
                      <PopoverTrigger asChild>
                        <motion.tr
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                          className={purchaseReturn.is_deleted ? "bg-red-50 border-l-4 border-red-500 cursor-help" : ""}
                        >
                          <TableCell>
                            <div className={`w-1 h-full ${purchaseReturn.is_deleted ? 'bg-red-500' : ''}`}></div>
                          </TableCell>
                          <TableCell className="text-center">
                            {purchaseReturn.return_number}
                          </TableCell>
                          <TableCell className="flex items-center">
                            {purchaseReturn.purchase_number}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopyToClipboard(
                                  purchaseReturn.purchase_number,
                                  purchaseReturn.id
                                )
                              }
                            >
                              {copiedId === purchaseReturn.id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            {new Date(purchaseReturn.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>QAR {purchaseReturn.total_amount}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                purchaseReturn.is_deleted
                                  ? "bg-red-200 text-red-800"
                                  : purchaseReturn.status === "Pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : purchaseReturn.status === "Approved"
                                  ? "bg-green-200 text-green-800"
                                  : purchaseReturn.status === "Completed"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {purchaseReturn.is_deleted ? "Deleted" : purchaseReturn.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost">
                                  <EllipsisVertical
                                    className="text-gray-400"
                                    size={20}
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => handleOpenModal(purchaseReturn.id)}
                                  disabled={purchaseReturn.is_deleted}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setDeletePurchaseReturnId(purchaseReturn.id);
                                    setIsAlertOpen(true);
                                  }}
                                  className="text-red-600"
                                  disabled={purchaseReturn.is_deleted}
                                >
                                  {purchaseReturn.is_deleted ? "Deleted" : "Delete"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      </PopoverTrigger>
                      {purchaseReturn.is_deleted && (
                        <PopoverContent className="w-80">
                          <div className="text-center">
                            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                            <p className="font-semibold text-red-500">This purchase return has been deleted</p>
                            <p className="text-sm text-gray-500 mt-1">The purchase return is marked as deleted but can be restored if needed.</p>
                          </div>
                        </PopoverContent>
                      )}
                    </Popover>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <PurchaseReturnModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        purchaseReturnId={selectedPurchaseReturnId}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the purchase return as deleted. It can be restored later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSoftDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default PurchaseReturnTable;