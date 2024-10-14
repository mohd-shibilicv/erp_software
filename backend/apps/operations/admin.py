from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.contrib import admin
from .models import SidebarItem, SidebarSection

# Register your models here.
@admin.register(SidebarItem)
class SidebarItemAdmin(UnfoldModelAdmin):
    list_display = ('label', 'icon', 'path', 'section', 'is_visible')
    list_filter = ('section',)
    search_fields = ('label', 'section__section')
    ordering = ('section__section', 'label')
    autocomplete_fields = ['section']
    list_editable = ('is_visible',)

@admin.register(SidebarSection)
class SidebarSectionAdmin(UnfoldModelAdmin):
    list_display = ('section', 'is_visible')
    search_fields = ('section',)
    ordering = ('section',)
    list_editable = ('is_visible',)
