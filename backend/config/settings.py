from datetime import timedelta
from environs import Env  # type: ignore
from pathlib import Path
from django.templatetags.static import static
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _


env = Env()
env.read_env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")


# Application definition

INSTALLED_APPS = [
    "unfold",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "apps.users.apps.UsersConfig",
    "apps.products.apps.ProductsConfig",
    "apps.branches.apps.BranchesConfig",
    "apps.suppliers.apps.SuppliersConfig",
    "apps.reports.apps.ReportsConfig",
    "apps.crm.apps.CrmConfig",
    "apps.accounts.apps.AccountsConfig",
    "apps.operations.apps.OperationsConfig",
    "apps.employees.apps.EmployeesConfig",
]

CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")

CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS")

CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "user": "1000/day",
    },
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
        "LOCATION": BASE_DIR / "media",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# if DEBUG:

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# else:
#     DATABASES = {
#             "default": {
#                 "ENGINE": "django.db.backends.postgresql",
#                 "NAME": "erp",
#                 "USER": "postgres",
#                 "PASSWORD": "1111",
#                 "HOST": "localhost",
#                 "PORT": "",
#             }
#         }

# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "/static/"
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5 MB

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=24),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=3),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(hours=24),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=3),
}

UNFOLD = {
    "SITE_TITLE": "Nasscript",
    "SITE_HEADER": "Nasscript",
    "SITE_URL": "https://website2024.nasscript.com",
    "SITE_ICON": lambda request: static("images/nasscript_logo.png"),
    "SITE_ICON": {
        "light": lambda request: static("images/nasscript_logo.png"),  # light mode
        "dark": lambda request: static("images/nasscript_logo.png"),  # dark mode
    },
    "SITE_LOGO": {
        "light": lambda request: static(
            "images/nasscript_full_banner_logo.png"
        ),  # light mode
        "dark": lambda request: static("images/nasscript_logo.png"),  # dark mode
    },
    "SITE_SYMBOL": "restaurant",
    "SITE_FAVICONS": [
        {
            "rel": "icon",
            "sizes": "32x32",
            "type": "image/svg+xml",
            "href": lambda request: static("images/nasscript_logo.png"),
        },
    ],
    "SHOW_HISTORY": False,
    "SHOW_VIEW_ON_SITE": True,
    "LOGIN": {
        "image": lambda request: static("images/nasscript_logo.png"),
        "redirect_after": lambda request: reverse_lazy("admin:users_user_changelist"),
    },
    "COLORS": {
        "primary": {
            "50": "250 245 255",
            "100": "243 232 255",
            "200": "233 213 255",
            "300": "216 180 254",
            "400": "192 132 252",
            "500": "168 85 247",
            "600": "147 51 234",
            "700": "126 34 206",
            "800": "107 33 168",
            "900": "88 28 135",
            "950": "59 7 100",
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {
                "en": "🇬🇧",
                "fr": "🇫🇷",
                "nl": "🇧🇪",
            },
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": _("Users"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Dashboard"),
                        "icon": "dashboard",
                        "link": reverse_lazy("admin:index"),
                        "permission": lambda request: request.user.is_superuser,
                    },
                    {
                        "title": _("Users"),
                        "icon": "people",
                        "link": reverse_lazy("admin:users_user_changelist"),
                    },
                ],
            },
            {
                "title": _("Products"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Products"),
                        "icon": "inventory_2",  # https://fonts.google.com/icons
                        "link": reverse_lazy("admin:products_product_changelist"),
                    },
                    {
                        "title": _("Categories"),
                        "icon": "category",  # https://fonts.google.com/icons
                        "link": reverse_lazy("admin:products_category_changelist"),
                    },
                    {
                        "title": _("Brands"),
                        "icon": "branding_watermark",  # https://fonts.google.com/icons
                        "link": reverse_lazy("admin:products_brand_changelist"),
                    },
                ],
            },
            {
                "title": _("Branches"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Branches"),
                        "icon": "warehouse",  # https://fonts.google.com/icons
                        "link": reverse_lazy("admin:branches_branch_changelist"),
                        "permission": lambda request: request.user.is_superuser,
                    },
                    {
                        "title": _("Branch products"),
                        "icon": "apps",
                        "link": reverse_lazy("admin:branches_branchproduct_changelist"),
                    },
                    {
                        "title": _("Product requests"),
                        "icon": "near_me",
                        "link": reverse_lazy(
                            "admin:branches_productrequest_changelist"
                        ),
                    },
                ],
            },
            {
                "title": _("Suppliers"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Suppliers"),
                        "icon": "local_shipping",
                        "link": reverse_lazy("admin:suppliers_supplier_changelist"),
                    },
                ],
            },
            {
                "title": _("Reports"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Product inflows"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:reports_productinflow_changelist"),
                    },
                    {
                        "title": _("Product outflows"),
                        "icon": "step_out",
                        "link": reverse_lazy("admin:reports_productoutflow_changelist"),
                    },
                ],
            },
            {
                "title": _("CRM"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Client Requests"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_clientrequest_changelist"),
                    },
                    {
                        "title": _("Client"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_client_changelist"),
                    },
                    {
                        "title": _("Client Relationships"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_clientrelationship_changelist"),
                    },
                    {
                        "title": _("Client Requirements"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_clientrequirement_changelist"),
                    },
                    {
                        "title": _("Requirement Images"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_requirementimage_changelist"),
                    },
                    {
                        "title": _("Features"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_feature_changelist"),
                    },
                    {
                        "title": _("Quotation Items"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_quotationitem_changelist"),
                    },
                    {
                        "title": _("Quotation"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_quotation_changelist"),
                    },
                    {
                        "title": _("Agreement"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_agreement_changelist"),
                    },
                    {
                        "title": _("Payment Terms"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_paymentterm_changelist"),
                    },
                    {
                        "title": _("Projects"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:crm_project_changelist"),
                    },
                ],
            },
            {
                "title": _("Employee Management"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Employees"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:employees_employee_changelist"),
                    },
                    {
                        "title": _("Positions"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:employees_position_changelist"),
                    },
                    {
                        "title": _("Departments"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:employees_department_changelist"),
                    },
                    {
                        "title": _("Attendances"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:employees_attendance_changelist"),
                    },
                    {
                        "title": _("Leaves"),
                        "icon": "step_into",
                        "link": reverse_lazy("admin:employees_leave_changelist"),
                    },
                ],
            },
            {
                "title": _("Operations"),
                "separator": True,
                "collapsible": True,
                "items": [
                    {
                        "title": _("Sidebar Sections"),
                        "icon": "view_sidebar",
                        "link": reverse_lazy(
                            "admin:operations_sidebarsection_changelist"
                        ),
                    },
                    {
                        "title": _("Sidebar Items"),
                        "icon": "settings",
                        "link": reverse_lazy("admin:operations_sidebaritem_changelist"),
                    },
                ],
            },
        ],
    },
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env.str("EMAIL_HOST")
EMAIL_PORT = env.int("EMAIL_PORT")
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS")
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = env.str("DEFAULT_FROM_EMAIL")
