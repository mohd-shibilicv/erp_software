from rest_framework import viewsets, status

from apps.accounts.models import (
    NatureGroup,
    MainGroup,
    Ledger,
)
from apps.accounts.serializers import (
    NatureGroupSerializer,
    MainGroupSerializer,
    LedgerSerializer,
)


class NatureGroupViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling CRUD operations for NatureGroup model.

    This viewset provides the following actions:
        - `list`: Retrieve all NatureGroup instances.
        - `retrieve`: Retrieve a specific NatureGroup instance by ID.
        - `create`: Create a new NatureGroup instance.
        - `update`: Update an existing NatureGroup instance.
        - `partial_update`: Partially update a NatureGroup instance.
        - `destroy`: Delete a NatureGroup instance.

    Attributes:
        queryset (QuerySet): A queryset of all NatureGroup objects.
        serializer_class (Serializer): The serializer class used to handle NatureGroup serialization and deserialization.
    """

    queryset = NatureGroup.objects.all()
    serializer_class = NatureGroupSerializer


class MainGroupViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling CRUD operations for MainGroup model.

    This viewset provides the following actions:
        - `list`: Retrieve all MainGroup instances.
        - `retrieve`: Retrieve a specific MainGroup instance by ID.
        - `create`: Create a new MainGroup instance.
        - `update`: Update an existing MainGroup instance.
        - `partial_update`: Partially update a MainGroup instance.
        - `destroy`: Delete a MainGroup instance.

    Attributes:
        queryset (QuerySet): A queryset of all MainGroup objects.
        serializer_class (Serializer): The serializer class used to handle MainGroup serialization and deserialization.
    """

    queryset = MainGroup.objects.all()
    serializer_class = MainGroupSerializer


class LedgerViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling CRUD operations for Ledger model.

    This viewset provides the following actions:
        - `list`: Retrieve all Ledger instances.
        - `retrieve`: Retrieve a specific Ledger instance by ID.
        - `create`: Create a new Ledger instance.
        - `update`: Update an existing Ledger instance.
        - `partial_update`: Partially update a Ledger instance.
        - `destroy`: Delete a Ledger instance.

    Attributes:
        queryset (QuerySet): A queryset of all Ledger objects.
        serializer_class (Serializer): The serializer class used to handle Ledger serialization and deserialization.
    """

    queryset = Ledger.objects.all()
    serializer_class = LedgerSerializer
