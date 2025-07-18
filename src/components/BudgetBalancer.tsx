"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
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
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Types
interface PaycheckData {
  id: string;
  date: Date;
  amount: number;
  isExtra: boolean;
}

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category?: string;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  category?: string;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate?: Date;
  recurrence: string;
  importance: string;
  category: string;
}

// Constants
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

// Helper functions
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

const formatDate = (date: Date | string | null) =>
  date
    ? new Date(typeof date === 'string' ? date : date.getTime() - new Date(date).getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0]
    : "";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount || 0,
  );

// Animation variants
const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Components
const Modal: React.FC<{
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}> = ({ show, onClose, children, size = "lg" }) => {
  if (!show) return null;
  
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`bg-white dark:bg-[hsl(240,4%,16%)] rounded-xl p-6 relative ${sizeClasses[size]} w-full shadow-2xl border border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)]`}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-[hsl(0,0%,60%)] hover:text-[hsl(0,0%,4%)] dark:hover:text-[hsl(0,0%,98%)] p-1 rounded-md hover:bg-[hsl(0,0%,96%)] dark:hover:bg-[hsl(240,4%,16%)] transition-colors z-10"
          >
            <X size={20} />
          </motion.button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <motion.div
    variants={staggerItem}
    className={`bg-white dark:bg-[hsl(240,4%,16%)] backdrop-blur-sm border border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${className}`}
  >
    {children}
  </motion.div>
);

const Header: React.FC = () => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center mb-8"
  >
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", damping: 15 }}
      className="flex items-center justify-center gap-3 mb-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="text-[hsl(207,90%,54%)]" size={32} />
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-bold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] tracking-tight">
        BrokeBudgetBalancer <span className="text-[hsl(207,90%,54%)]">BBB</span>
      </h1>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <TrendingUp className="text-[hsl(142,71%,45%)]" size={32} />
      </motion.div>
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)] mt-2 text-lg"
    >
      Balance your budget, one paycheck at a time.
    </motion.p>
  </motion.header>
);

const PaycheckInfo: React.FC<{
  selectedPaycheck: string;
  setSelectedPaycheck: (id: string) => void;
  paychecks: PaycheckData[];
  onSaveAmount: (paycheck: PaycheckData, amount: number) => void;
  onAddExtraPaycheck: (paycheck: { date: Date; amount: number }) => void;
}> = ({
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
    if (extraDate && extraAmount && parseFloat(extraAmount) > 0) {
      onAddExtraPaycheck({
        date: new Date(extraDate + "T00:00:00"),
        amount: parseFloat(extraAmount),
      });
      setShowModal(false);
      setExtraDate("");
      setExtraAmount("");
      toast.success("Extra income added successfully!");
    }
  };

  const handleSave = () => {
    if (selectedPaycheckObject) {
      onSaveAmount(selectedPaycheckObject, parseFloat(currentAmount.toString()));
      toast.success("Paycheck amount saved!");
    }
  };

  return (
    <>
      <Card>
        <motion.h2
          variants={staggerItem}
          className="text-2xl font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-4 flex items-center"
        >
          <Calendar className="mr-3 text-[hsl(207,90%,54%)]" />
          Paycheck Details
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.div variants={staggerItem}>
            <label
              htmlFor="paycheck-date"
              className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
            >
              Select Paycheck Date
            </label>
            <select
              id="paycheck-date"
              value={selectedPaycheck}
              onChange={(e) => setSelectedPaycheck(e.target.value)}
              className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)] transition-colors"
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
          </motion.div>
          <motion.div variants={staggerItem}>
            <label
              htmlFor="income-amount"
              className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
            >
              Income Amount
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="income-amount"
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(parseFloat(e.target.value) || 0)}
                onBlur={handleSave}
                placeholder="e.g., 1500"
                className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)] transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="p-2 bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,48%)] rounded-md text-white transition-colors"
              >
                <CheckCircle size={20} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
        <motion.div variants={staggerItem} className="mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="w-full text-center bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Add Other Income
          </motion.button>
        </motion.div>
        <motion.div
          variants={staggerItem}
          className="mt-6 bg-[hsl(0,0%,96%)] dark:bg-[hsl(240,4%,16%)] p-4 rounded-lg text-center"
        >
          <p className="text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)] text-lg">Gross Pay for this Period</p>
          <motion.p
            key={selectedPaycheckObject?.amount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-[hsl(142,71%,45%)]"
          >
            {formatCurrency(selectedPaycheckObject?.amount || 0)}
          </motion.p>
        </motion.div>
      </Card>
      
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-xl font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-4">
          Add Other Income
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="extra-date"
              className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="extra-date"
              value={extraDate}
              onChange={(e) => setExtraDate(e.target.value)}
              className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)]"
            />
          </div>
          <div>
            <label
              htmlFor="extra-amount"
              className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
            >
              Gross Amount
            </label>
            <input
              type="number"
              id="extra-amount"
              value={extraAmount}
              onChange={(e) => setExtraAmount(e.target.value)}
              placeholder="e.g., 500"
              className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)]"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddExtra}
            className="w-full bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Add Income
          </motion.button>
        </div>
      </Modal>
    </>
  );
};

const AddCustomExpenseModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onSave: (items: { name: string; amount: number }[]) => void;
  categories: string[];
  itemType: string;
}> = ({ show, onClose, onSave, categories, itemType }) => {
  const [items, setItems] = useState([
    { id: Date.now(), category: "Other", customName: "", amount: "" },
  ]);

  const handleItemChange = (id: number, field: string, value: string) => {
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
    
  const removeItemRow = (id: number) =>
    setItems(items.filter((item) => item.id !== id));

  const handleSave = () => {
    const validItems = items
      .filter(
        (item) =>
          parseFloat(item.amount) > 0 &&
          (item.category !== "Other" || item.customName.trim() !== ""),
      )
      .map((item) => ({
        name:
          item.category === "Other" ? item.customName.trim() : item.category,
        amount: parseFloat(item.amount),
      }));
    if (validItems.length > 0) {
      onSave(validItems);
      toast.success(`${itemType}s added successfully!`);
    }
    setItems([
      { id: Date.now(), category: "Other", customName: "", amount: "" },
    ]);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <h3 className="text-xl font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-4">
        Add {itemType}s
      </h3>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-3 max-h-[60vh] overflow-y-auto pr-2"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={staggerItem}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center bg-[hsl(0,0%,96%)] dark:bg-[hsl(240,4%,16%)] p-2 rounded-lg"
          >
            <div className="col-span-3 md:col-span-1">
              <select
                value={item.category}
                onChange={(e) =>
                  handleItemChange(item.id, "category", e.target.value)
                }
                className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-2 text-sm focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)]"
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
                  className="flex-grow bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-2 text-sm focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)]"
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
                className="w-28 bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-2 text-sm focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => removeItemRow(item.id)}
                className="flex-shrink-0 text-[hsl(0,84%,60%)] hover:text-[hsl(0,84%,55%)] flex items-center justify-center bg-white dark:bg-[hsl(240,4%,16%)] rounded-md px-3 transition-colors"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-4 flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addItemRow}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
        >
          Add Row
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Save {itemType}s
        </motion.button>
      </div>
    </Modal>
  );
};

const BillFormModal: React.FC<{
  show: boolean;
  onClose: () => void;
  onSave: (bill: Partial<Bill>) => void;
  bill?: Bill;
}> = ({ show, onClose, onSave, bill }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    recurrence: "Monthly",
    importance: "Medium",
    category: "Other",
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name,
        amount: bill.amount.toString(),
        dueDate: bill.dueDate ? formatDate(bill.dueDate) : "",
        recurrence: bill.recurrence,
        importance: bill.importance,
        category: bill.category,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const amount = parseFloat(formData.amount);
    const dataToSave = {
      id: bill?.id,
      name: formData.name,
      amount: isNaN(amount) ? 0 : amount,
      dueDate: formData.dueDate ? new Date(formData.dueDate + "T00:00:00") : undefined,
      recurrence: formData.recurrence,
      importance: formData.importance,
      category: formData.category,
    };
    onSave(dataToSave);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose} size="xl">
      <h3 className="text-xl font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-6">
        {bill ? "Edit Bill" : "Add New Bill"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
          >
            Bill Name/Title
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter bill name (e.g., Rent, Electricity)"
            className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-3 focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)] transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
          >
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-3 focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)] transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
          >
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-3 focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)] transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="recurrence"
            className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
          >
            How Often
          </label>
          <select
            name="recurrence"
            id="recurrence"
            value={formData.recurrence}
            onChange={handleChange}
            className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-3 focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)] transition-all"
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
            className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
          >
            Importance
          </label>
          <select
            name="importance"
            id="importance"
            value={formData.importance}
            onChange={handleChange}
            className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-3 focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)] transition-all"
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
            className="block text-sm font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-1"
          >
            Category/Grouping
          </label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-3 focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)] transition-all"
          >
            {BILL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="bg-[hsl(0,0%,60%)] hover:bg-[hsl(0,0%,55%)] text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!formData.name || !formData.amount}
          className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] disabled:bg-[hsl(0,0%,80%)] disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          {bill ? "Update Bill" : "Save Bill"}
        </motion.button>
      </div>
    </Modal>
  );
};

// Main Budget App Component
export default function BudgetBalancer() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState("planner");

  // Data state
  const [paychecks, setPaychecks] = useState<PaycheckData[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedPaycheckId, setSelectedPaycheckId] = useState("");
  
  // Modal states
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | undefined>(undefined);
  const [goalAllocations, setGoalAllocations] = useState<{ [key: string]: string }>({});

  // API functions
  const fetchPaychecks = async () => {
    try {
      const response = await fetch('/api/budget/paychecks');
      if (!response.ok) throw new Error('Failed to fetch paychecks');
      const data = await response.json();
      
      // Generate regular paychecks and merge with saved ones
      const regularPaychecks = generatePaycheckDates();
      const savedPaychecks = data.map((p: any) => ({
        id: p.id,
        date: new Date(p.date),
        amount: p.amount,
        isExtra: p.isExtra,
      }));
      
      // Merge regular and saved paychecks
      const paycheckMap = new Map();
      regularPaychecks.forEach(p => paycheckMap.set(p.id, p));
      savedPaychecks.forEach((p: any) => {
        if (p.isExtra) {
          paycheckMap.set(p.id, p);
        } else {
          const existing = paycheckMap.get(p.id);
          if (existing) {
            existing.amount = p.amount;
          }
        }
      });
      
      const mergedPaychecks = Array.from(paycheckMap.values()).sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      );
      
      setPaychecks(mergedPaychecks);
      
      if (mergedPaychecks.length > 0 && !selectedPaycheckId) {
        const firstFuturePaycheck = mergedPaychecks.find(p => p.date >= new Date()) || mergedPaychecks[0];
        setSelectedPaycheckId(firstFuturePaycheck.id);
      }
    } catch (error) {
      console.error('Error fetching paychecks:', error);
      toast.error('Failed to load paychecks');
    }
  };

  const fetchBudgetItems = async (paycheckId?: string) => {
    try {
      const url = paycheckId ? `/api/budget/items?paycheckId=${paycheckId}` : '/api/budget/items';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch budget items');
      const data = await response.json();
      setBudgetItems(data);
    } catch (error) {
      console.error('Error fetching budget items:', error);
      toast.error('Failed to load budget items');
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/budget/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    }
  };

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/budget/bills');
      if (!response.ok) throw new Error('Failed to fetch bills');
      const data = await response.json();
      setBills(data.map((bill: any) => ({
        ...bill,
        dueDate: bill.dueDate ? new Date(bill.dueDate) : undefined,
      })));
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to load bills');
    }
  };

  // Initialize data
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      setError("Please sign in to use the Budget Balancer");
      setLoading(false);
      return;
    }

    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchPaychecks(),
          fetchGoals(),
          fetchBills(),
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [session, status]);

  // Fetch budget items when paycheck changes
  useEffect(() => {
    if (selectedPaycheckId) {
      fetchBudgetItems(selectedPaycheckId);
    }
  }, [selectedPaycheckId]);

  // Memoized calculations
  const selectedPaycheckObject = useMemo(
    () => paychecks.find((p) => p.id === selectedPaycheckId),
    [paychecks, selectedPaycheckId],
  );

  const grossPay = useMemo(
    () => selectedPaycheckObject?.amount || 0,
    [selectedPaycheckObject],
  );

  const totalBudgeted = useMemo(
    () => budgetItems.reduce((sum, item) => sum + item.amount, 0),
    [budgetItems],
  );

  const remainingAmount = useMemo(
    () => grossPay - totalBudgeted,
    [grossPay, totalBudgeted],
  );

  // Event handlers with API calls
  const handleSaveAmount = useCallback(
    async (paycheck: PaycheckData, amount: number) => {
      try {
        const response = await fetch('/api/budget/paychecks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: paycheck.id, amount }),
        });
        
        if (!response.ok) throw new Error('Failed to save amount');
        
        setPaychecks(prev => 
          prev.map(p => p.id === paycheck.id ? { ...p, amount } : p)
        );
        toast.success('Paycheck amount saved!');
      } catch (error) {
        console.error('Error saving amount:', error);
        toast.error('Failed to save paycheck amount');
      }
    },
    [],
  );

  const handleAddExtraPaycheck = useCallback(
    async (paycheck: { date: Date; amount: number }) => {
      try {
        const response = await fetch('/api/budget/paychecks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            date: paycheck.date.toISOString(), 
            amount: paycheck.amount, 
            isExtra: true 
          }),
        });
        
        if (!response.ok) throw new Error('Failed to add extra paycheck');
        
        const newPaycheck = await response.json();
        const paycheckData: PaycheckData = {
          id: newPaycheck.id,
          date: new Date(newPaycheck.date),
          amount: newPaycheck.amount,
          isExtra: true,
        };
        
        setPaychecks(prev => [...prev, paycheckData].sort((a, b) => a.date.getTime() - b.date.getTime()));
        toast.success('Extra income added successfully!');
      } catch (error) {
        console.error('Error adding extra paycheck:', error);
        toast.error('Failed to add extra income');
      }
    },
    [],
  );

  const handleAddBudgetItems = useCallback(
    async (items: { name: string; amount: number }[]) => {
      if (!selectedPaycheckId) return;
      
      try {
        const response = await fetch('/api/budget/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, paycheckId: selectedPaycheckId }),
        });
        
        if (!response.ok) throw new Error('Failed to add budget items');
        
        await fetchBudgetItems(selectedPaycheckId);
        toast.success('Budget items added successfully!');
      } catch (error) {
        console.error('Error adding budget items:', error);
        toast.error('Failed to add budget items');
      }
    },
    [selectedPaycheckId],
  );

  const handleDeleteBudgetItem = useCallback(
    async (itemToDelete: BudgetItem) => {
      try {
        const response = await fetch(`/api/budget/items?id=${itemToDelete.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete budget item');
        
        setBudgetItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        toast.success('Budget item deleted');
      } catch (error) {
        console.error('Error deleting budget item:', error);
        toast.error('Failed to delete budget item');
      }
    },
    [],
  );

  const handleAddGoals = useCallback(
    async (goalsToAdd: { name: string; amount: number }[]) => {
      try {
        const response = await fetch('/api/budget/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goals: goalsToAdd }),
        });
        
        if (!response.ok) throw new Error('Failed to add goals');
        
        await fetchGoals();
        toast.success('Goals added successfully!');
      } catch (error) {
        console.error('Error adding goals:', error);
        toast.error('Failed to add goals');
      }
    },
    [],
  );

  const handleDeleteGoal = useCallback(
    async (goalId: string) => {
      try {
        const response = await fetch(`/api/budget/goals?id=${goalId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete goal');
        
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
        toast.success('Goal deleted');
      } catch (error) {
        console.error('Error deleting goal:', error);
        toast.error('Failed to delete goal');
      }
    },
    [],
  );

  const handleAllocateToGoal = useCallback(
    async (goal: Goal, amount: number) => {
      if (!selectedPaycheckId) return;
      
      try {
        // Update goal
        const goalResponse = await fetch('/api/budget/goals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: goal.id, amount }),
        });
        
        if (!goalResponse.ok) throw new Error('Failed to update goal');
        
        // Add budget item
        const budgetResponse = await fetch('/api/budget/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            items: [{ name: `Goal: ${goal.name}`, amount }], 
            paycheckId: selectedPaycheckId 
          }),
        });
        
        if (!budgetResponse.ok) throw new Error('Failed to add budget item');
        
        // Refresh data
        await Promise.all([
          fetchGoals(),
          fetchBudgetItems(selectedPaycheckId),
        ]);
        
        toast.success(`Allocated ${formatCurrency(amount)} to ${goal.name}`);
      } catch (error) {
        console.error('Error allocating to goal:', error);
        toast.error('Failed to allocate to goal');
      }
    },
    [selectedPaycheckId],
  );

  const handleSaveBill = useCallback(
    async (billData: Partial<Bill>) => {
      try {
        const method = billData.id ? 'PUT' : 'POST';
        const response = await fetch('/api/budget/bills', {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(billData),
        });
        
        if (!response.ok) throw new Error('Failed to save bill');
        
        await fetchBills();
        toast.success(billData.id ? 'Bill updated successfully!' : 'Bill added successfully!');
      } catch (error) {
        console.error('Error saving bill:', error);
        toast.error('Failed to save bill');
      }
    },
    [],
  );

  const handleDeleteBill = useCallback(
    async (billId: string) => {
      try {
        const response = await fetch(`/api/budget/bills?id=${billId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete bill');
        
        setBills(prev => prev.filter(bill => bill.id !== billId));
        toast.success('Bill deleted');
      } catch (error) {
        console.error('Error deleting bill:', error);
        toast.error('Failed to delete bill');
      }
    },
    [],
  );

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
        >
          <div className="text-[hsl(0,84%,60%)] text-6xl mb-4">💸</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Access Required
          </h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      </div>
    );
  }

  const TabButton: React.FC<{
    viewName: string;
    label: string;
    icon: React.ElementType;
  }> = ({ viewName, label, icon: Icon }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setCurrentView(viewName)}
      className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
        currentView === viewName
          ? "bg-[hsl(207,90%,54%)] text-white shadow-md"
          : "text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] hover:bg-[hsl(0,0%,96%)] dark:hover:bg-[hsl(240,4%,16%)]"
      }`}
    >
      <Icon size={16} className="mr-2" />
      {label}
    </motion.button>
  );

  return (
    <div className="bg-white dark:bg-[hsl(240,10%,4%)] min-h-screen font-sans text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto grid grid-cols-3 gap-2 p-1 mb-8 bg-[hsl(0,0%,96%)] dark:bg-[hsl(240,4%,16%)] rounded-lg"
        >
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
        </motion.div>

        <AnimatePresence mode="wait">
          {currentView === "planner" && (
            <motion.div
              key="planner"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              <PaycheckInfo
                selectedPaycheck={selectedPaycheckId}
                setSelectedPaycheck={setSelectedPaycheckId}
                paychecks={paychecks}
                onSaveAmount={handleSaveAmount}
                onAddExtraPaycheck={handleAddExtraPaycheck}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] flex items-center">
                      <DollarSign className="mr-3 text-[hsl(142,71%,45%)]" />
                      Budget
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowExpenseModal(true)}
                      className="bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors"
                    >
                      <PlusCircle className="mr-2" size={16} />
                      Add Expense
                    </motion.button>
                  </div>
                  <div className="space-y-2">
                    {budgetItems.length > 0 ? (
                      budgetItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex justify-between items-center p-3 bg-[hsl(0,0%,96%)] dark:bg-[hsl(240,4%,16%)] rounded-lg"
                        >
                          <span className="font-medium">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[hsl(142,71%,45%)] font-semibold">
                              {formatCurrency(item.amount)}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteBudgetItem(item)}
                              className="text-[hsl(0,84%,60%)] hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)]"
                      >
                        <Wallet size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No budget items added yet.</p>
                        <p className="text-sm">Start by adding some expenses!</p>
                      </motion.div>
                    )}
                  </div>
                  <div className="mt-6 border-t border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] pt-4 space-y-2">
                    <div className="flex justify-between text-lg">
                      <span className="text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]">Total Budgeted:</span>
                      <span className="font-semibold text-orange-500">
                        {formatCurrency(totalBudgeted)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl">
                      <span className="text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] font-bold">Remaining Funds:</span>
                      <motion.span
                        key={remainingAmount}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`font-bold ${remainingAmount >= 0 ? 'text-[hsl(207,90%,54%)]' : 'text-[hsl(0,84%,60%)]'}`}
                      >
                        {formatCurrency(remainingAmount)}
                      </motion.span>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] flex items-center">
                      <Target className="mr-3 text-purple-500" />
                      Savings Goals
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowGoalModal(true)}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors"
                    >
                      <PlusCircle className="mr-2" size={16} />
                      Add Goals
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    {goals.length > 0 ? (
                      goals.map((goal) => {
                        const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                        return (
                          <motion.div
                            key={goal.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[hsl(0,0%,96%)] dark:bg-[hsl(240,4%,16%)] p-4 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]">{goal.name}</p>
                                <p className="text-sm text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]">
                                  {formatCurrency(goal.current)} /{" "}
                                  <span className="text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)]">
                                    {formatCurrency(goal.target)}
                                  </span>
                                </p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="text-[hsl(0,84%,60%)] hover:text-red-600"
                              >
                                <Trash2 size={18} />
                              </motion.button>
                            </div>
                            <div className="w-full bg-[hsl(0,0%,89%)] dark:bg-[hsl(240,4%,16%)] rounded-full h-2.5 mb-3">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="bg-purple-500 h-2.5 rounded-full"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                placeholder="Allocate"
                                value={goalAllocations[goal.id] || ''}
                                onChange={(e) => setGoalAllocations(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                className="w-full bg-white dark:bg-[hsl(240,4%,16%)] text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] border-[hsl(0,0%,89%)] dark:border-[hsl(240,4%,16%)] rounded-md p-2 text-sm focus:ring-[hsl(207,90%,54%)] focus:border-[hsl(207,90%,54%)]"
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const amount = parseFloat(goalAllocations[goal.id] || '0');
                                  if (amount > 0) {
                                    handleAllocateToGoal(goal, amount);
                                    setGoalAllocations(prev => ({ ...prev, [goal.id]: '' }));
                                  }
                                }}
                                className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,48%)] text-white px-3 py-2 rounded-md text-sm transition-colors"
                              >
                                Allocate
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)]"
                      >
                        <Target size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No savings goals set up yet.</p>
                        <p className="text-sm">Start planning for your future!</p>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
          
          {currentView === "weekly" && (
            <motion.div
              key="weekly"
              variants={slideInFromRight}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card>
                <h2 className="text-2xl font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] mb-4 flex items-center">
                  <LayoutGrid className="mr-3 text-[hsl(174,71%,45%)]" />
                  Weekly Overview
                </h2>
                <div className="text-center py-8 text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)]">
                  <LayoutGrid size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Weekly overview will be displayed here.</p>
                  <p className="text-sm">Track your weekly financial progress!</p>
                </div>
              </Card>
            </motion.div>
          )}
          
          {currentView === "bills" && (
            <motion.div
              key="bills"
              variants={slideInFromLeft}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] flex items-center">
                    <FileText className="mr-3 text-[hsl(45,93%,47%)]" />
                    Bills Management
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setEditingBill(undefined);
                      setShowBillModal(true);
                    }}
                    className="bg-[hsl(45,93%,47%)] hover:bg-[hsl(45,93%,42%)] text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors"
                  >
                    <PlusCircle className="mr-2" size={16} />
                    Add Bill
                  </motion.button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {bills.length > 0 ? (
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {bills.map((bill) => {
                      const importanceColor = (importance: string) => {
                        switch (importance) {
                          case "High":
                            return "bg-[hsl(0,84%,60%)]";
                          case "Medium":
                            return "bg-[hsl(45,93%,47%)]";
                          case "Low":
                            return "bg-[hsl(142,71%,45%)]";
                          default:
                            return "bg-[hsl(0,0%,60%)]";
                        }
                      };

                      return (
                        <motion.div
                          key={bill.id}
                          variants={staggerItem}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-[hsl(0,0%,96%)] dark:bg-[hsl(240,4%,16%)] p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <motion.span
                                  className={`w-3 h-3 rounded-full ${importanceColor(bill.importance)} shadow-sm`}
                                  whileHover={{ scale: 1.2 }}
                                ></motion.span>
                                <p className="font-semibold text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)] text-lg">
                                  {bill.name}
                                </p>
                              </div>
                              <div className="text-sm text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)] space-y-1">
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                  <span>
                                    Amount:{" "}
                                    <span className="font-medium text-[hsl(142,71%,45%)]">
                                      {formatCurrency(bill.amount)}
                                    </span>
                                  </span>
                                  {bill.dueDate && (
                                    <span>
                                      Due:{" "}
                                      <span className="font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]">
                                        {bill.dueDate.toLocaleDateString()}
                                      </span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                  <span>
                                    Recurrence:{" "}
                                    <span className="font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]">
                                      {bill.recurrence}
                                    </span>
                                  </span>
                                  <span>
                                    Category:{" "}
                                    <span className="font-medium text-[hsl(0,0%,4%)] dark:text-[hsl(0,0%,98%)]">
                                      {bill.category}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  setEditingBill(bill);
                                  setShowBillModal(true);
                                }}
                                className="text-[hsl(207,90%,54%)] hover:text-[hsl(207,90%,48%)] p-2 rounded-md hover:bg-[hsl(207,90%,54%)]/10 transition-colors"
                              >
                                <Edit size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteBill(bill.id)}
                                className="text-[hsl(0,84%,60%)] hover:text-[hsl(0,84%,55%)] p-2 rounded-md hover:bg-[hsl(0,84%,60%)]/10 transition-colors"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-[hsl(0,0%,60%)] dark:text-[hsl(0,0%,70%)]"
                    >
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No bills added yet.</p>
                      <p className="text-sm">Keep track of all your recurring payments!</p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Modals */}
      <AddCustomExpenseModal
        show={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSave={handleAddBudgetItems}
        categories={EXPENSE_CATEGORIES}
        itemType="Expense"
      />
      
      <AddCustomExpenseModal
        show={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSave={handleAddGoals}
        categories={GOAL_CATEGORIES}
        itemType="Goal"
      />
      
      <BillFormModal
        show={showBillModal}
        onClose={() => {
          setShowBillModal(false);
          setEditingBill(undefined);
        }}
        onSave={handleSaveBill}
        bill={editingBill}
      />
    </div>
  );
}
