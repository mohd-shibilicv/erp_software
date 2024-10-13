from unfold.admin import ModelAdmin as UnfoldModelAdmin
from django.contrib import admin
from .models import SidebarItem, SidebarSection

# Register your models here.
@admin.register(SidebarItem)
class SidebarItemAdmin(UnfoldModelAdmin):
    list_display = ('label', 'icon', 'path', 'section')
    list_filter = ('section',)
    search_fields = ('label', 'section__section')
    ordering = ('section__section', 'label')
    autocomplete_fields = ['section']


@admin.register(SidebarSection)
class SidebarSectionAdmin(UnfoldModelAdmin):
    list_display = ('section',)
    search_fields = ('section',)
    ordering = ('section',)
