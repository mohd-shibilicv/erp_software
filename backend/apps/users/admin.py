from unfold.admin import ModelAdmin as UnfoldModelAdmin
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model


User = get_user_model()

admin.site.unregister(Group)
admin.site.unregister(BlacklistedToken)
admin.site.unregister(OutstandingToken)


class UserAdmin(UnfoldModelAdmin):
    # Define the fields to display in the list view
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')

    # Define which fields are editable and visible
    fieldsets = (
        (None, {'fields': ('username', 'password', 'role')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    # Override the fields to display in the add form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password', 'role'),
        }),
    )

    # Define which fields should be readonly
    readonly_fields = ('date_joined', 'last_login')

    # Hide specific fields dynamically
    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        if not request.user.is_superuser:  # Hide fields for non-superusers
            fieldsets = (
                (None, {'fields': ('username', 'password')}),
                (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
            )
        return fieldsets

    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj)
        if not request.user.is_superuser:
            return readonly_fields + ('is_staff', 'is_superuser')
        return readonly_fields


admin.site.register(User, UserAdmin)
