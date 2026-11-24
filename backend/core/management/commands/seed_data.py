from django.core.management.base import BaseCommand
from datetime import date
from core.models import UserProfile, Weaver, Loom, YarnStock, ProductionRecord, SalaryRecord

class Command(BaseCommand):
    help = 'Seeds initial users, weavers, looms, stock, production records, and salaries.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding HWMS database with initial records...'))

        # 1. Seed User Profiles (matching requested 5 roles)
        users_data = [
            {
                'name': 'Admin Director',
                'email': 'admin@handloom.com',
                'password': 'admin123',
                'role': 'Admin',
                'phone': '9876543200',
                'village': 'Head Office - Erode',
                'status': 'Active',
                'last_login_str': '24 Nov 2026, 10:30 AM',
                'avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            },
            {
                'name': 'Ananya Sharma',
                'email': 'manager@handloom.com',
                'password': 'manager123',
                'role': 'Manager',
                'phone': '9876543201',
                'village': 'District Office - Salem',
                'status': 'Active',
                'last_login_str': '24 Nov 2026, 09:15 AM',
                'avatar': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
            },
            {
                'name': 'K. Ramesh',
                'email': 'staff@handloom.com',
                'password': 'staff123',
                'role': 'Staff',
                'phone': '9876543202',
                'village': 'Thingalur Cluster',
                'status': 'Active',
                'last_login_str': '23 Nov 2026, 04:45 PM',
                'avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            },
            {
                'name': 'G. Soundararajan',
                'email': 'storekeeper@handloom.com',
                'password': 'store123',
                'role': 'Storekeeper',
                'phone': '9876543203',
                'village': 'Central Yarn Depot',
                'status': 'Active',
                'last_login_str': '24 Nov 2026, 08:00 AM',
                'avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
            },
            {
                'name': 'R. Selvi',
                'email': 'weaver@handloom.com',
                'password': 'weaver123',
                'role': 'Weaver',
                'phone': '9876543210',
                'village': 'Nallapatti',
                'status': 'Active',
                'last_login_str': '23 Nov 2026, 06:10 PM',
                'avatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
            },
        ]

        for u in users_data:
            user, created = UserProfile.objects.update_or_create(
                email=u['email'],
                defaults=u
            )
            if created:
                self.stdout.write(f"Created user: {user.name} ({user.role})")

        # 2. Seed Weavers (matching Screen 3 mockup)
        weavers_data = [
            {
                'name': 'R. Selvi',
                'village': 'Nallapatti',
                'phone': '9876543210',
                'status': 'Active',
                'gender': 'Female',
                'age': '38',
                'assigned_loom': 'L-001',
                'loom_type': 'Handloom',
                'specialty': 'Pure Silk & Zari Weaving',
                'address': '12 North Weavers Street, Nallapatti',
            },
            {
                'name': 'M. Kumar',
                'village': 'Thingalur',
                'phone': '9876543211',
                'status': 'Active',
                'gender': 'Male',
                'age': '42',
                'assigned_loom': 'L-002',
                'loom_type': 'Power Loom',
                'specialty': 'Fine Cotton Dhotis',
                'address': '45 Gandhi Nagar, Thingalur',
            },
            {
                'name': 'P. Lakshmi',
                'village': 'Erode',
                'phone': '9876543212',
                'status': 'Active',
                'gender': 'Female',
                'age': '35',
                'assigned_loom': 'L-003',
                'loom_type': 'Handloom',
                'specialty': 'Silk Sarees',
                'address': '8 Bazaar Road, Erode',
            },
            {
                'name': 'S. Murugan',
                'village': 'Nallapatti',
                'phone': '9876543213',
                'status': 'Active',
                'gender': 'Male',
                'age': '45',
                'assigned_loom': 'L-004',
                'loom_type': 'Pit Loom',
                'specialty': 'Traditional Jacquard Towels',
                'address': '14/2 Weavers Colony, Pillayar Palayam',
            },
            {
                'name': 'K. Devi',
                'village': 'Erode',
                'phone': '9876543214',
                'status': 'Active',
                'gender': 'Female',
                'age': '29',
                'assigned_loom': 'L-005',
                'loom_type': 'Handloom',
                'specialty': 'Cotton Silk Blend',
                'address': '22 South Masi Street, Erode',
            },
        ]

        for w in weavers_data:
            weaver, created = Weaver.objects.update_or_create(
                phone=w['phone'],
                defaults=w
            )
            if created:
                self.stdout.write(f"Created weaver: {weaver.name}")

        # 3. Seed Looms (matching Screen 5 mockup)
        looms_data = [
            {'loom_no': 'L-001', 'loom_type': 'Power Loom', 'status': 'Active', 'assigned_weaver': 'R. Selvi'},
            {'loom_no': 'L-002', 'loom_type': 'Handloom', 'status': 'Active', 'assigned_weaver': 'M. Kumar'},
            {'loom_no': 'L-003', 'loom_type': 'Power Loom', 'status': 'Inactive', 'assigned_weaver': 'P. Lakshmi'},
            {'loom_no': 'L-004', 'loom_type': 'Handloom', 'status': 'Active', 'assigned_weaver': 'S. Murugan'},
            {'loom_no': 'L-005', 'loom_type': 'Power Loom', 'status': 'Active', 'assigned_weaver': 'K. Devi'},
        ]

        for l in looms_data:
            Loom.objects.update_or_create(loom_no=l['loom_no'], defaults=l)

        # 4. Seed Yarn Stock (matching Screen 7 mockup)
        stock_data = [
            {'yarn_type': 'Cotton Yarn', 'quantity_kg': 500.0, 'status': 'In Stock', 'unit_price': 320.00},
            {'yarn_type': 'Silk Yarn', 'quantity_kg': 200.0, 'status': 'In Stock', 'unit_price': 4200.00},
            {'yarn_type': 'Polyester', 'quantity_kg': 300.0, 'status': 'In Stock', 'unit_price': 180.00},
            {'yarn_type': 'Mixed Yarn', 'quantity_kg': 150.0, 'status': 'In Stock', 'unit_price': 250.00},
        ]

        for s in stock_data:
            YarnStock.objects.update_or_create(yarn_type=s['yarn_type'], defaults=s)

        # 5. Seed Production Records (matching Screen 8 mockup)
        prod_data = [
            {'weaver_name': 'R. Selvi', 'loom_no': 'L-001', 'meters_produced': 120.0, 'fabric_type': 'Pure Silk', 'production_date': date(2026, 11, 24)},
            {'weaver_name': 'M. Kumar', 'loom_no': 'L-002', 'meters_produced': 100.0, 'fabric_type': 'Cotton Dhoti', 'production_date': date(2026, 11, 24)},
            {'weaver_name': 'P. Lakshmi', 'loom_no': 'L-003', 'meters_produced': 110.0, 'fabric_type': 'Silk Saree', 'production_date': date(2026, 11, 23)},
            {'weaver_name': 'S. Murugan', 'loom_no': 'L-004', 'meters_produced': 90.0, 'fabric_type': 'Jacquard Towel', 'production_date': date(2026, 11, 22)},
        ]

        for p in prod_data:
            ProductionRecord.objects.get_or_create(
                weaver_name=p['weaver_name'],
                production_date=p['production_date'],
                defaults=p
            )

        # 6. Seed Salary Records (matching Screen 9 mockup)
        salaries_data = [
            {'weaver_name': 'R. Selvi', 'month': 'Nov 2026', 'amount': 8000.00, 'status': 'Paid'},
            {'weaver_name': 'M. Kumar', 'month': 'Nov 2026', 'amount': 8000.00, 'status': 'Paid'},
            {'weaver_name': 'P. Lakshmi', 'month': 'Nov 2026', 'amount': 7500.00, 'status': 'Pending'},
            {'weaver_name': 'S. Murugan', 'month': 'Nov 2026', 'amount': 8000.00, 'status': 'Paid'},
        ]

        for sal in salaries_data:
            SalaryRecord.objects.get_or_create(
                weaver_name=sal['weaver_name'],
                month=sal['month'],
                defaults=sal
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded HWMS database!'))
