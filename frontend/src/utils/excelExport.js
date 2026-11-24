import * as XLSX from 'xlsx';

/**
 * Client-Side Excel Export for Weavers
 * Creates and triggers download of a formatted .xlsx file
 */
export const exportWeaversToExcel = (weavers, filename = null) => {
  const exportDate = new Date().toISOString().slice(0, 10);
  const actualFilename = filename || `HWMS_Weavers_Directory_${exportDate}.xlsx`;

  // Format data with clean human-readable headers
  const data = weavers.map((w, idx) => ({
    '#': idx + 1,
    'Artisan Name': w.name || '',
    'Village Cluster': w.village || '',
    'Mobile Phone': w.phone || '',
    'Status': w.status || 'Active',
    'Gender': w.gender || 'Female',
    'Age': w.age || '',
    "Father's / Spouse's Name": w.father_spouse || w.fatherSpouse || '',
    'Artisan Card ID': w.artisan_card_no || w.artisanCardNo || '',
    'Assigned Loom': w.assigned_loom || w.assignedLoom || '',
    'Loom Type': w.loom_type || w.loomType || '',
    'Experience (Yrs)': w.experience_years || w.experienceYears || '',
    'Specialty': w.specialty || '',
    'Daily Capacity': w.daily_capacity || w.dailyCapacity || '',
    'Bank Name': w.bank_name || w.bankName || '',
    'Account Number': w.bank_account || w.bankAccount || '',
    'IFSC Code': w.ifsc_code || w.ifscCode || '',
    'Residential Address': w.address || '',
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths
  const colWidths = [
    { wch: 4 },  // #
    { wch: 18 }, // Name
    { wch: 16 }, // Village
    { wch: 14 }, // Phone
    { wch: 10 }, // Status
    { wch: 10 }, // Gender
    { wch: 8 },  // Age
    { wch: 22 }, // Father
    { wch: 18 }, // Card ID
    { wch: 14 }, // Loom
    { wch: 16 }, // Loom Type
    { wch: 14 }, // Exp
    { wch: 24 }, // Specialty
    { wch: 16 }, // Capacity
    { wch: 22 }, // Bank
    { wch: 18 }, // Account
    { wch: 14 }, // IFSC
    { wch: 30 }, // Address
  ];
  ws['!cols'] = colWidths;

  // Create workbook and trigger download
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Weavers');
  XLSX.writeFile(wb, actualFilename);
};

/**
 * Downloads a sample pre-filled template .xlsx file for bulk importing weavers
 */
export const downloadSampleTemplateExcel = () => {
  const sampleData = [
    {
      'Full Name': 'R. Selvi',
      'Village': 'Nallapatti',
      'Phone': '9876543210',
      'Status': 'Active',
      'Gender': 'Female',
      'Age': 38,
      "Father's / Spouse's Name": 'K. Ramasamy',
      'Artisan Card ID': 'TN-ERD-2026-884',
      'Assigned Loom': 'L-001',
      'Loom Type': 'Handloom',
      'Experience (Yrs)': 12,
      'Specialty': 'Pure Silk Sarees',
      'Daily Capacity': '4.5 mtrs/day',
      'Bank Name': 'State Bank of India',
      'Account Number': '30495810294',
      'IFSC Code': 'SBIN0001248',
      'Address': '12 North Weavers Street, Nallapatti',
    },
    {
      'Full Name': 'M. Kumar',
      'Village': 'Thingalur',
      'Phone': '9876543211',
      'Status': 'Active',
      'Gender': 'Male',
      'Age': 42,
      "Father's / Spouse's Name": 'M. Marimuthu',
      'Artisan Card ID': 'TN-THG-2026-112',
      'Assigned Loom': 'L-002',
      'Loom Type': 'Power Loom',
      'Experience (Yrs)': 15,
      'Specialty': 'Fine Cotton Dhotis',
      'Daily Capacity': '6.0 mtrs/day',
      'Bank Name': 'Canara Bank',
      'Account Number': '40921820194',
      'IFSC Code': 'CNRB0002104',
      'Address': '45 Gandhi Nagar, Thingalur',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  ws['!cols'] = [
    { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 8 },
    { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 22 },
    { wch: 16 }, { wch: 22 }, { wch: 18 }, { wch: 14 }, { wch: 30 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Import_Template');
  XLSX.writeFile(wb, 'HWMS_Weaver_Import_Sample_Template.xlsx');
};

/**
 * Parses an Excel or CSV file in the browser and returns validated weaver records
 */
export const readWeaversFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawJson = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('The uploaded spreadsheet contains no data rows.');
        }

        const normalized = rawJson.map((row, index) => {
          // Normalize diverse column headers
          const name = row['Full Name'] || row['Artisan Name'] || row['Name'] || row['name'] || '';
          const phone = String(row['Mobile Phone'] || row['Phone'] || row['phone'] || '').replace('.0', '').trim();
          const village = row['Village Cluster'] || row['Village'] || row['village'] || 'Nallapatti';
          const status = row['Status'] || row['status'] || 'Active';
          const gender = row['Gender'] || row['gender'] || 'Female';
          const age = String(row['Age'] || row['age'] || '38').replace('.0', '');
          const loom = row['Assigned Loom'] || row['Loom'] || row['assigned_loom'] || 'L-001';
          const loomType = row['Loom Type'] || row['loom_type'] || 'Handloom';
          const specialty = row['Specialty'] || row['specialty'] || 'Handloom Weaving';
          const address = row['Residential Address'] || row['Address'] || row['address'] || '';
          const bankName = row['Bank Name'] || row['bank_name'] || 'State Bank of India';
          const bankAccount = String(row['Account Number'] || row['Bank Account'] || row['bank_account'] || '').replace('.0', '');
          const ifscCode = row['IFSC Code'] || row['ifsc_code'] || 'SBIN0001248';

          return {
            id: index + 100, // Temporary preview id
            name,
            phone,
            village,
            status: status.toLowerCase().includes('inact') ? 'Inactive' : 'Active',
            gender: ['Male', 'Female', 'Other'].includes(gender) ? gender : 'Female',
            age,
            assignedLoom: loom,
            loomType,
            specialty,
            address,
            bankName,
            bankAccount,
            ifscCode,
            isValid: Boolean(name && phone),
          };
        });

        resolve(normalized);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};
