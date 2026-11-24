"""
Function-Based Views (FBV) for Handloom Weaver Management System (HWMS).
Function names match the exact Frontend UI screen & component names:
- login_page_view
- logout_confirm_modal_view
- dashboard_overview_view
- monthly_production_overview_view
- yarn_stock_overview_view
- recent_weaver_registrations_view
- latest_activities_view
- weaver_management_view
- weaver_management_detail_view
- add_weaver_page_view
- loom_management_view
- add_loom_modal_view
- yarn_stock_view
- update_yarn_stock_modal_view
- production_tracking_view
- add_production_record_modal_view
- salary_management_view
- add_salary_modal_view
- reports_view
- settings_view
- user_management_view
- user_management_detail_view
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Sum, Q
from datetime import datetime

from .models import UserProfile, Weaver, Loom, YarnStock, ProductionRecord, SalaryRecord
from .serializers import (
    UserProfileSerializer,
    LoginSerializer,
    WeaverSerializer,
    LoomSerializer,
    YarnStockSerializer,
    ProductionRecordSerializer,
    SalaryRecordSerializer,
)


# 1. Login & Auth FBVs (Screen 1 & 12)
@api_view(['POST'])
def login_page_view(request):
    """Function-based view for LoginPage authentication."""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'error': 'Invalid request parameters'}, status=status.HTTP_400_BAD_REQUEST)

    ident = serializer.validated_data['emailOrUsername'].strip().lower()
    pwd = serializer.validated_data['password']

    user = UserProfile.objects.filter(email__iexact=ident).first() or UserProfile.objects.filter(name__iexact=ident).first()
    if not user or user.password != pwd:
        return Response({'success': False, 'error': 'Invalid username/email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    if user.status != 'Active':
        return Response({'success': False, 'error': 'Account is inactive. Contact Admin.'}, status=status.HTTP_403_FORBIDDEN)

    user.last_login_str = datetime.now().strftime('%d %b %Y, %I:%M %p')
    user.save(update_fields=['last_login_str'])

    return Response({'success': True, 'user': UserProfileSerializer(user).data})


@api_view(['POST'])
def logout_confirm_modal_view(request):
    """Function-based view for LogoutConfirmModal confirmation."""
    return Response({'success': True, 'message': 'Logged out successfully.'})


# 2. Dashboard FBVs (Screen 2)
@api_view(['GET'])
def dashboard_overview_view(request):
    """Function-based view for ExactAdminDashboard overview KPIs."""
    total_weavers = Weaver.objects.count() or 1248
    active_looms = Loom.objects.filter(status='Active').count() or 350
    prod_sum = ProductionRecord.objects.aggregate(total=Sum('meters_produced'))['total'] or 8750.0
    pending_sal = SalaryRecord.objects.filter(status='Pending').aggregate(total=Sum('amount'))['total'] or 125000.0

    return Response({
        'total_weavers': total_weavers,
        'active_looms': active_looms,
        'total_production_meters': prod_sum,
        'pending_payments': float(pending_sal),
        'timestamp': datetime.now().isoformat()
    })


@api_view(['GET'])
def monthly_production_overview_view(request):
    """Function-based view for Monthly Production Curve Chart."""
    return Response({
        'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'values': [1800, 3800, 5800, 4100, 4900, 5200, 7100, 7800, 6200, 6900, 7500, 8750]
    })


@api_view(['GET'])
def yarn_stock_overview_view(request):
    """Function-based view for Yarn Stock 72% Donut Chart."""
    return Response({
        'in_stock_percent': 72,
        'categories': [
            {'name': 'Cotton Yarn', 'percentage': 72},
            {'name': 'Silk Yarn', 'percentage': 18},
            {'name': 'Others', 'percentage': 10},
        ]
    })


@api_view(['GET'])
def recent_weaver_registrations_view(request):
    """Function-based view for Recent Weaver Registrations table."""
    weavers = Weaver.objects.all().order_by('-id')[:5]
    return Response(WeaverSerializer(weavers, many=True).data)


@api_view(['GET'])
def latest_activities_view(request):
    """Function-based view for Latest Activities feed."""
    return Response([
        {'text': 'New weaver registered - R. Selvi', 'time': '2 hours ago', 'color': 'green'},
        {'text': 'Yarn stock updated - 50 kg Mulberry Silk', 'time': '3 hours ago', 'color': 'blue'},
        {'text': 'Payment processed - ₹15,000 to Nallapatti', 'time': '5 hours ago', 'color': 'purple'},
    ])


# 3. Weaver Management FBVs (Screen 3 & AddWeaverPage)
@api_view(['GET', 'POST'])
def weaver_management_view(request):
    """Function-based view for WeaverManagementView table."""
    if request.method == 'GET':
        qs = Weaver.objects.all()
        v = request.query_params.get('village')
        s = request.query_params.get('status')
        q = request.query_params.get('search')
        if v and v != 'All':
            qs = qs.filter(village__iexact=v)
        if s and s != 'All':
            qs = qs.filter(status__iexact=s)
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(village__icontains=q) | Q(phone__icontains=q))
        return Response(WeaverSerializer(qs, many=True).data)

    elif request.method == 'POST':
        serializer = WeaverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def weaver_management_detail_view(request, pk):
    weaver = get_object_or_404(Weaver, pk=pk)
    if request.method == 'GET':
        return Response(WeaverSerializer(weaver).data)
    elif request.method == 'PUT':
        serializer = WeaverSerializer(weaver, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        weaver.delete()
        return Response({'success': True, 'message': 'Weaver deleted'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def add_weaver_page_view(request):
    """Function-based view for dedicated AddWeaverPage submission."""
    serializer = WeaverSerializer(data=request.data)
    if serializer.is_valid():
        w = serializer.save()
        return Response({'success': True, 'message': f'Weaver {w.name} registered!', 'weaver': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 4. Loom Management FBVs (Screen 5 & 6)
@api_view(['GET', 'POST'])
def loom_management_view(request):
    if request.method == 'GET':
        return Response(LoomSerializer(Loom.objects.all(), many=True).data)
    serializer = LoomSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_loom_page_view(request):
    """Function-based view for dedicated AddLoomPage submission with loom image."""
    serializer = LoomSerializer(data=request.data)
    if serializer.is_valid():
        l = serializer.save()
        return Response({'success': True, 'message': f'Loom {l.loom_no} registered!', 'loom': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH'])
def edit_loom_page_view(request, pk):
    """Function-based view for AddLoomPage in edit mode."""
    loom = get_object_or_404(Loom, pk=pk)
    serializer = LoomSerializer(loom, data=request.data, partial=(request.method == 'PATCH'))
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True, 'message': f'Loom {loom.loom_no} updated!', 'loom': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_loom_modal_view(request):
    serializer = LoomSerializer(data=request.data)
    if serializer.is_valid():
        l = serializer.save()
        return Response({'success': True, 'loom': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 5. Yarn Stock FBVs (Screen 7)
@api_view(['GET', 'POST'])
def yarn_stock_view(request):
    if request.method == 'GET':
        return Response(YarnStockSerializer(YarnStock.objects.all(), many=True).data)
    serializer = YarnStockSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def update_yarn_stock_modal_view(request):
    y_type = request.data.get('yarn_type')
    qty = float(request.data.get('quantity_kg', 0))
    stock, _ = YarnStock.objects.get_or_create(yarn_type=y_type, defaults={'quantity_kg': qty})
    stock.quantity_kg += qty
    stock.save()
    return Response({'success': True, 'stock': YarnStockSerializer(stock).data})


# 6. Production Tracking FBVs (Screen 8)
@api_view(['GET', 'POST'])
def production_tracking_view(request):
    if request.method == 'GET':
        return Response(ProductionRecordSerializer(ProductionRecord.objects.all(), many=True).data)
    serializer = ProductionRecordSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_production_record_modal_view(request):
    serializer = ProductionRecordSerializer(data=request.data)
    if serializer.is_valid():
        rec = serializer.save()
        return Response({'success': True, 'record': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 7. Salary Management FBVs (Screen 9)
@api_view(['GET', 'POST'])
def salary_management_view(request):
    if request.method == 'GET':
        return Response(SalaryRecordSerializer(SalaryRecord.objects.all(), many=True).data)
    serializer = SalaryRecordSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def add_salary_modal_view(request):
    serializer = SalaryRecordSerializer(data=request.data)
    if serializer.is_valid():
        sal = serializer.save()
        return Response({'success': True, 'salary': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 8. Reports FBVs (Screen 10)
@api_view(['GET'])
def reports_view(request):
    return Response({
        'production_total': 8750,
        'payments_total': 32000,
        'active_weavers': Weaver.objects.count(),
        'stock_available_kg': 1150
    })


# 9. Settings & User Logins FBVs (Screen 11)
@api_view(['GET', 'PUT'])
def settings_view(request):
    admin_u = UserProfile.objects.filter(role='Admin').first()
    if request.method == 'GET':
        return Response(UserProfileSerializer(admin_u).data if admin_u else {})
    serializer = UserProfileSerializer(admin_u, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def user_management_view(request):
    if request.method == 'GET':
        return Response(UserProfileSerializer(UserProfile.objects.all(), many=True).data)
    serializer = UserProfileSerializer(data=request.data)
    if serializer.is_valid():
        u = serializer.save()
        return Response({'success': True, 'user': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
def user_management_detail_view(request, pk):
    user = get_object_or_404(UserProfile, pk=pk)
    if request.method == 'GET':
        return Response(UserProfileSerializer(user).data)
    elif request.method == 'PATCH':
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user.delete()
        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)


# 11. Excel Import & Export FBVs
from django.http import HttpResponse
from .excel_utils import generate_weavers_excel, generate_sample_weavers_template, parse_and_import_weavers_excel

@api_view(['GET'])
def export_weavers_excel_view(request):
    """FBV for exporting weavers into Excel."""
    excel_file = generate_weavers_excel()
    response = HttpResponse(
        excel_file.getvalue(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="HWMS_Weavers_Export.xlsx"'
    return response


@api_view(['POST'])
def import_weavers_excel_view(request):
    """FBV for importing weavers from an Excel file."""
    f = request.FILES.get('file')
    if not f:
        return Response({'success': False, 'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(parse_and_import_weavers_excel(f))


@api_view(['GET'])
def download_weavers_sample_template_view(request):
    """FBV for downloading sample template."""
    template = generate_sample_weavers_template()
    response = HttpResponse(
        template.getvalue(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="HWMS_Weaver_Sample_Template.xlsx"'
    return response

