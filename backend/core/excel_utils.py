import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from io import BytesIO
from datetime import datetime
from .models import Weaver

def generate_weavers_excel(weavers_queryset=None):
    """
    Generates a professionally styled Excel workbook (.xlsx) containing weaver records.
    """
    if weavers_queryset is None:
        weavers_queryset = Weaver.objects.all()

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Weavers Directory"

    # Header styling (Deep Navy matching HWMS theme)
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="132036", end_color="132036", fill_type="solid")
    center_align = Alignment(horizontal="center", vertical="center")
    left_align = Alignment(horizontal="left", vertical="center")

    headers = [
        "ID", "Full Name", "Village", "Phone", "Status", "Gender", "Age",
        "Father / Spouse", "Artisan Card No", "Address", "Pincode",
        "Assigned Loom", "Loom Type", "Experience (Yrs)", "Specialty",
        "Daily Capacity", "Bank Name", "Bank Account", "IFSC Code"
    ]

    ws.append(headers)

    for cell in ws[1]:
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align

    # Add rows
    for w in weavers_queryset:
        ws.append([
            w.id,
            w.name,
            w.village,
            w.phone,
            w.status,
            w.gender,
            w.age,
            w.father_spouse,
            w.artisan_card_no,
            w.address,
            w.pincode,
            w.assigned_loom,
            w.loom_type,
            w.experience_years,
            w.specialty,
            w.daily_capacity,
            w.bank_name,
            w.bank_account,
            w.ifsc_code,
        ])

    # Auto-adjust column widths
    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

    output = BytesIO()
    wb.save(output)
    output.seek(0)
    return output


def generate_sample_weavers_template():
    """
    Generates an empty sample template Excel file with pre-filled instructions and 2 demo rows.
    """
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Weavers Import Template"

    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1E5BBF", end_color="1E5BBF", fill_type="solid")

    headers = [
        "Full Name", "Village", "Phone", "Status", "Gender", "Age",
        "Father / Spouse", "Artisan Card No", "Address", "Pincode",
        "Assigned Loom", "Loom Type", "Experience (Yrs)", "Specialty",
        "Daily Capacity", "Bank Name", "Bank Account", "IFSC Code"
    ]
    ws.append(headers)

    for cell in ws[1]:
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")

    demo_rows = [
        ["R. Selvi", "Nallapatti", "9876543210", "Active", "Female", "38", "K. Ramasamy", "TN-ERD-2026-884", "12 North Weavers St", "638052", "L-001", "Handloom", "12", "Pure Silk Sarees", "4.5 mtrs/day", "State Bank of India", "30495810294", "SBIN0001248"],
        ["M. Kumar", "Thingalur", "9876543211", "Active", "Male", "42", "M. Marimuthu", "TN-THG-2026-112", "45 Gandhi Nagar", "638055", "L-002", "Power Loom", "15", "Fine Cotton Dhotis", "6.0 mtrs/day", "Canara Bank", "40921820194", "CNRB0002104"],
    ]
    for r in demo_rows:
        ws.append(r)

    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = openpyxl.utils.get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 3, 14)

    output = BytesIO()
    wb.save(output)
    output.seek(0)
    return output


def parse_and_import_weavers_excel(file_obj):
    """
    Parses an uploaded .xlsx or .csv file and imports weavers into PostgreSQL.
    """
    wb = openpyxl.load_workbook(file_obj, data_only=True)
    ws = wb.active

    imported = []
    errors = []

    # Read rows (row 1 is header)
    rows = list(ws.iter_rows(values_only=True))
    if not rows or len(rows) < 2:
        return {'success': False, 'error': 'Excel file is empty or missing data rows'}

    header = [str(h or '').strip().lower().replace(' ', '_').replace('/', '_') for h in rows[0]]

    for row_idx, r in enumerate(rows[1:], start=2):
        if not any(r):
            continue  # skip empty lines

        row_dict = dict(zip(header, r))

        name = str(row_dict.get('full_name') or row_dict.get('name') or '').strip()
        phone = str(row_dict.get('phone') or '').strip().replace('.0', '')
        village = str(row_dict.get('village') or 'Nallapatti').strip()
        status_val = str(row_dict.get('status') or 'Active').strip()
        gender = str(row_dict.get('gender') or 'Female').strip()
        age = str(row_dict.get('age') or '38').strip().replace('.0', '')
        assigned_loom = str(row_dict.get('assigned_loom') or 'L-001').strip()
        loom_type = str(row_dict.get('loom_type') or 'Handloom').strip()
        specialty = str(row_dict.get('specialty') or 'Handloom Weaving').strip()
        address = str(row_dict.get('address') or '').strip()

        if not name or not phone:
            errors.append(f"Row {row_idx}: Missing name or phone number")
            continue

        weaver, created = Weaver.objects.update_or_create(
            phone=phone,
            defaults={
                'name': name,
                'village': village,
                'status': 'Active' if 'active' in status_val.lower() else 'Inactive',
                'gender': gender if gender in ['Male', 'Female', 'Other'] else 'Female',
                'age': age,
                'assigned_loom': assigned_loom,
                'loom_type': loom_type,
                'specialty': specialty,
                'address': address,
                'bank_name': str(row_dict.get('bank_name') or 'State Bank of India'),
                'bank_account': str(row_dict.get('bank_account') or '').replace('.0', ''),
                'ifsc_code': str(row_dict.get('ifsc_code') or 'SBIN0001248'),
            }
        )
        imported.append({'id': weaver.id, 'name': weaver.name, 'phone': weaver.phone, 'village': weaver.village, 'created': created})

    return {
        'success': True,
        'imported_count': len(imported),
        'imported_weavers': imported,
        'errors': errors
    }
