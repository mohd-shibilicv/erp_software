from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
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
from .serializers import (
    PurchaseRequestSerializer,
    PurchaseRequestCreateUpdateSerializer,
    PurchaseRequestItemSerializer,
    LocalPurchaseOrderSerializer,
    LocalPurchaseOrderCreateUpdateSerializer,
    LocalPurchaseOrderItemSerializer,
    PurchaseSerializer,
    PurchaseCreateUpdateSerializer,
    PurchaseItemSerializer,
    PurchaseReturnSerializer,
    PurchaseReturnCreateUpdateSerializer,
    PurchaseReturnItemSerializer,
    SalesOrderSerializer,
    SalesOrderCreateUpdateSerializer,
    SalesOrderItemSerializer,
    SaleSerializer,
    SaleCreateUpdateSerializer,
    SaleItemSerializer,
    SalesReturnSerializer,
    SalesReturnCreateUpdateSerializer,
    SalesReturnItemSerializer,
)


class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequest.objects.all()
    serializer_class = PurchaseRequestSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PurchaseRequestCreateUpdateSerializer
        return PurchaseRequestSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(requested_by=self.request.user)
    
    @action(detail=True, methods=['GET'])
    def items(self, request, pk=None):
        try:
            purchase_request = PurchaseRequest.objects.get(pk=pk)
            items = purchase_request.items.all()
            serializer = PurchaseRequestItemSerializer(items, many=True)
            return Response(serializer.data)
        except PurchaseRequest.DoesNotExist:
            return Response({"error": "Purchase Request not found"}, status=status.HTTP_404_NOT_FOUND)


class PurchaseRequestItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequestItem.objects.all()
    serializer_class = PurchaseRequestItemSerializer


class LocalPurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = LocalPurchaseOrder.objects.all()
    serializer_class = LocalPurchaseOrderSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return LocalPurchaseOrderCreateUpdateSerializer
        return LocalPurchaseOrderSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['GET'])
    def items(self, request, pk=None):
        try:
            local_purchase_order = LocalPurchaseOrder.objects.get(pk=pk)
            items = local_purchase_order.items.all()
            serializer = LocalPurchaseOrderItemSerializer(items, many=True)
            return Response(serializer.data)
        except LocalPurchaseOrder.DoesNotExist:
            return Response({"error": "Local Purchase Order not found"}, status=status.HTTP_404_NOT_FOUND)


class LocalPurchaseOrderItemViewSet(viewsets.ModelViewSet):
    queryset = LocalPurchaseOrderItem.objects.all()
    serializer_class = LocalPurchaseOrderItemSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PurchaseCreateUpdateSerializer
        return PurchaseSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['GET'])
    def items(self, request, pk=None):
        try:
            purchase = Purchase.objects.get(pk=pk)
            items = purchase.items.all()
            serializer = PurchaseItemSerializer(items, many=True)
            return Response(serializer.data)
        except Purchase.DoesNotExist:
            return Response({"error": "Purchase not found"}, status=status.HTTP_404_NOT_FOUND)


class PurchaseItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseItem.objects.all()
    serializer_class = PurchaseItemSerializer


class PurchaseReturnViewSet(viewsets.ModelViewSet):
    queryset = PurchaseReturn.objects.all()
    serializer_class = PurchaseReturnSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PurchaseReturnCreateUpdateSerializer
        return PurchaseReturnSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()
    
    @action(detail=True, methods=['GET'])
    def items(self, request, pk=None):
        try:
            purchase_return = PurchaseReturn.objects.get(pk=pk)
            items = purchase_return.items.all()
            serializer = PurchaseReturnItemSerializer(items, many=True)
            return Response(serializer.data)
        except PurchaseReturn.DoesNotExist:
            return Response({"error": "Purchase Return not found"}, status=status.HTTP_404_NOT_FOUND)


class PurchaseReturnItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseReturnItem.objects.all()
    serializer_class = PurchaseReturnItemSerializer


class SalesOrderViewSet(viewsets.ModelViewSet):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SalesOrderCreateUpdateSerializer
        return SalesOrderSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['GET'])
    def items(self, request, pk=None):
        try:
            sales_order = SalesOrder.objects.get(pk=pk)
            items = sales_order.items.all()
            serializer = SalesOrderItemSerializer(items, many=True)
            return Response(serializer.data)
        except SalesOrder.DoesNotExist:
            return Response({"error": "Sales Order not found"}, status=status.HTTP_404_NOT_FOUND)


class SalesOrderItemViewSet(viewsets.ModelViewSet):
    queryset = SalesOrderItem.objects.all()
    serializer_class = SalesOrderItemSerializer


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SaleCreateUpdateSerializer
        return SaleSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['GET'])
    def items(self, request, pk=None):
        try:
            sale = Sale.objects.get(pk=pk)
            items = sale.items.all()
            serializer = SaleItemSerializer(items, many=True)
            return Response(serializer.data)
        except Sale.DoesNotExist:
            return Response({"error": "Sale not found"}, status=status.HTTP_404_NOT_FOUND)


class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer


class SalesReturnViewSet(viewsets.ModelViewSet):
    queryset = SalesReturn.objects.all()
    serializer_class = SalesReturnSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SalesReturnCreateUpdateSerializer
        return SalesReturnSerializer

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['GET'])
    def items(self, request, pk=None):
        try:
            sales_return = SalesReturn.objects.get(pk=pk)
            items = sales_return.items.all()
            serializer = SalesReturnItemSerializer(items, many=True)
            return Response(serializer.data)
        except SalesReturn.DoesNotExist:
            return Response({"error": "Sales Return not found"}, status=status.HTTP_404_NOT_FOUND)


class SalesReturnItemViewSet(viewsets.ModelViewSet):
    queryset = SalesReturnItem.objects.all()
    serializer_class = SalesReturnItemSerializer
