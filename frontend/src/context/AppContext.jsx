import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialUsers,
  initialWeaverProfiles,
  initialSuppliers,
  initialMaterials,
  initialStockMovements,
  initialLooms,
  initialWorkers,
  initialWorkOrders,
  initialQualityInspections,
  initialFinishedGoods,
  initialSales,
  initialWages,
  initialSupplierPayments,
  initialNotifications,
  initialPlatformSettings,
} from '../data/initialData';
import { translations } from '../utils/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Persistence key
  const STORAGE_KEY = 'hwms_erp_v1';

  // Load from localStorage or seed initial data
  const loadInitial = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  // User & Tenant state
  const [currentRole, setCurrentRole] = useState(() => loadInitial('role', 'weaver'));
  const [activeWeaverId, setActiveWeaverId] = useState(() => loadInitial('activeWeaverId', 'wvr-001'));
  const [activeNav, setActiveNav] = useState(() => loadInitial('activeNav', 'dashboard'));
  const [language, setLanguage] = useState(() => loadInitial('language', 'en'));

  // ERP Domain Entities
  const [users, setUsers] = useState(() => loadInitial('users', initialUsers));
  const [weaverProfiles, setWeaverProfiles] = useState(() => loadInitial('weaverProfiles', initialWeaverProfiles));
  const [suppliers, setSuppliers] = useState(() => loadInitial('suppliers', initialSuppliers));
  const [materials, setMaterials] = useState(() => loadInitial('materials', initialMaterials));
  const [stockMovements, setStockMovements] = useState(() => loadInitial('stockMovements', initialStockMovements));
  const [looms, setLooms] = useState(() => loadInitial('looms', initialLooms));
  const [workers, setWorkers] = useState(() => loadInitial('workers', initialWorkers));
  const [workOrders, setWorkOrders] = useState(() => loadInitial('workOrders', initialWorkOrders));
  const [qualityInspections, setQualityInspections] = useState(() => loadInitial('qualityInspections', initialQualityInspections));
  const [finishedGoods, setFinishedGoods] = useState(() => loadInitial('finishedGoods', initialFinishedGoods));
  const [sales, setSales] = useState(() => loadInitial('sales', initialSales));
  const [wages, setWages] = useState(() => loadInitial('wages', initialWages));
  const [supplierPayments, setSupplierPayments] = useState(() => loadInitial('supplierPayments', initialSupplierPayments));
  const [notifications, setNotifications] = useState(() => loadInitial('notifications', initialNotifications));
  const [platformSettings, setPlatformSettings] = useState(() => loadInitial('platformSettings', initialPlatformSettings));

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_role`, JSON.stringify(currentRole));
    localStorage.setItem(`${STORAGE_KEY}_activeWeaverId`, JSON.stringify(activeWeaverId));
    localStorage.setItem(`${STORAGE_KEY}_activeNav`, JSON.stringify(activeNav));
    localStorage.setItem(`${STORAGE_KEY}_language`, JSON.stringify(language));
    localStorage.setItem(`${STORAGE_KEY}_materials`, JSON.stringify(materials));
    localStorage.setItem(`${STORAGE_KEY}_stockMovements`, JSON.stringify(stockMovements));
    localStorage.setItem(`${STORAGE_KEY}_looms`, JSON.stringify(looms));
    localStorage.setItem(`${STORAGE_KEY}_workers`, JSON.stringify(workers));
    localStorage.setItem(`${STORAGE_KEY}_workOrders`, JSON.stringify(workOrders));
    localStorage.setItem(`${STORAGE_KEY}_qualityInspections`, JSON.stringify(qualityInspections));
    localStorage.setItem(`${STORAGE_KEY}_finishedGoods`, JSON.stringify(finishedGoods));
    localStorage.setItem(`${STORAGE_KEY}_sales`, JSON.stringify(sales));
    localStorage.setItem(`${STORAGE_KEY}_wages`, JSON.stringify(wages));
    localStorage.setItem(`${STORAGE_KEY}_weaverProfiles`, JSON.stringify(weaverProfiles));
    localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [
    currentRole, activeWeaverId, activeNav, language, materials, stockMovements,
    looms, workers, workOrders, qualityInspections, finishedGoods, sales, wages,
    weaverProfiles, notifications
  ]);

  // Translation helper
  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Multi-tenant data filtering for active weaver
  const currentWeaverProfile = weaverProfiles[activeWeaverId] || weaverProfiles['wvr-001'];
  
  const weaverMaterials = materials.filter(m => m.weaverId === activeWeaverId);
  const weaverMovements = stockMovements.filter(m => m.weaverId === activeWeaverId);
  const weaverLooms = looms.filter(l => l.weaverId === activeWeaverId);
  const weaverWorkers = workers.filter(w => w.weaverId === activeWeaverId);
  const weaverWorkOrders = workOrders.filter(wo => wo.weaverId === activeWeaverId);
  const weaverInspections = qualityInspections.filter(qa => qa.weaverId === activeWeaverId);
  const weaverFinishedGoods = finishedGoods.filter(fg => fg.weaverId === activeWeaverId);
  const weaverSales = sales.filter(s => s.weaverId === activeWeaverId);
  const weaverWages = wages.filter(w => w.weaverId === activeWeaverId);
  const weaverSupplierPayments = supplierPayments.filter(sp => sp.weaverId === activeWeaverId);

  // Notifications relevant to current view
  const activeNotifications = notifications.filter(n => {
    if (currentRole === 'admin') return true;
    if (currentRole === 'manager') return n.targetRole === 'manager' || n.targetRole === 'admin';
    if (currentRole === 'weaver') return n.targetRole === 'weaver' && (!n.targetWeaverId || n.targetWeaverId === activeWeaverId);
    return false;
  });

  // Action: Add Notification
  const addNotification = ({ title, message, type = 'info', targetRole = 'weaver', targetWeaverId = activeWeaverId, linkTo = 'dashboard' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      targetRole,
      targetWeaverId,
      linkTo,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Action: Record Material Stock Movement (In / Out / Adjustment)
  // PDF Rule: "stock must never go negative" & "mandatory reason for adjustment"
  const recordStockMovement = ({
    materialId,
    movementType,
    quantity,
    rate,
    invoiceNo = '',
    supplierId = '',
    reason = '',
    notes = '',
    workOrderId = '',
  }) => {
    const targetMat = materials.find(m => m.id === materialId && m.weaverId === activeWeaverId);
    if (!targetMat) {
      return { success: false, error: "Material record not found." };
    }

    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum === 0) {
      return { success: false, error: "Please enter a valid non-zero quantity." };
    }

    let updatedStock = targetMat.currentStock;
    if (movementType === 'in') {
      updatedStock += Math.abs(qtyNum);
    } else if (movementType === 'out') {
      if (updatedStock < Math.abs(qtyNum)) {
        return { success: false, error: `Insufficient stock! Current stock is ${updatedStock} ${targetMat.unit}. Cannot consume ${Math.abs(qtyNum)}.` };
      }
      updatedStock -= Math.abs(qtyNum);
    } else if (movementType === 'adjustment') {
      if (!reason || reason.trim().length < 3) {
        return { success: false, error: "Mandatory audit reason is required for stock adjustments (damage, wastage, physical count correction)." };
      }
      if (updatedStock + qtyNum < 0) {
        return { success: false, error: "Stock adjustment cannot reduce inventory below 0." };
      }
      updatedStock += qtyNum;
    }

    // Update material
    setMaterials(prev => prev.map(m => m.id === materialId ? {
      ...m,
      currentStock: parseFloat(updatedStock.toFixed(2)),
      lastRestocked: movementType === 'in' ? new Date().toISOString().split('T')[0] : m.lastRestocked,
    } : m));

    // Get supplier name
    const sup = suppliers.find(s => s.id === supplierId);

    // Create movement record
    const newMovement = {
      id: `mv-${Date.now()}`,
      weaverId: activeWeaverId,
      materialId,
      materialName: targetMat.name,
      movementType,
      quantity: movementType === 'out' ? -Math.abs(qtyNum) : qtyNum,
      unit: targetMat.unit,
      rate: rate || targetMat.ratePerUnit,
      invoiceNo,
      supplierId,
      supplierName: sup ? sup.name : '',
      reason,
      workOrderId,
      date: new Date().toISOString().split('T')[0],
      notes,
    };

    setStockMovements(prev => [newMovement, ...prev]);

    // Check low stock trigger
    if (updatedStock <= targetMat.minimumStock) {
      addNotification({
        title: `Low Stock Alert: ${targetMat.name}`,
        message: `Inventory reached ${updatedStock} ${targetMat.unit} (Minimum threshold: ${targetMat.minimumStock} ${targetMat.unit}).`,
        type: 'warning',
        linkTo: 'materials',
      });
    }

    return { success: true, updatedStock };
  };

  // Action: Add new raw material to catalog
  const addMaterial = (newMatData) => {
    const newMat = {
      id: `mat-${Date.now()}`,
      weaverId: activeWeaverId,
      ...newMatData,
      currentStock: parseFloat(newMatData.currentStock || 0),
      minimumStock: parseFloat(newMatData.minimumStock || 5),
      ratePerUnit: parseFloat(newMatData.ratePerUnit || 0),
      lastRestocked: new Date().toISOString().split('T')[0],
    };
    setMaterials(prev => [newMat, ...prev]);
    return newMat;
  };

  // Action: Add Loom
  const addLoom = (loomData) => {
    const newLoom = {
      id: `lm-${Date.now()}`,
      weaverId: activeWeaverId,
      loomNumber: loomData.loomNumber,
      type: loomData.type,
      location: loomData.location || 'Weaving Shed',
      status: loomData.status || 'idle',
      efficiencyScore: 90,
      assignedWorkerId: loomData.assignedWorkerId || null,
      assignedWorkerName: loomData.assignedWorkerName || 'Unassigned',
      currentProduct: loomData.currentProduct || null,
      currentWorkOrderId: null,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
    };
    setLooms(prev => [...prev, newLoom]);
    return newLoom;
  };

  // Action: Update Loom Status
  const updateLoomStatus = (loomId, status, repairNotes = '') => {
    setLooms(prev => prev.map(l => l.id === loomId ? {
      ...l,
      status,
      repairNotes: status === 'under_repair' ? repairNotes : (repairNotes || l.repairNotes),
    } : l));
  };

  // Action: Add Worker
  const addWorker = (workerData) => {
    const newWorker = {
      id: `wrk-${Date.now()}`,
      weaverId: activeWeaverId,
      name: workerData.name,
      role: workerData.role || 'Loom Weaver',
      contactNumber: workerData.contactNumber,
      skill: workerData.skill,
      joiningDate: workerData.joiningDate || new Date().toISOString().split('T')[0],
      wageType: workerData.wageType || 'per_piece',
      wageRate: parseFloat(workerData.wageRate || 0),
      status: 'active',
      currentLoomId: workerData.currentLoomId || null,
      workloadPiecesThisMonth: 0,
      pendingWages: 0,
    };
    setWorkers(prev => [...prev, newWorker]);
    return newWorker;
  };

  // Action: Create Work Order
  // PDF Rule: Work orders (product, quantity, material, target date, assigned loom/worker)
  const createWorkOrder = (woData) => {
    const newWO = {
      id: `wo-${Date.now()}`,
      weaverId: activeWeaverId,
      workOrderNumber: `WO-${currentWeaverProfile.district?.slice(0,3).toUpperCase() || 'WVR'}-${new Date().getFullYear()}-${String(workOrders.length + 1).padStart(3, '0')}`,
      productName: woData.productName,
      category: woData.category || 'Saree',
      quantityOrdered: parseInt(woData.quantityOrdered || 1, 10),
      quantityCompleted: 0,
      unit: woData.unit || 'pieces',
      materialsRequired: woData.materialsRequired || '',
      materialConsumed: '0 kg',
      wastageRecorded: '0 kg',
      startDate: woData.startDate || new Date().toISOString().split('T')[0],
      targetDate: woData.targetDate,
      priority: woData.priority || 'Normal',
      assignedLoomId: woData.assignedLoomId || null,
      assignedLoomNumber: woData.assignedLoomNumber || 'Unassigned',
      assignedWorkerId: woData.assignedWorkerId || null,
      assignedWorkerName: woData.assignedWorkerName || 'Unassigned',
      progressPercentage: 0,
      status: woData.assignedLoomId ? 'assigned' : 'draft',
      notes: woData.notes || '',
    };

    setWorkOrders(prev => [newWO, ...prev]);

    // Update loom status to working if assigned
    if (newWO.assignedLoomId) {
      setLooms(prev => prev.map(l => l.id === newWO.assignedLoomId ? {
        ...l,
        status: 'working',
        currentWorkOrderId: newWO.id,
        currentProduct: newWO.productName,
        assignedWorkerName: newWO.assignedWorkerName,
      } : l));
    }

    addNotification({
      title: `New Work Order Created: ${newWO.workOrderNumber}`,
      message: `${newWO.productName} (${newWO.quantityOrdered} ${newWO.unit}) assigned to ${newWO.assignedWorkerName}.`,
      type: 'info',
      linkTo: 'work_orders',
    });

    return newWO;
  };

  // Action: Update Work Order Progress & Consumption
  // PDF Rule: "Completed quantity cannot exceed ordered quantity without approval"
  const updateWorkOrderProgress = (woId, {
    progressPercentage,
    quantityCompleted,
    materialConsumed,
    wastageRecorded,
    notes,
  }) => {
    const targetWO = workOrders.find(w => w.id === woId);
    if (!targetWO) return { success: false, error: "Work Order not found." };

    const compQty = quantityCompleted !== undefined ? parseInt(quantityCompleted, 10) : targetWO.quantityCompleted;
    if (compQty > targetWO.quantityOrdered) {
      return {
        success: false,
        error: `Completed quantity (${compQty}) cannot exceed ordered quantity (${targetWO.quantityOrdered}) without manager approval.`,
      };
    }

    const pct = progressPercentage !== undefined ? parseInt(progressPercentage, 10) : targetWO.progressPercentage;
    let newStatus = targetWO.status;
    if (pct >= 100 || compQty >= targetWO.quantityOrdered) {
      newStatus = 'submitted'; // Auto submits for QA inspection
    } else if (pct > 0 && targetWO.status === 'assigned') {
      newStatus = 'in_progress';
    }

    setWorkOrders(prev => prev.map(w => w.id === woId ? {
      ...w,
      progressPercentage: pct,
      quantityCompleted: compQty,
      materialConsumed: materialConsumed || w.materialConsumed,
      wastageRecorded: wastageRecorded || w.wastageRecorded,
      notes: notes || w.notes,
      status: newStatus,
    } : w));

    if (newStatus === 'submitted') {
      addNotification({
        title: `Work Order Ready for Inspection: ${targetWO.workOrderNumber}`,
        message: `${targetWO.productName} completed by ${targetWO.assignedWorkerName}. Ready for Quality Check.`,
        type: 'action_required',
        linkTo: 'quality',
      });
    }

    return { success: true };
  };

  // Action: Perform Quality Inspection
  // PDF Rule: "Only quality-approved quantity can be added to finished goods stock. Rework goes back to production."
  const performQualityInspection = ({
    workOrderId,
    inspectorName,
    quantityInspected,
    quantityAccepted,
    quantityRejected,
    quantityReworked,
    checklist,
    rejectionReason,
    reworkInstructions,
    notes,
    productDetails,
  }) => {
    const targetWO = workOrders.find(w => w.id === workOrderId);
    if (!targetWO) return { success: false, error: "Work Order not found." };

    const accepted = parseInt(quantityAccepted || 0, 10);
    const rejected = parseInt(quantityRejected || 0, 10);
    const reworked = parseInt(quantityReworked || 0, 10);

    let status = 'passed';
    if (rejected > 0) status = 'rejected';
    else if (reworked > 0) status = 'rework';

    const newQA = {
      id: `qa-${Date.now()}`,
      weaverId: activeWeaverId,
      inspectionNumber: `QA-${currentWeaverProfile.district?.slice(0,3).toUpperCase() || 'WVR'}-${new Date().getFullYear()}-${String(qualityInspections.length + 1).padStart(3, '0')}`,
      workOrderId,
      workOrderNumber: targetWO.workOrderNumber,
      productName: targetWO.productName,
      inspectorName: inspectorName || currentWeaverProfile.ownerName,
      inspectionDate: new Date().toISOString().split('T')[0],
      quantityInspected: parseInt(quantityInspected || targetWO.quantityOrdered, 10),
      quantityAccepted: accepted,
      quantityRejected: rejected,
      quantityReworked: reworked,
      checklist: checklist || {
        weaveUniformity: true,
        zariBorderAlignment: true,
        colourFastness: true,
        dimensionTolerance: true,
        defectFreeSelvage: true,
      },
      status,
      rejectionReason: rejectionReason || '',
      reworkInstructions: reworkInstructions || '',
      notes: notes || '',
      resultAction: accepted > 0 
        ? `${accepted} pieces approved and moved to Finished Goods Stock.` 
        : `${reworked} pieces sent back for rework.`,
    };

    setQualityInspections(prev => [newQA, ...prev]);

    // Rule: Approved pieces are automatically added to Finished Goods Stock
    if (accepted > 0) {
      // Find matching existing finished product or create new
      const existingProduct = finishedGoods.find(fg => 
        fg.weaverId === activeWeaverId && 
        (fg.name.toLowerCase().includes(targetWO.productName.toLowerCase()) || 
         targetWO.productName.toLowerCase().includes(fg.name.toLowerCase()))
      );

      if (existingProduct) {
        setFinishedGoods(prev => prev.map(fg => fg.id === existingProduct.id ? {
          ...fg,
          stockQuantity: fg.stockQuantity + accepted,
        } : fg));
      } else {
        const newFG = {
          id: `fg-${Date.now()}`,
          weaverId: activeWeaverId,
          sku: `${currentWeaverProfile.district?.slice(0,3).toUpperCase() || 'WVR'}-${targetWO.category.slice(0,3).toUpperCase()}-${String(finishedGoods.length + 1).padStart(3, '0')}`,
          name: targetWO.productName,
          category: targetWO.category,
          fabric: productDetails?.fabric || currentWeaverProfile.fabricTypes?.[0] || 'Handwoven Pure Silk',
          colour: productDetails?.colour || 'Artisanal Natural Dye',
          size: productDetails?.size || 'Standard 6.25m',
          stockQuantity: accepted,
          minimumStock: 2,
          wholesalePrice: productDetails?.wholesalePrice || 14000,
          retailPrice: productDetails?.retailPrice || 18500,
          gstPercentage: 5,
          giTagCertified: currentWeaverProfile.certifications?.length > 0,
          handloomMarkCertified: true,
          imageUrl: productDetails?.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
          description: `Handcrafted in ${currentWeaverProfile.district} by master weavers. Quality verified and passed on ${newQA.inspectionDate}.`,
        };
        setFinishedGoods(prev => [newFG, ...prev]);
      }
    }

    // Update work order status based on QA outcome
    setWorkOrders(prev => prev.map(w => w.id === workOrderId ? {
      ...w,
      status: reworked > 0 ? 'rework' : (accepted === targetWO.quantityOrdered ? 'closed' : 'approved'),
      notes: reworked > 0 
        ? `${w.notes} [QA Rework: ${reworkInstructions}]` 
        : `${w.notes} [QA Passed: ${accepted} approved]`,
    } : w));

    addNotification({
      title: `Quality Inspection Completed: ${newQA.inspectionNumber}`,
      message: `${accepted} accepted, ${reworked} rework, ${rejected} rejected for ${targetWO.productName}.`,
      type: status === 'passed' ? 'info' : 'warning',
      linkTo: 'finished_stock',
    });

    return { success: true, newQA };
  };

  // Action: Create Sale and Generate Invoice
  // PDF Rule: "A sale can be made only if finished stock is available. Sale reduces finished stock; stock must not go negative."
  const createSale = ({
    buyerName,
    buyerType,
    buyerPhone,
    buyerAddress,
    buyerGst = '',
    items, // array of { sku, productName, quantity, unitPrice, gstRate }
    discount = 0,
    amountPaid = 0,
    paymentMode = 'Cash',
    dueDate,
  }) => {
    // Validate stock for all items
    for (const item of items) {
      const fg = finishedGoods.find(g => g.sku === item.sku && g.weaverId === activeWeaverId);
      if (!fg) {
        return { success: false, error: `Product with SKU ${item.sku} not found.` };
      }
      if (fg.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${fg.name}"! Available: ${fg.stockQuantity}, Requested: ${item.quantity}. Stock cannot go negative.`,
        };
      }
    }

    // Calculate totals
    let subtotal = 0;
    let gstAmount = 0;
    const computedItems = items.map(item => {
      const lineTotal = item.quantity * item.unitPrice;
      const lineGst = (lineTotal * (item.gstRate || 5)) / 100;
      subtotal += lineTotal;
      gstAmount += lineGst;
      return {
        ...item,
        total: lineTotal,
      };
    });

    const disc = parseFloat(discount || 0);
    const grandTotal = Math.round(subtotal + gstAmount - disc);
    const paid = parseFloat(amountPaid || 0);
    const balanceDue = grandTotal - paid;

    let paymentStatus = 'pending';
    if (paid >= grandTotal) paymentStatus = 'paid';
    else if (paid > 0) paymentStatus = 'partially_paid';

    // Deduct stock from finished goods
    setFinishedGoods(prev => prev.map(fg => {
      const soldItem = items.find(it => it.sku === fg.sku);
      if (soldItem) {
        return {
          ...fg,
          stockQuantity: fg.stockQuantity - soldItem.quantity,
        };
      }
      return fg;
    }));

    // Create Sale record
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(sales.length + 44).padStart(3, '0')}`;
    const newSale = {
      id: `sale-${Date.now()}`,
      weaverId: activeWeaverId,
      invoiceNumber,
      date: new Date().toISOString().split('T')[0],
      buyerName,
      buyerType: buyerType || 'Wholesale Shop',
      buyerPhone,
      buyerAddress,
      buyerGst,
      items: computedItems,
      subtotal,
      gstAmount,
      discount: disc,
      grandTotal,
      paymentStatus,
      amountPaid: paid,
      balanceDue,
      paymentMode: paid > 0 ? paymentMode : '',
      paymentDate: paid > 0 ? new Date().toISOString().split('T')[0] : '',
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    };

    setSales(prev => [newSale, ...prev]);

    addNotification({
      title: `Invoice Generated: ${invoiceNumber}`,
      message: `Sale of ₹${grandTotal.toLocaleString('en-IN')} to ${buyerName}. Payment status: ${paymentStatus}.`,
      type: 'info',
      linkTo: 'sales',
    });

    return { success: true, newSale };
  };

  // Action: Calculate & Disburse Worker Wage
  // PDF Rule: "Worker wages calculated from wage type and approved quantity/days with advances and deductions"
  const recordWorkerWage = ({
    workerId,
    period,
    unitsApproved,
    advancesDeducted = 0,
    welfareDeduction = 0,
    workOrderNumber = 'General Production',
  }) => {
    const worker = workers.find(w => w.id === workerId && w.weaverId === activeWeaverId);
    if (!worker) return { success: false, error: "Worker not found." };

    const units = parseFloat(unitsApproved || 1);
    const rate = worker.wageRate;
    const grossWage = units * rate;
    const adv = parseFloat(advancesDeducted || 0);
    const welf = parseFloat(welfareDeduction || 0);
    const netPayable = Math.max(0, grossWage - adv - welf);

    const newWage = {
      id: `wage-${Date.now()}`,
      weaverId: activeWeaverId,
      workerId,
      workerName: worker.name,
      wageType: worker.wageType,
      workOrderNumber,
      period: period || `Nov 2026`,
      unitsApproved: units,
      ratePerUnit: rate,
      grossWage,
      advancesDeducted: adv,
      welfareDeduction: welf,
      netPayable,
      status: 'calculated', // "calculated" -> "approved" -> "paid"
    };

    setWages(prev => [newWage, ...prev]);
    return { success: true, newWage };
  };

  // Action: Approve & Pay Wage
  const updateWageStatus = (wageId, status, paymentMode = 'Cash Voucher', paymentRef = '') => {
    setWages(prev => prev.map(w => w.id === wageId ? {
      ...w,
      status,
      paymentMode: status === 'paid' ? paymentMode : w.paymentMode,
      paymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : w.paymentDate,
      paymentRef: paymentRef || w.paymentRef,
      approvedBy: status === 'approved' || status === 'paid' ? currentWeaverProfile.ownerName : w.approvedBy,
      approvedDate: status === 'approved' ? new Date().toISOString().split('T')[0] : w.approvedDate,
    } : w));
  };

  // Action: Update Weaver Verification Status (Platform Manager / Admin)
  const updateWeaverVerification = (weaverId, newStatus, reviewNotes = '') => {
    setWeaverProfiles(prev => {
      const profile = prev[weaverId];
      if (!profile) return prev;
      return {
        ...prev,
        [weaverId]: {
          ...profile,
          verificationStatus: newStatus,
          reviewNotes,
          approvedDate: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : profile.approvedDate,
          approvedBy: newStatus === 'approved' ? 'Ananya Sharma (District Manager)' : profile.approvedBy,
        },
      };
    });

    setUsers(prev => prev.map(u => u.weaverId === weaverId ? {
      ...u,
      status: newStatus === 'approved' ? 'active' : (newStatus === 'rejected' ? 'inactive' : 'under_review'),
    } : u));

    addNotification({
      title: `Weaver Verification Updated: ${newStatus.toUpperCase()}`,
      message: `Profile status for ${weaverProfiles[weaverId]?.businessName || weaverId} changed to ${newStatus}.`,
      type: newStatus === 'approved' ? 'info' : 'warning',
      targetRole: 'weaver',
      targetWeaverId: weaverId,
    });
  };

  // Action: Update Weaver Product Supply Profile
  const updateWeaverProfile = (updatedProfile) => {
    setWeaverProfiles(prev => ({
      ...prev,
      [activeWeaverId]: {
        ...prev[activeWeaverId],
        ...updatedProfile,
      },
    }));
  };

  // Action: Record Supplier Payment
  const recordSupplierPayment = ({ supplierId, invoiceReference, amountPaid, paymentMode, referenceNumber, notes }) => {
    const sup = suppliers.find(s => s.id === supplierId);
    const newPayment = {
      id: `sp-${Date.now()}`,
      weaverId: activeWeaverId,
      supplierId,
      supplierName: sup ? sup.name : 'Raw Material Supplier',
      invoiceReference,
      amountPaid: parseFloat(amountPaid),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode,
      referenceNumber,
      notes,
      status: 'completed',
    };

    setSupplierPayments(prev => [newPayment, ...prev]);

    // Update supplier balance
    if (sup) {
      setSuppliers(prev => prev.map(s => s.id === supplierId ? {
        ...s,
        balanceDue: Math.max(0, s.balanceDue - parseFloat(amountPaid)),
      } : s));
    }

    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        // Role & Tenant
        currentRole,
        setCurrentRole,
        activeWeaverId,
        setActiveWeaverId,
        activeNav,
        setActiveNav,
        language,
        setLanguage,
        t,

        // Data Models
        users,
        weaverProfiles,
        currentWeaverProfile,
        suppliers,
        materials,
        stockMovements,
        looms,
        workers,
        workOrders,
        qualityInspections,
        finishedGoods,
        sales,
        wages,
        supplierPayments,
        notifications: activeNotifications,
        allNotifications: notifications,
        platformSettings,

        // Weaver Tenant Isolated Data
        weaverMaterials,
        weaverMovements,
        weaverLooms,
        weaverWorkers,
        weaverWorkOrders,
        weaverInspections,
        weaverFinishedGoods,
        weaverSales,
        weaverWages,
        weaverSupplierPayments,

        // Business Actions
        recordStockMovement,
        addMaterial,
        addLoom,
        updateLoomStatus,
        addWorker,
        createWorkOrder,
        updateWorkOrderProgress,
        performQualityInspection,
        createSale,
        recordWorkerWage,
        updateWageStatus,
        updateWeaverVerification,
        updateWeaverProfile,
        recordSupplierPayment,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        setPlatformSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
