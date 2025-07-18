import React, { useState, useEffect, useMemo, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
  deleteDoc,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";
import {
  PlusCircle,
  Trash2,
  Target,
  DollarSign,
  Calendar,
  CheckCircle,
  X,
  Download,
  LayoutGrid,
  ListChecks,
  FileText,
  Edit,
} from "lucide-react";

// --- Firebase Configuration ---
const firebaseConfig =
  typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// --- Constants & Helpers ---
const START_DATE = new Date("2025-07-17T00:00:00");

const EXPENSE_CATEGORIES = [
  "Other",
  "Groceries",
  "Transportation",
  "Dining Out",
  "Entertainment",
  "Shopping",
  "Health/Wellness",
];
const GOAL_CATEGORIES = [
  "Other",
  "Emergency Fund",
  "Vacation",
  "New Car",
  "Down Payment",
  "Retirement",
  "Education",
  "Home Improvement",
];
const BILL_CATEGORIES = [
  "Housing",
  "Utilities",
  "Subscription",
  "Loan",
  "Insurance",
  "Other",
];
const BILL_RECURRENCE = [
  "Once",
  "Weekly",
  "Bi-Weekly",
  "Monthly",
  "Quarterly",
  "Annually",
];
const BILL_IMPORTANCE = ["High", "Medium", "Low"];

const generatePaycheckDates = () => {
  const dates = [];
  let currentDate = new Date(START_DATE);
  for (let i = 0; i < 26; i++) {
    const dateStr = formatDate(currentDate);
    dates.push({
      date: new Date(currentDate),
      amount: 0,
      id: `regular-${dateStr}`,
      isExtra: false,
    });
    currentDate.setDate(currentDate.getDate() + 14);
  }
  return dates;
};

const formatDate = (date) =>
  date
    ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]
    : "";
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount || 0,
  );

// --- React Components ---

const Modal = ({ show, onClose, children, size = "lg" }) => {
  if (!show) return null;
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div
        className={`bg-gray-800 rounded-xl p-6 relative ${sizeClasses[size]} w-full shadow-2xl border border-gray-700`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-xl p-6 ${className}`}
  >
    {children}
  </div>
);

const Header = () => (
  <header className="text-center mb-8">
    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
      BrokeBudgetBalancer <span className="text-cyan-400">BBB</span>
    </h1>
    <p className="text-gray-400 mt-2">
      Balance your budget, one paycheck at a time.
    </p>
  </header>
);

// --- PAYCHECK PLANNER VIEW COMPONENTS ---

const PaycheckInfo = ({
  selectedPaycheck,
  setSelectedPaycheck,
  paychecks,
  onSaveAmount,
  onAddExtraPaycheck,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [extraDate, setExtraDate] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);

  const selectedPaycheckObject = useMemo(
    () => paychecks.find((p) => p.id === selectedPaycheck),
    [paychecks, selectedPaycheck],
  );

  useEffect(() => {
    if (selectedPaycheckObject) {
      setCurrentAmount(selectedPaycheckObject.amount || 0);
    }
  }, [selectedPaycheckObject]);

  const handleAddExtra = () => {
    if (extraDate && extraAmount > 0) {
      onAddExtraPaycheck({
        date: new Date(extraDate + "T00:00:00"),
        amount: parseFloat(extraAmount),
      });
      setShowModal(false);
      setExtraDate("");
      setExtraAmount("");
    }
  };

  const handleSave = () => {
    if (selectedPaycheckObject) {
      onSaveAmount(selectedPaycheckObject, parseFloat(currentAmount));
    }
  };

  return (
    <>
      <Card>
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
          <Calendar className="mr-3 text-cyan-400" />
          Paycheck Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="paycheck-date"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Select Paycheck Date
            </label>
            <select
              id="paycheck-date"
              value={selectedPaycheck}
              onChange={(e) => setSelectedPaycheck(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              {paychecks.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="income-amount"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Income Amount
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="income-amount"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                onBlur={handleSave}
                placeholder="e.g., 1500"
                className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
              <button
                onClick={handleSave}
                className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white"
              >
                <CheckCircle size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Add Other Income
          </button>
        </div>
        <div className="mt-6 bg-gray-900 p-4 rounded-lg text-center">
          <p className="text-gray-400 text-lg">Gross Pay for this Period</p>
          <p className="text-3xl font-bold text-green-400">
            {formatCurrency(selectedPaycheckObject?.amount)}
          </p>
        </div>
      </Card>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-xl font-semibold text-white mb-4">
          Add Other Income
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="extra-date"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="extra-date"
              value={extraDate}
              onChange={(e) => setExtraDate(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
            />
          </div>
          <div>
            <label
              htmlFor="extra-amount"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Gross Amount
            </label>
            <input
              type="number"
              id="extra-amount"
              value={extraAmount}
              onChange={(e) => setExtraAmount(e.target.value)}
              placeholder="e.g., 500"
              className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
            />
          </div>
          <button
            onClick={handleAddExtra}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Add Income
          </button>
        </div>
      </Modal>
    </>
  );
};

const AddCustomExpenseModal = ({
  show,
  onClose,
  onSave,
  categories,
  itemType,
}) => {
  const [items, setItems] = useState([
    { id: Date.now(), category: "Other", customName: "", amount: "" },
  ]);

  const handleItemChange = (id, field, value) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "category" && value !== "Other") {
            updatedItem.customName = "";
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const addItemRow = () =>
    setItems([
      ...items,
      { id: Date.now(), category: "Other", customName: "", amount: "" },
    ]);
  const removeItemRow = (id) =>
    setItems(items.filter((item) => item.id !== id));

  const handleSave = () => {
    const validItems = items
      .filter(
        (item) =>
          item.amount > 0 &&
          (item.category !== "Other" || item.customName.trim() !== ""),
      )
      .map((item) => ({
        name:
          item.category === "Other" ? item.customName.trim() : item.category,
        amount: parseFloat(item.amount),
      }));
    if (validItems.length > 0) {
      onSave(validItems);
    }
    setItems([
      { id: Date.now(), category: "Other", customName: "", amount: "" },
    ]);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h3 className="text-xl font-semibold text-white mb-4">Add {itemType}s</h3>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center bg-gray-700 p-2 rounded-lg"
          >
            <div className="col-span-3 md:col-span-1">
              <select
                value={item.category}
                onChange={(e) =>
                  handleItemChange(item.id, "category", e.target.value)
                }
                className="w-full bg-gray-600 text-white border-gray-500 rounded-md p-2 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3 md:col-span-2 flex gap-2">
              {item.category === "Other" && (
                <input
                  type="text"
                  placeholder="Custom Name"
                  value={item.customName}
                  onChange={(e) =>
                    handleItemChange(item.id, "customName", e.target.value)
                  }
                  className="flex-grow bg-gray-600 text-white border-gray-500 rounded-md p-2 text-sm"
                />
              )}
              <input
                type="number"
                placeholder={
                  itemType === "Expense" ? "Amount" : "Target Amount"
                }
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(item.id, "amount", e.target.value)
                }
                className="w-28 bg-gray-600 text-white border-gray-500 rounded-md p-2 text-sm"
              />
              <button
                onClick={() => removeItemRow(item.id)}
                className="flex-shrink-0 text-red-500 hover:text-red-400 flex items-center justify-center bg-gray-600 rounded-md px-3"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={addItemRow}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md text-sm"
        >
          Add Row
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Save {itemType}s
        </button>
      </div>
    </Modal>
  );
};

const AddBillToBudgetModal = ({
  show,
  onClose,
  bills,
  currentBudgetItems,
  onAddBills,
  onNavigateToBills,
}) => {
  const [selectedBills, setSelectedBills] = useState([]);

  const availableBills = useMemo(() => {
    const budgetedBillNames = currentBudgetItems
      .filter((item) => item.name.startsWith("Bill:"))
      .map((item) => item.name);
    return bills.filter(
      (bill) => !budgetedBillNames.includes(`Bill: ${bill.name}`),
    );
  }, [bills, currentBudgetItems]);

  const handleToggleBill = (billId) => {
    setSelectedBills((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId],
    );
  };

  const handleAddSelected = () => {
    const billsToAdd = bills
      .filter((bill) => selectedBills.includes(bill.id))
      .map((bill) => ({ name: `Bill: ${bill.name}`, amount: bill.amount }));
    if (billsToAdd.length > 0) {
      onAddBills(billsToAdd);
    }
    setSelectedBills([]);
    onClose();
  };

  if (!show) return null;

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <h3 className="text-xl font-semibold text-white mb-4">
        Add Bill Payment to Budget
      </h3>
      {bills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">You haven't added any bills yet.</p>
          <button
            onClick={onNavigateToBills}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Go to Bills Tab
          </button>
        </div>
      ) : availableBills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">
            All your bills have been added to this paycheck's budget.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {availableBills.map((bill) => (
              <div
                key={bill.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedBills.includes(bill.id) ? "bg-cyan-800" : "bg-gray-700 hover:bg-gray-600"}`}
                onClick={() => handleToggleBill(bill.id)}
              >
                <div>
                  <p className="font-semibold text-white">{bill.name}</p>
                  <p className="text-sm text-gray-400">
                    {bill.recurrence} - Due{" "}
                    {bill.dueDate.toDate().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-green-400">
                    {formatCurrency(bill.amount)}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center border-2 ${selectedBills.includes(bill.id) ? "bg-cyan-500 border-cyan-400" : "border-gray-500"}`}
                  >
                    {selectedBills.includes(bill.id) && (
                      <CheckCircle size={16} className="text-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAddSelected}
              disabled={selectedBills.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Add {selectedBills.length} Selected Bill(s)
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

const BudgetSection = ({
  budgetItems,
  onAddBudgetItems,
  onDeleteBudgetItem,
  remainingAmount,
  totalBudgeted,
  bills,
  onNavigateToBills,
}) => {
  const [showCustomExpenseModal, setShowCustomExpenseModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white flex items-center">
            <DollarSign className="mr-3 text-green-400" />
            Budget
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCustomExpenseModal(true)}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md flex items-center text-sm"
            >
              <PlusCircle className="mr-2" size={16} />
              Other
            </button>
            <button
              onClick={() => setShowBillModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
            >
              <PlusCircle className="mr-2" size={16} />
              Pay Bills
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Expense
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {budgetItems.length > 0 ? (
                budgetItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap"
                    >
                      {item.name}
                    </th>
                    <td className="px-6 py-4 text-right">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onDeleteBudgetItem(item)}
                        className="font-medium text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-400">
                    No budget items added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4 space-y-2">
          <div className="flex justify-between text-lg">
            <span className="text-gray-300">Total Budgeted:</span>
            <span className="font-semibold text-orange-400">
              {formatCurrency(totalBudgeted)}
            </span>
          </div>
          <div className="flex justify-between text-xl">
            <span className="text-gray-200 font-bold">Remaining Funds:</span>
            <span className="font-bold text-cyan-400">
              {formatCurrency(remainingAmount)}
            </span>
          </div>
        </div>
      </Card>
      <AddBillToBudgetModal
        show={showBillModal}
        onClose={() => setShowBillModal(false)}
        bills={bills}
        currentBudgetItems={budgetItems}
        onAddBills={onAddBudgetItems}
        onNavigateToBills={onNavigateToBills}
      />
      <AddCustomExpenseModal
        show={showCustomExpenseModal}
        onClose={() => setShowCustomExpenseModal(false)}
        onSave={onAddBudgetItems}
        categories={EXPENSE_CATEGORIES}
        itemType="Expense"
      />
    </>
  );
};

const GoalSection = ({ goals, onAddGoals, onDeleteGoal, onAllocateToGoal }) => {
  const [showModal, setShowModal] = useState(false);
  const [allocationAmounts, setAllocationAmounts] = useState({});
  const handleAllocationChange = (goalId, value) =>
    setAllocationAmounts((prev) => ({ ...prev, [goalId]: value }));
  const handleAllocate = (goal) => {
    const amount = parseFloat(allocationAmounts[goal.id]);
    if (!isNaN(amount) && amount > 0) {
      onAllocateToGoal(goal, amount);
      handleAllocationChange(goal.id, "");
    }
  };
  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white flex items-center">
            <Target className="mr-3 text-purple-400" />
            Savings Goals
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
          >
            <PlusCircle className="mr-2" size={16} />
            Add Goals
          </button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {goals.length > 0 ? (
            goals.map((goal) => {
              const progress =
                goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
              return (
                <div key={goal.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{goal.name}</p>
                      <p className="text-sm text-gray-300">
                        {formatCurrency(goal.current)} /{" "}
                        <span className="text-gray-400">
                          {formatCurrency(goal.target)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-purple-500 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Allocate"
                      value={allocationAmounts[goal.id] || ""}
                      onChange={(e) =>
                        handleAllocationChange(goal.id, e.target.value)
                      }
                      className="w-full bg-gray-600 text-white border-gray-500 rounded-md p-2 text-sm"
                    />
                    <button
                      onClick={() => handleAllocate(goal)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-md text-sm"
                    >
                      Allocate
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-center py-4">
              No savings goals set up yet.
            </p>
          )}
        </div>
      </Card>
      <AddCustomExpenseModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={onAddGoals}
        categories={GOAL_CATEGORIES}
        itemType="Goal"
      />
    </>
  );
};

// --- WEEKLY OVERVIEW COMPONENT ---

const WeeklyOverview = ({ weeklyData, onDownload, onWeekClick }) => (
  <Card>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-white flex items-center">
        <LayoutGrid className="mr-3 text-teal-400" />
        Weekly Overview
      </h2>
      <button
        onClick={onDownload}
        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors inline-flex items-center"
      >
        <Download size={16} className="mr-2" />
        Download
      </button>
    </div>
    <div className="overflow-x-auto max-h-[60vh]">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3">
              Week Of
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Income
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Expenses
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Net Flow
            </th>
          </tr>
        </thead>
        <tbody>
          {weeklyData.length > 0 ? (
            weeklyData.map((week) => (
              <tr
                key={week.weekOfRaw}
                className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                onClick={() => onWeekClick(week.weekOfRaw)}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-white whitespace-nowrap"
                >
                  {week.weekOfDisplay}
                </th>
                <td className="px-6 py-4 text-right text-green-400">
                  {formatCurrency(week.income)}
                </td>
                <td className="px-6 py-4 text-right text-orange-400">
                  {formatCurrency(week.expenses)}
                </td>
                <td
                  className={`px-6 py-4 text-right font-bold ${week.net >= 0 ? "text-cyan-400" : "text-red-500"}`}
                >
                  {formatCurrency(week.net)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-400">
                No financial activity recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

// --- BILLS VIEW COMPONENTS ---

const BillFormModal = ({ show, onClose, onSave, bill }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (bill) {
      setFormData({
        ...bill,
        dueDate: bill.dueDate ? formatDate(bill.dueDate.toDate()) : "",
      });
    } else {
      setFormData({
        name: "",
        amount: "",
        dueDate: "",
        recurrence: "Monthly",
        importance: "Medium",
        category: "Other",
      });
    }
  }, [bill, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const amount = parseFloat(formData.amount);
    const dataToSave = {
      ...formData,
      amount: isNaN(amount) ? 0 : amount,
      dueDate: formData.dueDate
        ? new Date(formData.dueDate + "T00:00:00")
        : null,
    };
    onSave(dataToSave);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <h3 className="text-xl font-semibold text-white mb-6">
        {bill ? "Edit Bill" : "Add New Bill"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Bill Name/Title
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
          />
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={formData.dueDate || ""}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
          />
        </div>
        <div>
          <label
            htmlFor="recurrence"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            How Often
          </label>
          <select
            name="recurrence"
            id="recurrence"
            value={formData.recurrence || "Monthly"}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
          >
            {BILL_RECURRENCE.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="importance"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Importance
          </label>
          <select
            name="importance"
            id="importance"
            value={formData.importance || "Medium"}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
          >
            {BILL_IMPORTANCE.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Category/Grouping
          </label>
          <select
            name="category"
            id="category"
            value={formData.category || "Other"}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
          >
            {BILL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Save Bill
        </button>
      </div>
    </Modal>
  );
};

const BillsView = ({ bills, onSaveBill, onDeleteBill, onDownload }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "ascending",
  });

  const sortedBills = useMemo(() => {
    let sortableItems = [...bills];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let comparison = 0;

        if (sortConfig.key === "dueDate") {
          const aDate = a.dueDate?.toDate();
          const bDate = b.dueDate?.toDate();
          if (!aDate) return 1;
          if (!bDate) return -1;
          comparison = aDate.getTime() - bDate.getTime();
        } else if (sortConfig.key === "amount") {
          comparison = (a.amount || 0) - (b.amount || 0);
        } else if (sortConfig.key === "importance") {
          const importanceOrder = { High: 3, Medium: 2, Low: 1 };
          comparison =
            (importanceOrder[a.importance] || 0) -
            (importanceOrder[b.importance] || 0);
        } else {
          comparison = (a[sortConfig.key] || "").localeCompare(
            b[sortConfig.key] || "",
          );
        }

        return sortConfig.direction === "ascending" ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [bills, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBill(null);
    setShowModal(true);
  };

  const importanceColor = (importance) => {
    switch (importance) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const SortButton = ({ label, sortKey }) => {
    const isActive = sortConfig.key === sortKey;
    const icon = isActive
      ? sortConfig.direction === "ascending"
        ? "▲"
        : "▼"
      : "";
    return (
      <button
        onClick={() => requestSort(sortKey)}
        className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1 ${isActive ? "bg-cyan-600 text-white" : "bg-gray-600 hover:bg-gray-500 text-gray-300"}`}
      >
        {label} {icon && <span className="text-xs">{icon}</span>}
      </button>
    );
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white flex items-center">
            <FileText className="mr-3 text-yellow-400" />
            Bills Management
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(sortedBills)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors inline-flex items-center"
            >
              <Download size={16} className="mr-2" />
              Download
            </button>
            <button
              onClick={handleAddNew}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
            >
              <PlusCircle className="mr-2" size={16} />
              Add Bill
            </button>
          </div>
        </div>

        <div className="mb-4 p-2 bg-gray-900/50 rounded-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-300 mr-2">
              Sort By:
            </span>
            <SortButton label="Name" sortKey="name" />
            <SortButton label="Amount" sortKey="amount" />
            <SortButton label="Due Date" sortKey="dueDate" />
            <SortButton label="Recurrence" sortKey="recurrence" />
            <SortButton label="Importance" sortKey="importance" />
            <SortButton label="Category" sortKey="category" />
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {sortedBills.length > 0 ? (
            sortedBills.map((bill) => (
              <div
                key={bill.id}
                className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${importanceColor(bill.importance)}`}
                    ></span>
                    <p className="font-semibold text-white text-lg">
                      {bill.name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-300 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      Amount:{" "}
                      <span className="font-medium text-green-400">
                        {formatCurrency(bill.amount)}
                      </span>
                    </span>
                    {bill.dueDate && (
                      <span>
                        Due:{" "}
                        <span className="font-medium text-gray-200">
                          {bill.dueDate.toDate().toLocaleDateString()}
                        </span>
                      </span>
                    )}
                    <span>
                      Recurrence:{" "}
                      <span className="font-medium text-gray-200">
                        {bill.recurrence}
                      </span>
                    </span>
                    <span>
                      Category:{" "}
                      <span className="font-medium text-gray-200">
                        {bill.category}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(bill)}
                    className="text-blue-400 hover:text-blue-300 p-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteBill(bill.id)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">
              No bills added yet. Click 'Add Bill' to get started.
            </p>
          )}
        </div>
      </Card>
      <BillFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={onSaveBill}
        bill={editingBill}
      />
    </>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  // Firebase and Auth State
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // UI and Data State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState("planner");

  // User Data State
  const [allPaychecks, setAllPaychecks] = useState([]);
  const [paycheckAmounts, setPaycheckAmounts] = useState({});
  const [allBudgets, setAllBudgets] = useState({});
  const [goals, setGoals] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedPaycheckId, setSelectedPaycheckId] = useState("");

  // Effect for initializing Firebase and authenticating the user
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);
      setDb(firestore);

      onAuthStateChanged(authInstance, async (user) => {
        let uid = user ? user.uid : null;
        if (!uid) {
          const token =
            typeof __initial_auth_token !== "undefined"
              ? __initial_auth_token
              : null;
          try {
            const cred = token
              ? await signInWithCustomToken(authInstance, token)
              : await signInAnonymously(authInstance);
            uid = cred.user.uid;
          } catch (authError) {
            console.error("Authentication Error:", authError);
            setError("Failed to authenticate with the service.");
            setLoading(false);
          }
        }
        setUserId(uid);
        setIsAuthReady(true);
      });
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      setError("Could not connect to the database.");
      setLoading(false);
    }
  }, []);

  // Effect for setting up Firestore listeners once authenticated
  useEffect(() => {
    if (!isAuthReady || !db || !userId) return;

    setLoading(true);
    const unsubscribers = [];

    try {
      const paycheckAmountsRef = collection(
        db,
        `artifacts/${appId}/users/${userId}/paycheckAmounts`,
      );
      unsubscribers.push(
        onSnapshot(
          query(paycheckAmountsRef),
          (snapshot) => {
            const amounts = {};
            snapshot.forEach((doc) => {
              amounts[doc.id] = doc.data().amount;
            });
            setPaycheckAmounts(amounts);
          },
          (err) => console.error("Paycheck amounts fetch error:", err),
        ),
      );

      const extraPaychecksRef = collection(
        db,
        `artifacts/${appId}/users/${userId}/extraPaychecks`,
      );
      unsubscribers.push(
        onSnapshot(
          query(extraPaychecksRef),
          (snapshot) => {
            const extra = snapshot.docs.map((d) => ({
              ...d.data(),
              id: d.id,
              date: d.data().date.toDate(),
              isExtra: true,
            }));
            setAllPaychecks((prev) => [
              ...prev.filter((p) => !p.isExtra),
              ...extra,
            ]);
          },
          (err) => console.error("Extra paychecks fetch error:", err),
        ),
      );

      const budgetsRef = collection(
        db,
        `artifacts/${appId}/users/${userId}/budgets`,
      );
      unsubscribers.push(
        onSnapshot(
          query(budgetsRef),
          (snapshot) => {
            const budgetsData = {};
            snapshot.forEach((doc) => {
              budgetsData[doc.id] = doc.data();
            });
            setAllBudgets(budgetsData);
          },
          (err) => console.error("Budgets fetch error:", err),
        ),
      );

      const goalsRef = collection(
        db,
        `artifacts/${appId}/users/${userId}/goals`,
      );
      unsubscribers.push(
        onSnapshot(
          query(goalsRef),
          (snapshot) => {
            setGoals(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
          },
          (err) => console.error("Goals fetch error:", err),
        ),
      );

      const billsRef = collection(
        db,
        `artifacts/${appId}/users/${userId}/bills`,
      );
      unsubscribers.push(
        onSnapshot(
          query(billsRef),
          (snapshot) => {
            const billsData = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            }));
            setBills(billsData);
          },
          (err) => console.error("Bills fetch error:", err),
        ),
      );
    } catch (e) {
      console.error("Error setting up listeners:", e);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [isAuthReady, db, userId]);

  const consolidatedPaychecks = useMemo(() => {
    const regularPaychecks = generatePaycheckDates();
    const extraPaychecks = allPaychecks.filter((p) => p.isExtra);

    const combined = new Map();

    regularPaychecks.forEach((p) => {
      const dateStr = formatDate(p.date);
      const amount = paycheckAmounts[p.id] || 0;
      combined.set(dateStr, {
        date: p.date,
        amount: amount,
        id: p.id,
      });
    });

    extraPaychecks.forEach((p) => {
      const dateStr = formatDate(p.date);
      if (combined.has(dateStr)) {
        const existing = combined.get(dateStr);
        existing.amount += p.amount;
      } else {
        combined.set(dateStr, {
          date: p.date,
          amount: p.amount,
          id: p.id,
        });
      }
    });

    const result = Array.from(combined.values()).sort(
      (a, b) => a.date - b.date,
    );

    if (!selectedPaycheckId && result.length > 0) {
      const firstFuturePaycheck =
        result.find((p) => p.date >= new Date()) || result[0];
      setSelectedPaycheckId(firstFuturePaycheck.id);
    }

    return result;
  }, [paycheckAmounts, allPaychecks, selectedPaycheckId]);

  // Memoized calculations for derived state
  const selectedPaycheckObject = useMemo(
    () => consolidatedPaychecks.find((p) => p.id === selectedPaycheckId),
    [consolidatedPaychecks, selectedPaycheckId],
  );
  const selectedPaycheckDateStr = useMemo(
    () =>
      selectedPaycheckObject ? formatDate(selectedPaycheckObject.date) : null,
    [selectedPaycheckObject],
  );
  const currentBudgetItems = useMemo(
    () =>
      (selectedPaycheckDateStr && allBudgets[selectedPaycheckDateStr]?.items) ||
      [],
    [allBudgets, selectedPaycheckDateStr],
  );
  const grossPay = useMemo(
    () => selectedPaycheckObject?.amount || 0,
    [selectedPaycheckObject],
  );
  const totalBudgeted = useMemo(
    () => currentBudgetItems.reduce((sum, item) => sum + item.amount, 0),
    [currentBudgetItems],
  );
  const remainingAmount = useMemo(
    () => grossPay - totalBudgeted,
    [grossPay, totalBudgeted],
  );

  const weeklyData = useMemo(() => {
    if (consolidatedPaychecks.length === 0) return [];
    const data = {};
    const getWeekOf = (d) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      return formatDate(new Date(date.setDate(diff)));
    };
    consolidatedPaychecks.forEach((p) => {
      const weekOf = getWeekOf(p.date);
      if (!data[weekOf]) data[weekOf] = { income: 0, expenses: 0 };
      data[weekOf].income += p.amount;
      const budget = allBudgets[formatDate(p.date)];
      if (budget?.items) {
        data[weekOf].expenses += budget.items.reduce(
          (sum, item) => sum + item.amount,
          0,
        );
      }
    });
    return Object.entries(data)
      .map(([weekOf, { income, expenses }]) => ({
        weekOfRaw: weekOf,
        weekOfDisplay: new Date(weekOf + "T00:00:00").toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric", year: "numeric" },
        ),
        income,
        expenses,
        net: income - expenses,
      }))
      .filter((week) => week.income > 0 || week.expenses > 0)
      .sort((a, b) => new Date(a.weekOfRaw) - new Date(b.weekOfRaw));
  }, [consolidatedPaychecks, allBudgets]);

  // Firestore interaction handlers
  const handleSaveAmount = useCallback(
    async (paycheck, amount) => {
      if (!db || !userId || !paycheck) return;
      const docRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/paycheckAmounts`,
        paycheck.id,
      );
      await setDoc(docRef, { amount });
    },
    [db, userId],
  );

  const handleAddExtraPaycheck = useCallback(
    async (paycheck) => {
      if (!db || !userId) return;
      await addDoc(
        collection(db, `artifacts/${appId}/users/${userId}/extraPaychecks`),
        paycheck,
      );
    },
    [db, userId],
  );
  const handleAddBudgetItems = useCallback(
    async (items) => {
      if (!db || !userId || !selectedPaycheckDateStr) return;
      const budgetDocRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/budgets`,
        selectedPaycheckDateStr,
      );
      const newItems = items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      }));
      await setDoc(
        budgetDocRef,
        { items: arrayUnion(...newItems) },
        { merge: true },
      );
    },
    [db, userId, selectedPaycheckDateStr],
  );
  const handleDeleteBudgetItem = useCallback(
    async (itemToDelete) => {
      if (!db || !userId || !selectedPaycheckDateStr) return;
      const budgetDocRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/budgets`,
        selectedPaycheckDateStr,
      );
      await updateDoc(budgetDocRef, { items: arrayRemove(itemToDelete) });
    },
    [db, userId, selectedPaycheckDateStr],
  );
  const handleAddGoals = useCallback(
    async (goalsToAdd) => {
      if (!db || !userId) return;
      const batch = writeBatch(db);
      goalsToAdd.forEach((goal) => {
        const newGoalRef = doc(
          collection(db, `artifacts/${appId}/users/${userId}/goals`),
        );
        batch.set(newGoalRef, {
          name: goal.name,
          target: goal.amount,
          current: 0,
        });
      });
      await batch.commit();
    },
    [db, userId],
  );
  const handleDeleteGoal = useCallback(
    async (goalId) => {
      if (!db || !userId) return;
      await deleteDoc(
        doc(db, `artifacts/${appId}/users/${userId}/goals`, goalId),
      );
    },
    [db, userId],
  );
  const handleAllocateToGoal = useCallback(
    async (goal, amount) => {
      if (!db || !userId || !goal || amount <= 0 || !selectedPaycheckDateStr)
        return;

      const budgetDocRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/budgets`,
        selectedPaycheckDateStr,
      );
      const goalBudgetItem = {
        name: `Goal: ${goal.name}`,
        amount,
        id: crypto.randomUUID(),
      };
      await setDoc(
        budgetDocRef,
        { items: arrayUnion(goalBudgetItem) },
        { merge: true },
      );

      const goalDocRef = doc(
        db,
        `artifacts/${appId}/users/${userId}/goals`,
        goal.id,
      );
      await updateDoc(goalDocRef, { current: (goal.current || 0) + amount });
    },
    [db, userId, selectedPaycheckDateStr],
  );

  const handleSaveBill = useCallback(
    async (billData) => {
      if (!db || !userId) return;
      const { id, ...data } = billData;
      if (id) {
        const billRef = doc(db, `artifacts/${appId}/users/${userId}/bills`, id);
        await updateDoc(billRef, data);
      } else {
        await addDoc(
          collection(db, `artifacts/${appId}/users/${userId}/bills`),
          data,
        );
      }
    },
    [db, userId],
  );
  const handleDeleteBill = useCallback(
    async (billId) => {
      if (!db || !userId) return;
      await deleteDoc(
        doc(db, `artifacts/${appId}/users/${userId}/bills`, billId),
      );
    },
    [db, userId],
  );

  // UI Interaction Handlers
  const handleWeekClick = (weekOfRaw) => {
    const weekStart = new Date(weekOfRaw + "T00:00:00");
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const firstPaycheckInWeek = consolidatedPaychecks.find((p) => {
      const pDate = new Date(p.date);
      return pDate >= weekStart && pDate < weekEnd;
    });
    if (firstPaycheckInWeek) {
      setSelectedPaycheckId(firstPaycheckInWeek.id);
      setCurrentView("planner");
    }
  };

  const triggerDownload = (content, filename) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handlePlannerDownload = () => {
    if (!selectedPaycheckObject) return;
    const { date } = selectedPaycheckObject;
    const dateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let mdContent = `# Budget Summary for ${dateString}\n\n**Gross Pay:** ${formatCurrency(grossPay)}\n\n## Itemized Budget\n\n| Expense | Amount |\n|:--------|-------:|\n`;
    currentBudgetItems.forEach((item) => {
      mdContent += `| ${item.name} | ${formatCurrency(item.amount)} |\n`;
    });
    mdContent += `\n## Summary\n\n- **Total Budgeted:** ${formatCurrency(totalBudgeted)}\n- **Remaining Funds:** ${formatCurrency(remainingAmount)}\n\n## Savings Goals Overview\n\n`;
    goals.forEach((goal) => {
      const progress =
        goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
      mdContent += `- **${goal.name}:** ${formatCurrency(goal.current)} / ${formatCurrency(goal.target)} (${progress}%)\n`;
    });
    triggerDownload(mdContent, `BBB-planner-summary-${formatDate(date)}.md`);
  };
  const handleWeeklyDownload = () => {
    let mdContent = `# Weekly Financial Overview\n\n| Week Of | Income | Expenses | Net Flow |\n|:--------|-------:|---------:|---------:|\n`;
    weeklyData.forEach((week) => {
      mdContent += `| ${week.weekOfDisplay} | ${formatCurrency(week.income)} | ${formatCurrency(week.expenses)} | ${formatCurrency(week.net)} |\n`;
    });
    triggerDownload(mdContent, "BBB-weekly-overview.md");
  };
  const handleBillsDownload = (billsToDownload) => {
    let mdContent = `# Bills Summary\n\n| Name | Amount | Due Date | Recurrence | Importance | Category |\n|:---|---:|:---|:---|:---|:---|\n`;
    billsToDownload.forEach((bill) => {
      mdContent += `| ${bill.name} | ${formatCurrency(bill.amount)} | ${bill.dueDate ? bill.dueDate.toDate().toLocaleDateString() : "N/A"} | ${bill.recurrence} | ${bill.importance} | ${bill.category} |\n`;
    });
    triggerDownload(mdContent, "BBB-bills-summary.md");
  };

  if (loading && !isAuthReady)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500 p-4 text-center">
        {error}
      </div>
    );

  const TabButton = ({ viewName, label, icon: Icon }) => (
    <button
      onClick={() => setCurrentView(viewName)}
      className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentView === viewName ? "bg-cyan-600 text-white shadow-md" : "text-gray-300 hover:bg-gray-700"}`}
    >
      <Icon size={16} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <div className="max-w-xl mx-auto grid grid-cols-3 gap-2 p-1 mb-8 bg-gray-800 rounded-lg">
          <TabButton
            viewName="planner"
            label="Budget Planner"
            icon={ListChecks}
          />
          <TabButton
            viewName="weekly"
            label="Weekly Overview"
            icon={LayoutGrid}
          />
          <TabButton viewName="bills" label="Bills" icon={FileText} />
        </div>

        {currentView === "planner" && (
          <>
            <div className="space-y-8">
              <PaycheckInfo
                selectedPaycheck={selectedPaycheckId}
                setSelectedPaycheck={setSelectedPaycheckId}
                paychecks={consolidatedPaychecks}
                onSaveAmount={handleSaveAmount}
                onAddExtraPaycheck={handleAddExtraPaycheck}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BudgetSection
                  budgetItems={currentBudgetItems}
                  onAddBudgetItems={handleAddBudgetItems}
                  onDeleteBudgetItem={handleDeleteBudgetItem}
                  remainingAmount={remainingAmount}
                  totalBudgeted={totalBudgeted}
                  bills={bills}
                  onNavigateToBills={() => setCurrentView("bills")}
                />
                <GoalSection
                  goals={goals}
                  onAddGoals={handleAddGoals}
                  onDeleteGoal={handleDeleteGoal}
                  onAllocateToGoal={handleAllocateToGoal}
                />
              </div>
            </div>
            <footer className="text-center mt-12">
              <button
                onClick={handlePlannerDownload}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors inline-flex items-center mb-4"
              >
                <Download size={16} className="mr-2" />
                Download Planner Summary
              </button>
            </footer>
          </>
        )}

        {currentView === "weekly" && (
          <WeeklyOverview
            weeklyData={weeklyData}
            onDownload={handleWeeklyDownload}
            onWeekClick={handleWeekClick}
          />
        )}

        {currentView === "bills" && (
          <BillsView
            bills={bills}
            onSaveBill={handleSaveBill}
            onDeleteBill={handleDeleteBill}
            onDownload={handleBillsDownload}
          />
        )}
      </div>
    </div>
  );
}
