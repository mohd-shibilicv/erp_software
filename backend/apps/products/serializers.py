from rest_framework import serializers
from .models import Product, DamagedProduct


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "sku",
            "description",
            "price",
            "quantity",
            "unit",
            "reorder_level",
            "category",
            "brand",
            "barcode_image",
        ]
        read_only_fields = ["id", "barcode_image"]

    def create(self, validated_data):
        product = Product.objects.create(**validated_data)
        product.generate_barcode()
        product.save()
        return product


class DamagedProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = DamagedProduct
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "reason",
            "date_reported",
        ]
        read_only_fields = ["id", "date_reported"]
