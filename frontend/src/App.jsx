import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { api } from './services/api';
import { LoginPage } from './components/auth/LoginPage';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';
import { ExactSidebar } from './components/common/ExactSidebar';
import { ExactHeader } from './components/common/ExactHeader';
import { ExactAdminDashboard } from './components/dashboard/ExactAdminDashboard';
import { WeaverManagementView, initialWeaversList } from './components/views/WeaverManagementView';
import { AddWeaverPage } from './components/views/AddWeaverPage';
import { LoomManagementView, initialLoomsList } from './components/views/LoomManagementView';
import { AddLoomPage } from './components/views/AddLoomPage';
import { YarnStockView, initialYarnStock } from './components/views/YarnStockView';
import { AddYarnStockPage } from './components/views/AddYarnStockPage';
import { ProductionTrackingView, initialProductionRecords } from './components/views/ProductionTrackingView';
import { AddProductionRecordPage } from './components/views/AddProductionRecordPage';
import { SalaryManagementView, initialSalaries } from './components/views/SalaryManagementView';
import { AddSalaryPage } from './components/views/AddSalaryPage';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { CheckCircle2 } from 'lucide-react';

const MainSystem = () => {
  const { currentUser, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // 1. Weavers State (Screen 3 & 4)
  const STORAGE_WEAVERS_KEY = 'hwms_weavers_list_v1';
  const [weavers, setWeavers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WEAVERS_KEY);
      return saved ? JSON.parse(saved) : initialWeaversList;
    } catch {
      return initialWeaversList;
    }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchWeaversFromBackend = async () => {
      try {
        const liveData = await api.weavers.getAll();
        if (isMounted && liveData && liveData.length > 0) {
          setWeavers(liveData);
        }
      } catch (err) {
        console.warn('Backend API standby, using cached weaver data');
      }
    };
    fetchWeaversFromBackend();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_WEAVERS_KEY, JSON.stringify(weavers));
  }, [weavers]);

  const [editingWeaver, setEditingWeaver] = useState(null);

  // 2. Looms State (Screen 5 & 6)
  const STORAGE_LOOMS_KEY = 'hwms_looms_list_v1';
  const [looms, setLooms] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LOOMS_KEY);
      return saved ? JSON.parse(saved) : initialLoomsList;
    } catch {
      return initialLoomsList;
    }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchLoomsFromBackend = async () => {
      try {
        const liveData = await api.looms.getAll();
        if (isMounted && liveData && liveData.length > 0) {
          setLooms(liveData);
        }
      } catch (err) {
        console.warn('Backend API standby, using cached loom data');
      }
    };
    fetchLoomsFromBackend();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_LOOMS_KEY, JSON.stringify(looms));
  }, [looms]);

  const [editingLoom, setEditingLoom] = useState(null);

  // 3. Yarn & Stock State (Screen 7)
  const STORAGE_STOCK_KEY = 'hwms_stock_list_v1';
  const [stockList, setStockList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STOCK_KEY);
      return saved ? JSON.parse(saved) : initialYarnStock;
    } catch {
      return initialYarnStock;
    }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchStockFromBackend = async () => {
      try {
        const liveData = await api.stock.getAll();
        if (isMounted && liveData && liveData.length > 0) {
          setStockList(liveData);
        }
      } catch (err) {
        console.warn('Backend API standby, using cached stock data');
      }
    };
    fetchStockFromBackend();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(stockList));
  }, [stockList]);

  const [editingStock, setEditingStock] = useState(null);

  // 4. Production Records State (Screen 8)
  const STORAGE_PROD_KEY = 'hwms_prod_list_v1';
  const [productionRecords, setProductionRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROD_KEY);
      return saved ? JSON.parse(saved) : initialProductionRecords;
    } catch {
      return initialProductionRecords;
    }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProdFromBackend = async () => {
      try {
        const liveData = await api.production.getAll();
        if (isMounted && liveData && liveData.length > 0) {
          setProductionRecords(liveData);
        }
      } catch (err) {
        console.warn('Backend API standby, using cached production data');
      }
    };
    fetchProdFromBackend();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_PROD_KEY, JSON.stringify(productionRecords));
  }, [productionRecords]);

  const [editingRecord, setEditingRecord] = useState(null);

  // 5. Salary & Sales State (Screen 9)
  const STORAGE_SALARIES_KEY = 'hwms_salaries_list_v1';
  const [salaries, setSalaries] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SALARIES_KEY);
      return saved ? JSON.parse(saved) : initialSalaries;
    } catch {
      return initialSalaries;
    }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchSalariesFromBackend = async () => {
      try {
        const liveData = await api.salaries.getAll();
        if (isMounted && liveData && liveData.length > 0) {
          setSalaries(liveData);
        }
      } catch (err) {
        console.warn('Backend API standby, using cached salary data');
      }
    };
    fetchSalariesFromBackend();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_SALARIES_KEY, JSON.stringify(salaries));
  }, [salaries]);

  const [editingSalary, setEditingSalary] = useState(null);

  // If user is not logged in, render Screen 1 & 13 Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  // --- Handlers ---
  const handleSaveWeaver = async (weaverData) => {
    try {
      if (editingWeaver && weaverData.id) {
        await api.weavers.update(weaverData.id, weaverData).catch((err) => {
          console.warn('Backend update failed, updating locally:', err.message);
        });
        setWeavers((prev) =>
          prev.map((w) => (w.id === weaverData.id ? { ...w, ...weaverData } : w))
        );
        setSuccessToast(`Weaver "${weaverData.name}" details updated successfully!`);
      } else {
        let created = null;
        try {
          created = await api.weavers.create(weaverData);
        } catch (err) {
          console.warn('Backend create failed, creating locally:', err.message);
        }

        const newWeaver = created || {
          ...weaverData,
          id: weavers.length > 0 ? Math.max(...weavers.map((w) => Number(w.id) || 0)) + 1 : 1,
          status: weaverData.status || 'Active',
        };
        setWeavers((prev) => [newWeaver, ...prev]);
        setSuccessToast(`New weaver "${weaverData.name}" registered and onboarded!`);
      }
    } catch (err) {
      console.error('Error in handleSaveWeaver:', err);
    }

    setEditingWeaver(null);
    setActiveNav('weavers');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleDeleteWeaver = async (id) => {
    const target = weavers.find((w) => w.id === id);
    if (window.confirm(`Are you sure you want to remove weaver "${target?.name || id}"?`)) {
      try {
        await api.weavers.delete(id).catch((err) => {
          console.warn('Backend delete failed, removing locally:', err.message);
        });
      } catch (err) {
        console.warn('Error deleting weaver on backend:', err.message);
      }
      setWeavers((prev) => prev.filter((w) => w.id !== id));
      setSuccessToast(`Weaver record deleted.`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleBulkImportWeavers = (importedRows) => {
    setWeavers((prev) => {
      const existingPhones = new Set(prev.map((w) => String(w.phone)));
      const newItems = importedRows.filter((r) => !existingPhones.has(String(r.phone)));
      return [...newItems, ...prev];
    });
    setSuccessToast(`Successfully imported ${importedRows.length} weavers from Excel!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleSaveLoom = async (loomData) => {
    try {
      if (editingLoom && loomData.id) {
        await api.looms.update(loomData.id, loomData).catch((err) => {
          console.warn('Backend loom update failed, updating locally:', err.message);
        });
        setLooms((prev) =>
          prev.map((l) => (l.id === loomData.id ? { ...l, ...loomData } : l))
        );
        setSuccessToast(`Loom unit "${loomData.loomNo}" details updated successfully!`);
      } else {
        let created = null;
        try {
          created = await api.looms.create(loomData);
        } catch (err) {
          console.warn('Backend loom create failed, creating locally:', err.message);
        }

        const newLoom = created || {
          ...loomData,
          id: looms.length > 0 ? Math.max(...looms.map((l) => Number(l.id) || 0)) + 1 : 1,
          status: loomData.status || 'Active',
        };
        setLooms((prev) => [newLoom, ...prev]);
        setSuccessToast(`Loom unit "${loomData.loomNo}" registered and active!`);
      }
    } catch (err) {
      console.error('Error in handleSaveLoom:', err);
    }

    setEditingLoom(null);
    setActiveNav('looms');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleDeleteLoom = async (id) => {
    const target = looms.find((l) => l.id === id);
    if (window.confirm(`Are you sure you want to remove loom "${target?.loomNo || id}"?`)) {
      try {
        await api.looms.delete(id).catch((err) => {
          console.warn('Backend loom delete failed, deleting locally:', err.message);
        });
      } catch (err) {
        console.warn('Error deleting loom on backend:', err.message);
      }
      setLooms((prev) => prev.filter((l) => l.id !== id));
      setSuccessToast(`Loom unit record removed.`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleSaveStock = async (stockData) => {
    try {
      if (editingStock && stockData.id) {
        await api.stock.update(stockData.id, stockData).catch((err) => {
          console.warn('Backend stock update failed, updating locally:', err.message);
        });
        setStockList((prev) =>
          prev.map((s) => (s.id === stockData.id ? { ...s, ...stockData } : s))
        );
        setSuccessToast(`Yarn stock "${stockData.yarnType}" updated successfully!`);
      } else {
        let created = null;
        try {
          created = await api.stock.create(stockData);
        } catch (err) {
          console.warn('Backend stock create failed, creating locally:', err.message);
        }

        const newStock = created || {
          ...stockData,
          id: stockList.length > 0 ? Math.max(...stockList.map((s) => Number(s.id) || 0)) + 1 : 1,
        };
        setStockList((prev) => [newStock, ...prev]);
        setSuccessToast(`New yarn consignment "${stockData.yarnType}" logged into inventory!`);
      }
    } catch (err) {
      console.error('Error saving stock:', err);
    }

    setEditingStock(null);
    setActiveNav('stock');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleDeleteStock = async (id) => {
    if (window.confirm('Delete this stock record?')) {
      try {
        await api.stock.delete(id).catch(() => {});
      } catch (err) {}
      setStockList((prev) => prev.filter((s) => s.id !== id));
      setSuccessToast('Stock record removed.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleSaveProductionRecord = async (recordData) => {
    try {
      if (editingRecord && recordData.id) {
        await api.production.update(recordData.id, recordData).catch((err) => {
          console.warn('Backend prod update failed, updating locally:', err.message);
        });
        setProductionRecords((prev) =>
          prev.map((r) => (r.id === recordData.id ? { ...r, ...recordData } : r))
        );
        setSuccessToast(`Production log for "${recordData.weaverName}" updated!`);
      } else {
        let created = null;
        try {
          created = await api.production.create(recordData);
        } catch (err) {
          console.warn('Backend prod create failed, creating locally:', err.message);
        }

        const newRec = created || {
          ...recordData,
          id: productionRecords.length > 0 ? Math.max(...productionRecords.map((r) => Number(r.id) || 0)) + 1 : 1,
        };
        setProductionRecords((prev) => [newRec, ...prev]);
        setSuccessToast(`Daily production of ${recordData.productionMtrs}m logged successfully!`);
      }
    } catch (err) {
      console.error('Error saving production record:', err);
    }

    setEditingRecord(null);
    setActiveNav('production');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleDeleteProductionRecord = async (id) => {
    if (window.confirm('Delete this production record?')) {
      try {
        await api.production.delete(id).catch(() => {});
      } catch (err) {}
      setProductionRecords((prev) => prev.filter((r) => r.id !== id));
      setSuccessToast('Production record deleted.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleSaveSalary = async (salaryData) => {
    try {
      if (editingSalary && salaryData.id) {
        await api.salaries.update(salaryData.id, salaryData).catch((err) => {
          console.warn('Backend salary update failed, updating locally:', err.message);
        });
        setSalaries((prev) =>
          prev.map((s) => (s.id === salaryData.id ? { ...s, ...salaryData } : s))
        );
        setSuccessToast(`Wage payment for "${salaryData.weaverName}" updated!`);
      } else {
        let created = null;
        try {
          created = await api.salaries.create(salaryData);
        } catch (err) {
          console.warn('Backend salary create failed, creating locally:', err.message);
        }

        const newSalary = created || {
          ...salaryData,
          id: salaries.length > 0 ? Math.max(...salaries.map((s) => Number(s.id) || 0)) + 1 : 1,
        };
        setSalaries((prev) => [newSalary, ...prev]);
        setSuccessToast(`Wage disbursement for "${salaryData.weaverName}" recorded!`);
      }
    } catch (err) {
      console.error('Error saving salary record:', err);
    }

    setEditingSalary(null);
    setActiveNav('salary');
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleDeleteSalary = async (id) => {
    if (window.confirm('Delete this wage disbursement record?')) {
      try {
        await api.salaries.delete(id).catch(() => {});
      } catch (err) {}
      setSalaries((prev) => prev.filter((s) => s.id !== id));
      setSuccessToast('Wage record deleted.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleToggleSalaryStatus = (id) => {
    setSalaries((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'Paid' ? 'Pending' : 'Paid' } : s
      )
    );
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
  };

  // Render View matching screens 2 through 11 + dedicated Add Pages
  const renderView = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <ExactAdminDashboard
            onOpenModal={(action) => {
              if (action === 'add_weaver') {
                setEditingWeaver(null);
                setActiveNav('add_weaver_page');
              } else if (action === 'add_loom') {
                setEditingLoom(null);
                setActiveNav('add_loom_page');
              } else if (action === 'update_stock' || action === 'add_stock') {
                setEditingStock(null);
                setActiveNav('add_stock_page');
              }
            }}
            onNavigate={(nav) => setActiveNav(nav)}
          />
        );

      case 'weavers':
        return (
          <WeaverManagementView
            weavers={weavers}
            onNavigateToAddWeaver={() => {
              setEditingWeaver(null);
              setActiveNav('add_weaver_page');
            }}
            onNavigateToEditWeaver={(weaver) => {
              setEditingWeaver(weaver);
              setActiveNav('add_weaver_page');
            }}
            onDeleteWeaver={handleDeleteWeaver}
            onBulkImportWeavers={handleBulkImportWeavers}
          />
        );

      case 'add_weaver_page':
        return (
          <AddWeaverPage
            onBack={() => {
              setEditingWeaver(null);
              setActiveNav('weavers');
            }}
            onSaveWeaver={handleSaveWeaver}
            weaverToEdit={editingWeaver}
          />
        );

      case 'looms':
        return (
          <LoomManagementView
            looms={looms}
            onNavigateToAddLoom={() => {
              setEditingLoom(null);
              setActiveNav('add_loom_page');
            }}
            onNavigateToEditLoom={(loom) => {
              setEditingLoom(loom);
              setActiveNav('add_loom_page');
            }}
            onDeleteLoom={handleDeleteLoom}
          />
        );

      case 'add_loom_page':
        return (
          <AddLoomPage
            onBack={() => {
              setEditingLoom(null);
              setActiveNav('looms');
            }}
            onSaveLoom={handleSaveLoom}
            loomToEdit={editingLoom}
            weaversList={weavers}
          />
        );

      case 'stock':
        return (
          <YarnStockView
            stockList={stockList}
            onNavigateToAddStock={() => {
              setEditingStock(null);
              setActiveNav('add_stock_page');
            }}
            onNavigateToEditStock={(stock) => {
              setEditingStock(stock);
              setActiveNav('add_stock_page');
            }}
            onDeleteStock={handleDeleteStock}
          />
        );

      case 'add_stock_page':
        return (
          <AddYarnStockPage
            onBack={() => {
              setEditingStock(null);
              setActiveNav('stock');
            }}
            onSaveStock={handleSaveStock}
            stockToEdit={editingStock}
          />
        );

      case 'production':
        return (
          <ProductionTrackingView
            records={productionRecords}
            onNavigateToAddRecord={() => {
              setEditingRecord(null);
              setActiveNav('add_production_page');
            }}
            onNavigateToEditRecord={(record) => {
              setEditingRecord(record);
              setActiveNav('add_production_page');
            }}
            onDeleteRecord={handleDeleteProductionRecord}
          />
        );

      case 'add_production_page':
        return (
          <AddProductionRecordPage
            onBack={() => {
              setEditingRecord(null);
              setActiveNav('production');
            }}
            onSaveRecord={handleSaveProductionRecord}
            recordToEdit={editingRecord}
            weaversList={weavers}
            loomsList={looms}
          />
        );

      case 'salary':
        return (
          <SalaryManagementView
            salaries={salaries}
            onNavigateToAddSalary={() => {
              setEditingSalary(null);
              setActiveNav('add_salary_page');
            }}
            onNavigateToEditSalary={(salary) => {
              setEditingSalary(salary);
              setActiveNav('add_salary_page');
            }}
            onDeleteSalary={handleDeleteSalary}
            onToggleStatus={handleToggleSalaryStatus}
          />
        );

      case 'add_salary_page':
        return (
          <AddSalaryPage
            onBack={() => {
              setEditingSalary(null);
              setActiveNav('salary');
            }}
            onSaveSalary={handleSaveSalary}
            salaryToEdit={editingSalary}
            weaversList={weavers}
          />
        );

      case 'reports':
        return <ReportsView />;

      case 'settings':
        return <SettingsView />;

      default:
        return (
          <ExactAdminDashboard
            onOpenModal={(action) => {
              if (action === 'add_weaver') {
                setEditingWeaver(null);
                setActiveNav('add_weaver_page');
              } else if (action === 'add_loom') {
                setEditingLoom(null);
                setActiveNav('add_loom_page');
              } else if (action === 'update_stock' || action === 'add_stock') {
                setEditingStock(null);
                setActiveNav('add_stock_page');
              }
            }}
            onNavigate={(nav) => setActiveNav(nav)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased">
      {/* 1. Exact Left Sidebar (Screens 2-11 with Charkha motif) */}
      <ExactSidebar
        activeTab={activeNav}
        onSelectTab={(tabId) => {
          if (tabId === 'logout') {
            setShowLogoutModal(true);
          } else {
            setActiveNav(tabId);
          }
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <ExactHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          onOpenLogoutModal={() => setShowLogoutModal(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1400px] w-full mx-auto space-y-4">
          {successToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fade-in shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          )}

          {renderView()}
        </main>
      </div>

      {/* Screen 12: Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainSystem />
      </AppProvider>
    </AuthProvider>
  );
}
