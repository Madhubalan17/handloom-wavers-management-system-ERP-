from django.contrib import admin
from django.utils.html import mark_safe
from import_export.admin import ImportExportModelAdmin
from .models import UserProfile, Weaver, Loom, YarnStock, ProductionRecord, SalaryRecord
from .resources import (
    UserProfileResource,
    WeaverResource,
    LoomResource,
    YarnStockResource,
    ProductionRecordResource,
    SalaryRecordResource,
)

@admin.register(UserProfile)
class UserProfileAdmin(ImportExportModelAdmin):
    resource_classes = [UserProfileResource]
    list_display = ('id', 'avatar_preview', 'name', 'email', 'role', 'status', 'last_login_str')
    list_filter = ('role', 'status')
    search_fields = ('name', 'email', 'phone')

    def avatar_preview(self, obj):
        if obj.avatar:
            url = obj.avatar.url if hasattr(obj.avatar, 'url') else str(obj.avatar)
            return mark_safe(f'<img src="{url}" width="36" height="36" style="border-radius:50%;object-fit:cover;" />')
        return mark_safe('<span style="color:#999;">No Image</span>')
    avatar_preview.short_description = 'Avatar'


@admin.register(Weaver)
class WeaverAdmin(ImportExportModelAdmin):
    resource_classes = [WeaverResource]
    list_display = ('id', 'photo_preview', 'name', 'village', 'phone', 'assigned_loom', 'loom_type', 'status')
    list_filter = ('village', 'status', 'loom_type', 'gender')
    search_fields = ('name', 'village', 'phone', 'assigned_loom', 'artisan_card_no')

    def photo_preview(self, obj):
        if obj.avatar:
            url = obj.avatar.url if hasattr(obj.avatar, 'url') else str(obj.avatar)
            return mark_safe(f'<img src="{url}" width="38" height="38" style="border-radius:50%;object-fit:cover;" />')
        return mark_safe('<span style="color:#999;">No Photo</span>')
    photo_preview.short_description = 'Photo'


@admin.register(Loom)
class LoomAdmin(ImportExportModelAdmin):
    resource_classes = [LoomResource]
    list_display = ('loom_no', 'loom_preview', 'loom_type', 'status', 'assigned_weaver', 'cluster_village')
    list_filter = ('loom_type', 'status', 'cluster_village')
    search_fields = ('loom_no', 'assigned_weaver')

    def loom_preview(self, obj):
        if obj.image:
            url = obj.image.url if hasattr(obj.image, 'url') else str(obj.image)
            return mark_safe(f'<img src="{url}" width="50" height="38" style="border-radius:6px;object-fit:cover;" />')
        return mark_safe('<span style="color:#999;">No Image</span>')
    loom_preview.short_description = 'Loom Image'


@admin.register(YarnStock)
class YarnStockAdmin(ImportExportModelAdmin):
    resource_classes = [YarnStockResource]
    list_display = ('yarn_type', 'quantity_kg', 'status', 'unit_price', 'supplier', 'updated_at')
    list_filter = ('status',)
    search_fields = ('yarn_type', 'supplier')


@admin.register(ProductionRecord)
class ProductionRecordAdmin(ImportExportModelAdmin):
    resource_classes = [ProductionRecordResource]
    list_display = ('weaver_name', 'loom_no', 'meters_produced', 'fabric_type', 'production_date')
    list_filter = ('production_date', 'fabric_type')
    search_fields = ('weaver_name', 'loom_no')


@admin.register(SalaryRecord)
class SalaryRecordAdmin(ImportExportModelAdmin):
    resource_classes = [SalaryRecordResource]
    list_display = ('weaver_name', 'month', 'amount', 'status', 'payment_date', 'transaction_ref')
    list_filter = ('status', 'month')
    search_fields = ('weaver_name', 'transaction_ref')
