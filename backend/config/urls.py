from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from apps.users.views import (
    landing,
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
    SendProjectEmailView,
    CrmDashboardView,
)
from apps.accounts.views import (
    NatureGroupViewSet,
    MainGroupViewSet,
    LedgerViewSet,
)
from apps.operations.views import GroupMailingView, SidebarConfigView
from apps.employees.views import (
    DepartmentViewSet,
    PositionViewSet,
    EmployeeViewSet,
    AttendanceViewSet,
    LeaveViewSet,
    PerformanceViewSet,
    PayrollViewSet,
    TrainingViewSet,
    VPTrackViewSet,
)
from apps.transactions.views import (
    PurchaseRequestViewSet,
    PurchaseRequestItemViewSet,
    LocalPurchaseOrderViewSet,
    LocalPurchaseOrderItemViewSet,
    PurchaseViewSet,
    PurchaseItemViewSet,
    PurchaseReturnViewSet,
    PurchaseReturnItemViewSet,
    SalesOrderViewSet,
    SalesOrderItemViewSet,
    SaleViewSet,
    SaleItemViewSet,
    SalesReturnViewSet,
    SalesReturnItemViewSet,
)
from apps.companies.views import (
    AnnualMaintenanceCostViewSet,
    CompanyDetailsViewSet,
    VehicleDetailsViewSet)


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

# Accounts
router.register(r"nature-groups", NatureGroupViewSet)
router.register(r"main-groups", MainGroupViewSet)
router.register(r"ledgers", LedgerViewSet)

router.register(r"projects", ProjectViewSet, basename="project")
router.register(
    r"project-assignments", ProjectAssignedStaffsViewSet, basename="project-assignments"
)
router.register(r"project-tasks", ProjectTaskViewSet)
router.register(
    r"individual-projects-tasks",
    ProjectIndividualTaskViewSet,
    basename="individual-projects-tasks",
)
router.register(
    r"staff-assignments", StaffProjectAssignmentViewSet, basename="staff-assignments"
),
router.register(
    r"induvidual-listing",
    StaffProjectAssignmentViewSet,
    basename="staff-assignments-induvidual",
)

# Employees
router.register(r'departments', DepartmentViewSet)
router.register(r'positions', PositionViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'leaves', LeaveViewSet)
router.register(r'performance', PerformanceViewSet)
router.register(r'payroll', PayrollViewSet)
router.register(r'training', TrainingViewSet)
router.register(r'vptracks', VPTrackViewSet)
router.register(r"departments", DepartmentViewSet)
router.register(r"positions", PositionViewSet)
router.register(r"employees", EmployeeViewSet)
router.register(r"attendance", AttendanceViewSet)
router.register(r"leaves", LeaveViewSet)
router.register(r"performance", PerformanceViewSet)
router.register(r"payroll", PayrollViewSet)
router.register(r"training", TrainingViewSet)

# Transactions
router.register(r"purchase-requests", PurchaseRequestViewSet)
router.register(r"purchase-request-items", PurchaseRequestItemViewSet)
router.register(r"local-purchase-orders", LocalPurchaseOrderViewSet)
router.register(r"local-purchase-order-items", LocalPurchaseOrderItemViewSet)
router.register(r"purchases", PurchaseViewSet)
router.register(r"purchase-items", PurchaseItemViewSet)
router.register(r"purchase-returns", PurchaseReturnViewSet)
router.register(r"purchase-return-items", PurchaseReturnItemViewSet)
router.register(r"sales-orders", SalesOrderViewSet)
router.register(r"sales-order-items", SalesOrderItemViewSet)
router.register(r"sales", SaleViewSet)
router.register(r"sale-items", SaleItemViewSet)
router.register(r"sales-returns", SalesReturnViewSet)
router.register(r"sales-return-items", SalesReturnItemViewSet)

# Companies
router.register(r'company-details', CompanyDetailsViewSet)
router.register(r'vehicles', VehicleDetailsViewSet)
router.register(r'amc', AnnualMaintenanceCostViewSet)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", landing, name="landing"),
    path("api/", include(router.urls)),
    path(
        "api/send-project-email/",
        SendProjectEmailView.as_view(),
        name="send_project_email",
    ),
    path("api/sidebar-config/", SidebarConfigView.as_view(), name="sidebar-config"),
    path("api/group-mailing/", GroupMailingView.as_view(), name="group-mailing"),
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
    path(
        "api/branch-dashboard/", BranchDashboardView.as_view(), name="branch-dashboard"
    ),
    path("api/crm-dashboard/", CrmDashboardView.as_view(), name="crm-dashboard"),
]
