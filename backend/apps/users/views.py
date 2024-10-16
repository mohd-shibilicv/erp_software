from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, LoginSerializer, UserCreateUpdateSerializer
from .models import User


User = get_user_model()


def landing(request):
    return render(request, 'users/landing.html')


class UserRegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["POST"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class LoginViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)
    http_method_names = ["post"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class LogoutView(viewsets.ViewSet):
    permission_classes = (permissions.AllowAny,)

    @action(detail=False, methods=["post"])
    def logout(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Successfully logged out"}, status=status.HTTP_200_OK
            )
        except TokenError as e:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (permissions.AllowAny,)
    http_method_names = ["post"]  

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'staff':
            return User.objects.filter(username=user.username)
        elif user.role == 'staff':
            return User.objects.filter(username=user.username)
        return User.objects.none()

    @action(detail=False, methods=["get"])
    def unassigned_managers(self, request):
        unassigned_managers = User.objects.filter(role='branch_manager', managed_branch__isnull=True)
        serializer = UserSerializer(unassigned_managers, many=True)
        return Response(serializer.data)


class BranchManagerViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='branch_manager')
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        return UserCreateUpdateSerializer

    def perform_create(self, serializer):
        serializer.save(role='branch_manager')

    def perform_update(self, serializer):
        serializer.save(role='branch_manager')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class StaffManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role='staff')
    serializer_class = UserCreateUpdateSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(role='staff')

    def perform_update(self, serializer):
        serializer.save(role='staff')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def list(self, request, *args, **kwargs):
        """List all staff members"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    

