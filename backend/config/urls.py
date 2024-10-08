from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from apps.users.views import (
    UserRegisterViewSet,
    LogoutView,
    LoginViewSet,
    RefreshViewSet,
    UserViewSet,
    BranchManagerViewSet,
    StaffManagementViewSet,
)
from apps.products.views import ProductViewSet, DamagedProductViewSet
from apps.branches.views import (
    BranchViewSet,
    ProductRequestViewSet,
    BranchProductViewSet,
)
from apps.suppliers.views import SupplierViewSet
from apps.reports.views import (
    ProductInflowViewSet,
    ProductOutflowViewSet,
    InwardQtyReportView,
    OutwardQtyReportView,
    BranchWiseQtyReportView,
    ExpiredProductReportView,
    SupplierWiseProductReportView,
    OpenedProductReportView,
    ClosedProductReportView,
    DailyReportView,
    ProductDetailsReportView,
    BranchDailyReportView,
    BranchExpiredProductReportView,
    BranchProductDetailsReportView,
    DashboardView,
    BranchDashboardView,
)
from apps.crm.views import (
    ClientRequestViewSet,
    ClientViewSet,
    ClientRelationshipViewSet,
    ClientRequirementViewSet,
    FeatureViewSet,
    QuotationItemViewSet,
    QuotationViewSet,
    AgreementViewSet,
    ProjectViewSet,
    ProjectAssignedStaffsViewSet,
    ProjectTaskViewSet,
    ProjectIndividualTaskViewSet,
    StaffProjectAssignmentViewSet,
    SendProjectEmailView
)


router = DefaultRouter()

# Auth
router.register(r"users", UserViewSet, basename="users")
router.register(r"register", UserRegisterViewSet, basename="register")
router.register(r"login", LoginViewSet, basename="login")
router.register(r"refresh", RefreshViewSet, basename="refresh")
router.register(r"staff", StaffManagementViewSet, basename="staff")
router.register(r"branch-managers", BranchManagerViewSet, basename="branch-managers")

router.register(r"products", ProductViewSet, basename="products")
router.register(r"damaged-products", DamagedProductViewSet, basename="damaged_products")
router.register(r"suppliers", SupplierViewSet, basename="suppliers")
router.register(r"product-inflow", ProductInflowViewSet, basename="product_inflow")
router.register(r"product-outflow", ProductOutflowViewSet, basename="product_outflow")

# Branch
router.register(r"branches", BranchViewSet, basename="branches")
router.register(r"branch-products", BranchProductViewSet, basename="branch_products")
router.register(r"product-requests", ProductRequestViewSet, basename="product_requests")

# CRM
router.register(r"clients", ClientViewSet, basename="clients")
router.register(r"client-requests", ClientRequestViewSet, basename="client_requests")
router.register(
    r"client-relationships", ClientRelationshipViewSet, basename="client_relationships"
)
router.register(
    r"client-requirements", ClientRequirementViewSet, basename="client_requirements"
)
router.register(r"features", FeatureViewSet, basename="features")
router.register(r"quotations", QuotationViewSet, basename="quotations")
router.register(r"quotation-items", QuotationItemViewSet, basename="quotation_items")
router.register(r"agreements", AgreementViewSet, basename="agreements")

router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'project-assignments', ProjectAssignedStaffsViewSet, basename='project-assignments')
router.register(r'project-tasks', ProjectTaskViewSet)
router.register(r'individual-projects-tasks',ProjectIndividualTaskViewSet, basename="individual-projects-tasks")
router.register(r'staff-assignments', StaffProjectAssignmentViewSet, basename='staff-assignments'),
router.register(r'induvidual-listing', StaffProjectAssignmentViewSet, basename='staff-assignments-induvidual')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path('api/send-project-email/', SendProjectEmailView.as_view(), name='send_project_email'),

    path("api/logout/", LogoutView.as_view({"post": "logout"}), name="logout"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Store Reports
urlpatterns += [
    path(
        "api/reports/inward-qty/",
        InwardQtyReportView.as_view(),
        name="inward-qty-report",
    ),
    path(
        "api/reports/outward-qty/",
        OutwardQtyReportView.as_view(),
        name="outward-qty-report",
    ),
    path(
        "api/reports/branch-wise-qty/",
        BranchWiseQtyReportView.as_view(),
        name="branch-wise-qty-report",
    ),
    path(
        "api/reports/expired-products/",
        ExpiredProductReportView.as_view(),
        name="expired-product-report",
    ),
    path(
        "api/reports/supplier-wise-products/",
        SupplierWiseProductReportView.as_view(),
        name="supplier-wise-product-report",
    ),
    path(
        "api/reports/opened-products/",
        OpenedProductReportView.as_view(),
        name="opened-product-report",
    ),
    path(
        "api/reports/closed-products/",
        ClosedProductReportView.as_view(),
        name="closed-product-report",
    ),
    path("api/reports/daily/", DailyReportView.as_view(), name="daily-report"),
    path(
        "api/reports/product-details/",
        ProductDetailsReportView.as_view(),
        name="product-details-report",
    ),
]

# Branch Reports
urlpatterns += [
    path(
        "api/branch/reports/daily/",
        BranchDailyReportView.as_view(),
        name="branch-daily-report",
    ),
    path(
        "api/branch/reports/product-details/",
        BranchProductDetailsReportView.as_view(),
        name="branch-product-details-report",
    ),
    path(
        "api/branch/reports/expired-products/",
        BranchExpiredProductReportView.as_view(),
        name="branch-expired-product-report",
    ),
]

# Dashboard URL
urlpatterns += [
    path("api/dashboard/", DashboardView.as_view(), name="dashboard"),
    path('api/branch-dashboard/', BranchDashboardView.as_view(), name='branch-dashboard'),
]
