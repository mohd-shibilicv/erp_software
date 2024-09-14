from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.contrib.auth import get_user_model
from apps.branches.serializers import BranchSerializer


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    managed_branch = BranchSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'password', 'role', 'managed_branch','is_active']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        user_data = UserSerializer(self.user).data

        data['user'] = user_data
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
    
class UserCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'password', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'is_active': {'default': True}
        }

    def create(self, validated_data):
        validated_data['is_active'] = True 
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        is_active = validated_data.get('is_active', instance.is_active) 
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
        user.is_active = is_active
        user.save()
        return user
