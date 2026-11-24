from import_export import resources, fields
from .models import Weaver, Loom, YarnStock, ProductionRecord, SalaryRecord, UserProfile

class WeaverResource(resources.ModelResource):
    class Meta:
        model = Weaver
        fields = (
            'id', 'name', 'village', 'phone', 'status', 'gender', 'age',
            'father_spouse', 'artisan_card_no', 'address', 'pincode',
            'assigned_loom', 'loom_type', 'experience_years', 'specialty',
            'daily_capacity', 'bank_name', 'bank_account', 'ifsc_code', 'created_at'
        )
        export_order = fields
        import_id_fields = ['phone']  # Match or update by unique phone number if id is not present


class LoomResource(resources.ModelResource):
    class Meta:
        model = Loom
        fields = ('id', 'loom_no', 'loom_type', 'status', 'assigned_weaver', 'cluster_village', 'daily_capacity', 'reed_width', 'remarks')
        export_order = fields
        import_id_fields = ['loom_no']


class YarnStockResource(resources.ModelResource):
    class Meta:
        model = YarnStock
        fields = ('id', 'yarn_type', 'quantity_kg', 'status', 'unit_price', 'supplier', 'updated_at')
        export_order = fields
        import_id_fields = ['yarn_type']


class ProductionRecordResource(resources.ModelResource):
    class Meta:
        model = ProductionRecord
        fields = ('id', 'weaver_name', 'loom_no', 'meters_produced', 'fabric_type', 'production_date', 'remarks')
        export_order = fields


class SalaryRecordResource(resources.ModelResource):
    class Meta:
        model = SalaryRecord
        fields = ('id', 'weaver_name', 'month', 'amount', 'status', 'payment_date', 'transaction_ref')
        export_order = fields


class UserProfileResource(resources.ModelResource):
    class Meta:
        model = UserProfile
        fields = ('id', 'name', 'email', 'role', 'phone', 'village', 'status', 'last_login_str')
        export_order = fields
        import_id_fields = ['email']
