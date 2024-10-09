from django.contrib import admin
from apps.accounts.models import (
    NatureGroup,
    MainGroup,
    Ledger,
    )


admin.site.register(NatureGroup)
admin.site.register(MainGroup)
admin.site.register(Ledger)

