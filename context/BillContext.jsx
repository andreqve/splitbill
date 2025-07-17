// File: context/BillContext.jsx (Updated)
'use client';

import { createContext, useContext, useReducer } from 'react';

// 1. Definisikan semua kemungkinan actions untuk menghindari salah ketik
const actions = {
  SET_BILL_NAME: 'SET_BILL_NAME',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  ADD_PARTICIPANT: 'ADD_PARTICIPANT',
  REMOVE_PARTICIPANT: 'REMOVE_PARTICIPANT',
  ASSIGN_ITEM: 'ASSIGN_ITEM',
  SET_TAX: 'SET_TAX',
  SET_TIP: 'SET_TIP',
  SET_DISCOUNT: 'SET_DISCOUNT',
  RESET_STATE: 'RESET_STATE', // <-- Action baru ditambahkan
};

// 2. Definisikan state awal yang bersih untuk aplikasi
const initialState = {
  billName: '',
  items: [],
  participants: [],
  tax: { amount: 11, isPercentage: true }, // Pajak default 11%
  tip: { amount: 0, isPercentage: false },
  discount: { amount: 0, isPercentage: false },
};

// 3. Reducer: Ini adalah "otak" dari manajemen state Anda
const billReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_BILL_NAME:
      return { ...state, billName: action.payload };

    case actions.ADD_ITEM:
      const newItem = {
        id: `item_${Date.now()}_${Math.random()}`,
        ...action.payload,
        assignedTo: [], // **PENTING**: Setiap item baru harus mendapatkan array assignment-nya sendiri
      };
      return { ...state, items: [...state.items, newItem] };

    case actions.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        ),
      };

    case actions.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case actions.ADD_PARTICIPANT:
      const newParticipant = {
        id: `p_${Date.now()}_${Math.random()}`,
        name: action.payload,
      };
      return { ...state, participants: [...state.participants, newParticipant] };

    case actions.REMOVE_PARTICIPANT:
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== action.payload),
        // Hapus juga peserta dari setiap item yang ditugaskan padanya
        items: state.items.map(item => ({
          ...item,
          assignedTo: item.assignedTo.filter(id => id !== action.payload),
        })),
      };

    case actions.ASSIGN_ITEM:
      // **PERBAIKAN PENTING**: Ini memastikan imutabilitas (immutability).
      // Kode ini memetakan array item, membuat array baru. Ia hanya memodifikasi
      // satu item spesifik yang perlu diubah, mengembalikan objek baru untuknya.
      // Semua item lain dikembalikan apa adanya, mencegah efek samping (side effects).
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.itemId) {
            return { ...item, assignedTo: action.payload.participantIds };
          }
          return item;
        }),
      };

    case actions.SET_TAX:
      return { ...state, tax: action.payload };
    case actions.SET_TIP:
      return { ...state, tip: action.payload };
    case actions.SET_DISCOUNT:
      return { ...state, discount: action.payload };
    
    // <-- Logika untuk action baru
    case actions.RESET_STATE:
      return { ...initialState };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// 4. Buat Context React yang sebenarnya
const BillContext = createContext();

// 5. Buat Komponen Provider
// Komponen ini akan membungkus aplikasi Anda dan menyediakan state ke semua turunannya
export const BillProvider = ({ children }) => {
  const [state, dispatch] = useReducer(billReducer, initialState);

  // Fungsi bantuan (selectors) untuk mendapatkan nilai yang dihitung dari state
  const getSubtotal = () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    return state.tax.isPercentage ? (subtotal * state.tax.amount) / 100 : state.tax.amount;
  };

  const getTipAmount = () => {
    const subtotal = getSubtotal();
    return state.tip.isPercentage ? (subtotal * state.tip.amount) / 100 : state.tip.amount;
  };

   const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    return state.discount.isPercentage ? (subtotal * state.discount.amount) / 100 : state.discount.amount;
  };

  const getTotal = () => getSubtotal() + getTaxAmount() + getTipAmount() - getDiscountAmount();

  const getParticipantSummary = (participantId) => {
    let participantSubtotal = 0;
    const assignedItems = [];

    state.items.forEach(item => {
      const assignedCount = item.assignedTo.length;
      if (assignedCount > 0 && item.assignedTo.includes(participantId)) {
        const share = (item.price * item.quantity) / assignedCount;
        participantSubtotal += share;
        assignedItems.push({ id: item.id, name: item.name, quantity: item.quantity, share });
      }
    });
    
    const overallSubtotal = getSubtotal();
    // Hitung proporsi peserta dari tagihan untuk mendistribusikan pajak/tip secara adil
    const proportion = overallSubtotal > 0 ? participantSubtotal / overallSubtotal : 0;
    
    const taxShare = proportion * getTaxAmount();
    const tipShare = proportion * getTipAmount();
    const discountShare = proportion * getDiscountAmount();
    const grandTotal = participantSubtotal + taxShare + tipShare - discountShare;

    return { 
        subtotal: participantSubtotal, 
        assignedItems, 
        taxShare, 
        tipShare, 
        discountShare, 
        grandTotal 
    };
  };

  // Nilai yang akan tersedia untuk semua komponen yang menggunakannya
  const value = { 
    state, 
    dispatch, 
    actions, 
    getSubtotal, 
    getTaxAmount, 
    getTipAmount, 
    getDiscountAmount, 
    getTotal, 
    getParticipantSummary 
  };

  return <BillContext.Provider value={value}>{children}</BillContext.Provider>;
};

// 6. Custom Hook untuk penggunaan yang mudah
// Daripada mengimpor useContext dan BillContext di mana-mana, komponen bisa langsung menggunakan useBill()
export const useBill = () => {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
};