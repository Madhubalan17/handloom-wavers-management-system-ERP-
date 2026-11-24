import base64
import uuid
from django.core.files.base import ContentFile
from rest_framework import serializers
from .models import UserProfile, Weaver, Loom, YarnStock, ProductionRecord, SalaryRecord


class Base64OrImageField(serializers.ImageField):
    """
    Custom ImageField that supports:
    1. Standard multipart/form-data file upload (File / UploadedFile)
    2. Base64 data URI string (data:image/png;base64,iVBORw0KGgo...)
    3. Existing URL or empty string
    """
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            try:
                header, base64_str = data.split(';base64,')
                ext = header.split('/')[-1].split('+')[0]
                if ext == 'jpeg':
                    ext = 'jpg'
                file_name = f"img_{uuid.uuid4().hex[:10]}.{ext}"
                decoded_file = base64.b64decode(base64_str)
                data = ContentFile(decoded_file, name=file_name)
            except Exception as e:
                raise serializers.ValidationError(f"Invalid base64 image data: {str(e)}")
        elif isinstance(data, str) and (data.startswith('http://') or data.startswith('https://') or data.startswith('/media/')):
            # If string is an existing URL, don't re-upload
            return None
        elif not data:
            return None
        return super().to_internal_value(data)

    def to_representation(self, value):
        if not value:
            return ''
        url = getattr(value, 'url', None)
        if url:
            request = self.context.get('request', None)
            if request:
                return request.build_absolute_uri(url)
            return url
        return str(value)


class UserProfileSerializer(serializers.ModelSerializer):
    avatar = Base64OrImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    emailOrUsername = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class WeaverSerializer(serializers.ModelSerializer):
    avatar = Base64OrImageField(required=False, allow_null=True)

    class Meta:
        model = Weaver
        fields = '__all__'

    def to_internal_value(self, data):
        data_copy = data.copy() if hasattr(data, 'copy') else dict(data)
        mappings = {
            'fatherSpouse': 'father_spouse',
            'artisanCardNo': 'artisan_card_no',
            'assignedLoom': 'assigned_loom',
            'loomType': 'loom_type',
            'experienceYears': 'experience_years',
            'dailyCapacity': 'daily_capacity',
            'bankName': 'bank_name',
            'bankAccount': 'bank_account',
            'ifscCode': 'ifsc_code',
        }
        for camel, snake in mappings.items():
            if camel in data_copy and snake not in data_copy:
                data_copy[snake] = data_copy[camel]
        return super().to_internal_value(data_copy)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['fatherSpouse'] = instance.father_spouse
        ret['artisanCardNo'] = instance.artisan_card_no
        ret['assignedLoom'] = instance.assigned_loom
        ret['loomType'] = instance.loom_type
        ret['experienceYears'] = instance.experience_years
        ret['dailyCapacity'] = instance.daily_capacity
        ret['bankName'] = instance.bank_name
        ret['bankAccount'] = instance.bank_account
        ret['ifscCode'] = instance.ifsc_code
        return ret


class LoomSerializer(serializers.ModelSerializer):
    image = Base64OrImageField(required=False, allow_null=True)

    class Meta:
        model = Loom
        fields = '__all__'

    def to_internal_value(self, data):
        data_copy = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'loomNo' in data_copy and 'loom_no' not in data_copy:
            data_copy['loom_no'] = data_copy['loomNo']
        if 'type' in data_copy and 'loom_type' not in data_copy:
            data_copy['loom_type'] = data_copy['type']
        if 'village' in data_copy and 'cluster_village' not in data_copy:
            data_copy['cluster_village'] = data_copy['village']
        if 'assignedWeaver' in data_copy and 'assigned_weaver' not in data_copy:
            data_copy['assigned_weaver'] = data_copy['assignedWeaver']
        if 'dailyCapacity' in data_copy and 'daily_capacity' not in data_copy:
            data_copy['daily_capacity'] = data_copy['dailyCapacity']
        if 'reedWidth' in data_copy and 'reed_width' not in data_copy:
            data_copy['reed_width'] = data_copy['reedWidth']
        return super().to_internal_value(data_copy)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['loomNo'] = instance.loom_no
        ret['type'] = instance.loom_type
        ret['village'] = instance.cluster_village
        ret['assignedWeaver'] = instance.assigned_weaver
        ret['dailyCapacity'] = instance.daily_capacity
        ret['reedWidth'] = instance.reed_width
        return ret


class YarnStockSerializer(serializers.ModelSerializer):
    image = Base64OrImageField(required=False, allow_null=True)

    class Meta:
        model = YarnStock
        fields = '__all__'


class ProductionRecordSerializer(serializers.ModelSerializer):
    fabric_image = Base64OrImageField(required=False, allow_null=True)

    class Meta:
        model = ProductionRecord
        fields = '__all__'


class SalaryRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryRecord
        fields = '__all__'
