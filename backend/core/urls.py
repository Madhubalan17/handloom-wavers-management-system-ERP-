"""
URL Configuration for Core HWMS Application.
Maps all endpoints to Class-Based Views (CBVs) and Function-Based Views (FBVs)
whose names precisely correspond to the Frontend UI screen & component names.
"""

from django.urls import path
from . import views
from . import fbv_views

urlpatterns = [
    # =========================================================================
    # CLASS-BASED VIEWS (CBV) — Matched to Frontend Screen & Component Names
    # =========================================================================

    # Screen 1 & 13: LoginPage & User Profile
    path('login-page/', views.LoginPageView.as_view(), name='cbv-login-page'),
    path('auth/login/', views.LoginPageView.as_view(), name='cbv-auth-login'),  # Standard alias
    path('logout-confirm-modal/', views.LogoutConfirmModalView.as_view(), name='cbv-logout-confirm-modal'),
    path('current-user-profile/', views.CurrentUserProfileView.as_view(), name='cbv-current-user-profile'),

    # Screen 2: ExactAdminDashboard / Dashboard Overview
    path('dashboard-overview/', views.DashboardOverviewView.as_view(), name='cbv-dashboard-overview'),
    path('dashboard/stats/', views.DashboardOverviewView.as_view(), name='cbv-dashboard-stats-alias'),
    path('monthly-production-overview/', views.MonthlyProductionOverviewView.as_view(), name='cbv-monthly-production-overview'),
    path('yarn-stock-overview/', views.YarnStockOverviewView.as_view(), name='cbv-yarn-stock-overview'),
    path('recent-weaver-registrations/', views.RecentWeaverRegistrationsView.as_view(), name='cbv-recent-weaver-registrations'),
    path('latest-activities/', views.LatestActivitiesView.as_view(), name='cbv-latest-activities'),
    path('quick-actions/', views.QuickActionsTriggerView.as_view(), name='cbv-quick-actions'),

    # Screen 3: WeaverManagementView
    path('weaver-management/', views.WeaverManagementView.as_view(), name='cbv-weaver-management'),
    path('weavers/', views.WeaverManagementView.as_view(), name='cbv-weavers-alias'),
    path('weaver-management/<int:pk>/', views.WeaverManagementDetailView.as_view(), name='cbv-weaver-management-detail'),
    path('weavers/<int:pk>/', views.WeaverManagementDetailView.as_view(), name='cbv-weavers-detail-alias'),

    # Screen 4 & Dedicated Full Page: AddWeaverPage
    path('add-weaver-page/', views.AddWeaverPageView.as_view(), name='cbv-add-weaver-page'),
    path('edit-weaver-page/<int:pk>/', views.EditWeaverPageView.as_view(), name='cbv-edit-weaver-page'),

    # Excel Import & Export Endpoints (CBV)
    path('weavers/export-excel/', views.WeaverExcelExportView.as_view(), name='cbv-weavers-export-excel'),
    path('weavers/import-excel/', views.WeaverExcelImportView.as_view(), name='cbv-weavers-import-excel'),
    path('weavers/sample-template/', views.WeaverSampleTemplateView.as_view(), name='cbv-weavers-sample-template'),

    # Screen 5 & 6: LoomManagementView, AddLoomPage & AddEditLoomModal
    path('loom-management/', views.LoomManagementView.as_view(), name='cbv-loom-management'),
    path('looms/', views.LoomManagementView.as_view(), name='cbv-looms-alias'),
    path('loom-management/<int:pk>/', views.LoomManagementDetailView.as_view(), name='cbv-loom-management-detail'),
    path('looms/<int:pk>/', views.LoomManagementDetailView.as_view(), name='cbv-looms-detail-alias'),
    path('add-loom-page/', views.AddLoomPageView.as_view(), name='cbv-add-loom-page'),
    path('edit-loom-page/<int:pk>/', views.EditLoomPageView.as_view(), name='cbv-edit-loom-page'),
    path('add-loom-modal/', views.AddLoomModalView.as_view(), name='cbv-add-loom-modal'),

    # Screen 7: YarnStockView, AddYarnStockPage & UpdateYarnStockModal
    path('yarn-stock/', views.YarnStockView.as_view(), name='cbv-yarn-stock'),
    path('stock/', views.YarnStockView.as_view(), name='cbv-stock-alias'),
    path('stock/<int:pk>/', views.EditYarnStockPageView.as_view(), name='cbv-stock-detail-alias'),
    path('add-stock-page/', views.AddYarnStockPageView.as_view(), name='cbv-add-stock-page'),
    path('edit-stock-page/<int:pk>/', views.EditYarnStockPageView.as_view(), name='cbv-edit-stock-page'),
    path('update-yarn-stock-modal/', views.UpdateYarnStockModalView.as_view(), name='cbv-update-yarn-stock-modal'),

    # Screen 8: ProductionTrackingView, AddProductionRecordPage & AddProductionRecordModal
    path('production-tracking/', views.ProductionTrackingView.as_view(), name='cbv-production-tracking'),
    path('production/', views.ProductionTrackingView.as_view(), name='cbv-production-alias'),
    path('production/<int:pk>/', views.EditProductionRecordPageView.as_view(), name='cbv-production-detail-alias'),
    path('add-production-page/', views.AddProductionRecordPageView.as_view(), name='cbv-add-production-page'),
    path('edit-production-page/<int:pk>/', views.EditProductionRecordPageView.as_view(), name='cbv-edit-production-page'),
    path('add-production-record-modal/', views.AddProductionRecordModalView.as_view(), name='cbv-add-production-record-modal'),

    # Screen 9: SalaryManagementView, AddSalaryPage & AddSalaryModal
    path('salary-management/', views.SalaryManagementView.as_view(), name='cbv-salary-management'),
    path('salaries/', views.SalaryManagementView.as_view(), name='cbv-salaries-alias'),
    path('salaries/<int:pk>/', views.EditSalaryPageView.as_view(), name='cbv-salaries-detail-alias'),
    path('add-salary-page/', views.AddSalaryPageView.as_view(), name='cbv-add-salary-page'),
    path('edit-salary-page/<int:pk>/', views.EditSalaryPageView.as_view(), name='cbv-edit-salary-page'),
    path('add-salary-modal/', views.AddSalaryModalView.as_view(), name='cbv-add-salary-modal'),
    path('disburse-salary/<int:pk>/', views.DisburseSalaryActionView.as_view(), name='cbv-disburse-salary'),

    # Screen 10: ReportsView & Exports
    path('reports-view/', views.ReportsView.as_view(), name='cbv-reports-view'),
    path('reports/production/', views.ProductionReportExportView.as_view(), name='cbv-reports-production'),
    path('reports/payment/', views.PaymentReportExportView.as_view(), name='cbv-reports-payment'),
    path('reports/stock/', views.StockReportExportView.as_view(), name='cbv-reports-stock'),

    # Screen 11: SettingsView & UserManagementView
    path('settings-view/', views.SettingsView.as_view(), name='cbv-settings-view'),
    path('user-management/', views.UserManagementView.as_view(), name='cbv-user-management'),
    path('users/', views.UserManagementView.as_view(), name='cbv-users-alias'),
    path('user-management/<int:pk>/', views.UserManagementDetailView.as_view(), name='cbv-user-management-detail'),
    path('users/<int:pk>/', views.UserManagementDetailView.as_view(), name='cbv-users-detail-alias'),
    path('change-password-modal/', views.ChangePasswordModalView.as_view(), name='cbv-change-password-modal'),


    # =========================================================================
    # FUNCTION-BASED VIEWS (FBV) — Mounted under /api/fbv/...
    # =========================================================================
    path('fbv/login-page/', fbv_views.login_page_view, name='fbv-login-page'),
    path('fbv/logout-confirm-modal/', fbv_views.logout_confirm_modal_view, name='fbv-logout-confirm-modal'),
    path('fbv/dashboard-overview/', fbv_views.dashboard_overview_view, name='fbv-dashboard-overview'),
    path('fbv/monthly-production-overview/', fbv_views.monthly_production_overview_view, name='fbv-monthly-production-overview'),
    path('fbv/yarn-stock-overview/', fbv_views.yarn_stock_overview_view, name='fbv-yarn-stock-overview'),
    path('fbv/recent-weaver-registrations/', fbv_views.recent_weaver_registrations_view, name='fbv-recent-weaver-registrations'),
    path('fbv/latest-activities/', fbv_views.latest_activities_view, name='fbv-latest-activities'),

    path('fbv/weaver-management/', fbv_views.weaver_management_view, name='fbv-weaver-management'),
    path('fbv/weaver-management/<int:pk>/', fbv_views.weaver_management_detail_view, name='fbv-weaver-management-detail'),
    path('fbv/add-weaver-page/', fbv_views.add_weaver_page_view, name='fbv-add-weaver-page'),
    path('fbv/weavers/export-excel/', fbv_views.export_weavers_excel_view, name='fbv-weavers-export-excel'),
    path('fbv/weavers/import-excel/', fbv_views.import_weavers_excel_view, name='fbv-weavers-import-excel'),
    path('fbv/weavers/sample-template/', fbv_views.download_weavers_sample_template_view, name='fbv-weavers-sample-template'),

    path('fbv/loom-management/', fbv_views.loom_management_view, name='fbv-loom-management'),
    path('fbv/add-loom-page/', fbv_views.add_loom_page_view, name='fbv-add-loom-page'),
    path('fbv/edit-loom-page/<int:pk>/', fbv_views.edit_loom_page_view, name='fbv-edit-loom-page'),
    path('fbv/add-loom-modal/', fbv_views.add_loom_modal_view, name='fbv-add-loom-modal'),

    path('fbv/yarn-stock/', fbv_views.yarn_stock_view, name='fbv-yarn-stock'),
    path('fbv/update-yarn-stock-modal/', fbv_views.update_yarn_stock_modal_view, name='fbv-update-yarn-stock-modal'),

    path('fbv/production-tracking/', fbv_views.production_tracking_view, name='fbv-production-tracking'),
    path('fbv/add-production-record-modal/', fbv_views.add_production_record_modal_view, name='fbv-add-production-record-modal'),

    path('fbv/salary-management/', fbv_views.salary_management_view, name='fbv-salary-management'),
    path('fbv/add-salary-modal/', fbv_views.add_salary_modal_view, name='fbv-add-salary-modal'),

    path('fbv/reports-view/', fbv_views.reports_view, name='fbv-reports-view'),
    path('fbv/settings-view/', fbv_views.settings_view, name='fbv-settings-view'),
    path('fbv/user-management/', fbv_views.user_management_view, name='fbv-user-management'),
    path('fbv/user-management/<int:pk>/', fbv_views.user_management_detail_view, name='fbv-user-management-detail'),
]
