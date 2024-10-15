from rest_framework import serializers
from apps.products.models import Product
from .models import (
    PurchaseRequest,
    PurchaseRequestItem,
    LocalPurchaseOrder,
    LocalPurchaseOrderItem,
    Purchase,
    PurchaseItem,
    PurchaseReturn,
    PurchaseReturnItem,
    SalesOrder,
    SalesOrderItem,
    Sale,
    SaleItem,
    SalesReturn,
    SalesReturnItem,
)
from apps.crm.models import Client

# Purchase Serializers

class PurchaseRequestItemSerializer(serializers.ModelSerializer):
    sku = serializers.CharField(source="product.sku", read_only=True)

    class Meta:
        model = PurchaseRequestItem
        fields = ["id", "product", "sku", "quantity", "unit_price", "total_price"]


class PurchaseRequestSerializer(serializers.ModelSerializer):
    items = PurchaseRequestItemSerializer(many=True, read_only=True)
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = [
            "id",
            "request_number",
            "supplier",
            "supplier_name",
            "requested_by",
            "date_requested",
            "expected_delivery_date",
            "total_amount",
            "status",
            "notes",
            "items",
        ]


class PurchaseRequestCreateUpdateSerializer(serializers.ModelSerializer):
    items = PurchaseRequestItemSerializer(many=True)

    class Meta:
        model = PurchaseRequest
        fields = ["supplier", "expected_delivery_date", "status", "notes", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        purchase_request = PurchaseRequest.objects.create(**validated_data)
        self._create_or_update_items(purchase_request, items_data)
        return purchase_request

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            self._create_or_update_items(instance, items_data)

        return instance

    def _create_or_update_items(self, purchase_request, items_data):
        for item_data in items_data:
            PurchaseRequestItem.objects.create(
                purchase_request=purchase_request, **item_data
            )


class LocalPurchaseOrderItemSerializer(serializers.ModelSerializer):
    sku = serializers.CharField(source="product.sku", read_only=True)

    class Meta:
        model = LocalPurchaseOrderItem
        fields = ["product", "sku", "quantity", "unit_price", "total_price"]


class LocalPurchaseOrderSerializer(serializers.ModelSerializer):
    items = LocalPurchaseOrderItemSerializer(many=True, read_only=True)
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)
    purchase_request_number = serializers.CharField(source="purchase_request.request_number", read_only=True)

    class Meta:
        model = LocalPurchaseOrder
        fields = [
            "id",
            "lpo_number",
            "supplier",
            "supplier_name",
            "purchase_request",
            "purchase_request_number",
            "date_issued",
            "status",
            "delivery_date",
            "total_amount",
            "remarks",
            "quotation_document",
            "items",
        ]


class LocalPurchaseOrderCreateUpdateSerializer(serializers.ModelSerializer):
    items = LocalPurchaseOrderItemSerializer(many=True)

    class Meta:
        model = LocalPurchaseOrder
        fields = [
            "id",
            "supplier",
            "purchase_request",
            "status",
            "delivery_date",
            "remarks",
            "quotation_document",
            "items",
        ]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        lpo = LocalPurchaseOrder.objects.create(**validated_data)
        for item_data in items_data:
            LocalPurchaseOrderItem.objects.create(lpo=lpo, **item_data)
        return lpo

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                LocalPurchaseOrderItem.objects.create(lpo=instance, **item_data)

        return instance

    def validate(self, data):
        if data.get("purchase_request") and data.get("supplier"):
            if data["purchase_request"].supplier != data["supplier"]:
                raise serializers.ValidationError(
                    "Supplier must match the supplier in the Purchase Request."
                )
        return data


class PurchaseItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    sku = serializers.CharField(source="product.sku", read_only=True)

    class Meta:
        model = PurchaseItem
        fields = [
            "id",
            "product",
            "sku",
            "product_name",
            "quantity",
            "unit_price",
            "total_price",
        ]


class PurchaseSerializer(serializers.ModelSerializer):
    lpo_number = serializers.CharField(source="lpo.lpo_number", read_only=True)
    items = PurchaseItemSerializer(many=True, read_only=True)
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)

    class Meta:
        model = Purchase
        fields = [
            "id",
            "purchase_number",
            "supplier",
            "supplier_name",
            "lpo",
            "lpo_number",
            "date",
            "total_amount",
            "status",
            "notes",
            "is_deleted",
            "items",
        ]


class PurchaseCreateUpdateSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True)

    class Meta:
        model = Purchase
        fields = ["supplier", "lpo", "status", "notes", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        purchase = Purchase.objects.create(**validated_data)
        self._create_or_update_items(purchase, items_data)
        return purchase

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            self._create_or_update_items(instance, items_data)

        return instance

    def _create_or_update_items(self, purchase, items_data):
        for item_data in items_data:
            PurchaseItem.objects.create(purchase=purchase, **item_data)

    def validate(self, data):
        if data.get("lpo") and data.get("supplier"):
            if data["lpo"].supplier != data["supplier"]:
                raise serializers.ValidationError(
                    "Supplier must match the supplier in the Local Purchase Order."
                )
        return data


class PurchaseReturnItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseReturnItem
        fields = ["id", "purchase_item", "quantity", "unit_price"]


class PurchaseReturnSerializer(serializers.ModelSerializer):
    items = PurchaseReturnItemSerializer(many=True, read_only=True)
    purchase_number = serializers.CharField(
        source="purchase.purchase_number", read_only=True
    )

    class Meta:
        model = PurchaseReturn
        fields = [
            "id",
            "return_number",
            "purchase",
            "purchase_number",
            "date",
            "total_amount",
            "status",
            "reason",
            "is_deleted",
            "items",
        ]


class PurchaseReturnCreateUpdateSerializer(serializers.ModelSerializer):
    items = PurchaseReturnItemSerializer(many=True)

    class Meta:
        model = PurchaseReturn
        fields = ["purchase", "status", "reason", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        purchase_return = PurchaseReturn.objects.create(**validated_data)
        self._create_or_update_items(purchase_return, items_data)
        return purchase_return

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            self._create_or_update_items(instance, items_data)

        return instance

    def _create_or_update_items(self, purchase_return, items_data):
        for item_data in items_data:
            PurchaseReturnItem.objects.create(
                purchase_return=purchase_return, **item_data
            )

    def validate(self, data):
        if data.get("purchase"):
            for item in data.get("items", []):
                if item["purchase_item"].purchase != data["purchase"]:
                    raise serializers.ValidationError(
                        "All return items must belong to the specified purchase."
                    )
        return data


# Sales Serializers
class SalesOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = SalesOrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
        ]


class SalesOrderSerializer(serializers.ModelSerializer):
    items = SalesOrderItemSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source="client.name", read_only=True)

    class Meta:
        model = SalesOrder
        fields = [
            "id",
            "order_number",
            "client",
            "client_name",
            "date_created",
            "expected_delivery_date",
            "total_amount",
            "status",
            "notes",
            "items",
        ]


class SalesOrderCreateUpdateSerializer(serializers.ModelSerializer):
    items = SalesOrderItemSerializer(many=True)

    class Meta:
        model = SalesOrder
        fields = ["client", "expected_delivery_date", "status", "notes", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        sales_order = SalesOrder.objects.create(**validated_data)
        for item_data in items_data:
            SalesOrderItem.objects.create(sales_order=sales_order, **item_data)
        return sales_order

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                SalesOrderItem.objects.create(sales_order=instance, **item_data)

        return instance


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = SaleItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
        ]


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source="client.name", read_only=True)
    sales_order_number = serializers.CharField(source="sales_order.order_number", read_only=True)

    class Meta:
        model = Sale
        fields = [
            "id",
            "sale_number",
            "client",
            "client_name",
            "sales_order",
            "sales_order_number",
            "date",
            "total_amount",
            "status",
            "notes",
            "items",
            "is_deleted",
        ]


class SaleCreateUpdateSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)

    class Meta:
        model = Sale
        fields = ["client", "sales_order", "status", "notes", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        sale = Sale.objects.create(**validated_data)
        for item_data in items_data:
            SaleItem.objects.create(sale=sale, **item_data)
        return sale

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                SaleItem.objects.create(sale=instance, **item_data)

        return instance


class SalesReturnItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="sale_item.product.name", read_only=True
    )

    class Meta:
        model = SalesReturnItem
        fields = [
            "id",
            "sale_item",
            "product_name",
            "quantity",
            "unit_price",
        ]


class SalesReturnSerializer(serializers.ModelSerializer):
    items = SalesReturnItemSerializer(many=True, read_only=True)
    sale_number = serializers.CharField(source="sale.sale_number", read_only=True)

    class Meta:
        model = SalesReturn
        fields = [
            "id",
            "return_number",
            "sale",
            "sale_number",
            "date",
            "total_amount",
            "reason",
            "processed_by",
            "status",
            "refund_amount",
            "notes",
            "items",
            "is_deleted",
        ]


class SalesReturnCreateUpdateSerializer(serializers.ModelSerializer):
    items = SalesReturnItemSerializer(many=True)

    class Meta:
        model = SalesReturn
        fields = ["sale", "reason", "status", "refund_amount", "notes", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        sales_return = SalesReturn.objects.create(**validated_data)
        for item_data in items_data:
            SalesReturnItem.objects.create(sales_return=sales_return, **item_data)
        return sales_return

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item_data in items_data:
                SalesReturnItem.objects.create(sales_return=instance, **item_data)

        return instance

    def validate(self, data):
        if data.get("sale"):
            for item in data.get("items", []):
                if item["sale_item"].sale != data["sale"]:
                    raise serializers.ValidationError(
                        "All return items must belong to the specified sale."
                    )
        return data
