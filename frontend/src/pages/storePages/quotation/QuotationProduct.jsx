import React, { useState, useEffect } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Calendar, Plus, X } from "lucide-react";
import { api } from '@/services/api';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';


const QuotationProduct = ({ onTotalsUpdate, items, setItems, isEditMode }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await api.get('/products/');
                setProducts(productResponse.data.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        calculateTotals(items);
    }, [items]);

    const calculateTotals = (items) => {
        const totalUnitPrice = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
        const totalDiscount = items.reduce((sum, item) => sum + (item.discount * item.unitPrice * item.quantity / 100), 0);
        onTotalsUpdate(totalUnitPrice, totalAmount, totalDiscount);
    };

    const addItem = () => {
        const newItem = {
            id: items.length + 1,
            product: null,
            sku: "",
            quantity: 1,
            discount: 0,
            unitPrice: 0,
            taxRate: 0,
            total: 0,
        };
        setItems([...items, newItem]);
    };

    const removeItem = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
    };

    const updateItem = (id, field, value) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                let updatedItem = { ...item, [field]: value };
                if (field === 'product') {
                    const selectedProduct = products.find(p => p.id === value);
                    updatedItem = {
                        ...updatedItem,
                        product: selectedProduct,
                        sku: selectedProduct?.sku || '',
                        unitPrice: selectedProduct?.price || 0,
                    };
                }
                const subtotal = updatedItem.quantity * updatedItem.unitPrice;
                const discountAmount = subtotal * (updatedItem.discount / 100);
                const taxAmount = (subtotal - discountAmount) * (updatedItem.taxRate / 100);
                updatedItem.total = subtotal - discountAmount + taxAmount;
                updatedItem.total = isNaN(updatedItem.total) ? 0 : updatedItem.total;
                return updatedItem;
            }
            return item;
        });
        setItems(updatedItems);
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SL</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Discount (%)</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Tax Rate (%)</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Input value={item.id} readOnly className="w-12" />
                            </TableCell>
                            <TableCell>
                                <Input value={item.sku || item.product?.sku || ''} readOnly className="w-24" />                            
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={item.product?.id?.toString() || ''}
                                    onValueChange={(value) => updateItem(item.id, "product", parseInt(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                                    className="w-20"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={item.discount}
                                    onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                                    className="w-20"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                    className="w-24"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={item.taxRate}
                                    onChange={(e) => updateItem(item.id, "taxRate", parseFloat(e.target.value) || 0)}
                                    className="w-20"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={item.total !== undefined ? item.total.toFixed(2) : ''}
                                    readOnly
                                    className="w-24"
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(item.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="w-full flex justify-end">
                <Button type="button" onClick={addItem} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
            </div>
        </div>
    );
};

export default QuotationProduct;