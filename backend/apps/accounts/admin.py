from django.contrib import admin
from unfold.admin import ModelAdmin as UnfoldModelAdmin

from apps.accounts.models import (
    NatureGroup,
    MainGroup,
    Ledger,
    )


admin.site.register(NatureGroup,UnfoldModelAdmin)
admin.site.register(MainGroup,UnfoldModelAdmin)
admin.site.register(Ledger,UnfoldModelAdmin)

