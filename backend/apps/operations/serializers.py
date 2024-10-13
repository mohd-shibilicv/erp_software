from rest_framework import serializers
from .models import SidebarSection, SidebarItem


class SidebarItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SidebarItem
        fields = ["path", "icon", "label", "is_visible"]


class SidebarSectionSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = SidebarSection
        fields = ["section", "is_visible", "items"]

    def get_items(self, obj):
        visible_items = obj.items.filter(is_visible=True)
        return SidebarItemSerializer(visible_items, many=True).data
