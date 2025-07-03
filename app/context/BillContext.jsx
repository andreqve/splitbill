// /context/BillContext.jsx

'use client';

import { createContext, useContext, useReducer } from 'react';

// 1. Define Actions
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
};

// 2. Initial State
const initialState = {
  billName: '',
  items: [],
  participants: [],
  tax: { amount: 0, isPercentage: true },
  tip: { amount: 0, isPercentage: false },
  discount: { amount: 0, isPercentage: false },
};

// 3. The Reducer (The Core Logic)
const billReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_BILL_NAME:
      return { ...state, billName: action.payload };

    case actions.ADD_ITEM:
      const newItem = {
        id: `item_${Date.now()}_${Math.random()}`,
        ...action.payload,
        assignedTo: [], // **CRITICAL FIX**: Each new item gets its OWN new array
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
        // Also remove from any item assignments
        items: state.items.map(item => ({
          ...item,
          assignedTo: item.assignedTo.filter(id => id !== action.payload),
        })),
      };

    case actions.ASSIGN_ITEM:
      // **CRITICAL FIX**: This ensures only the specified item is updated immutably.
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === action.payload.itemId) {
            // Create a new item object with the new assignments
            return { ...item, assignedTo: action.payload.participantIds };
          }
          // Return all other items unchanged
          return item;
        }),
      };

    case actions.SET_TAX:
      return { ...state, tax: action.payload };
    case actions.SET_TIP:
      return { ...state, tip: action.payload };
    case actions.SET_DISCOUNT:
      return { ...state, discount: action.payload };
      
    default:
      return state;
  }
};

// 4. Create Context and Provider
const BillContext = createContext();

export const BillProvider = ({ children }) => {
  const [state, dispatch] = useReducer(billReducer, initialState);

  // Helper functions / Selectors
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
        assignedItems.push({ ...item, share });
      }
    });
    
    const subtotal = getSubtotal();
    const proportion = subtotal > 0 ? participantSubtotal / subtotal : 0;
    
    const taxShare = proportion * getTaxAmount();
    const tipShare = proportion * getTipAmount();
    const discountShare = proportion * getDiscountAmount();
    const grandTotal = participantSubtotal + taxShare + tipShare - discountShare;

    return { participantSubtotal, assignedItems, taxShare, tipShare, discountShare, grandTotal };
  };

  const value = { state, dispatch, actions, getSubtotal, getTaxAmount, getTipAmount, getDiscountAmount, getTotal, getParticipantSummary };

  return <BillContext.Provider value={value}>{children}</BillContext.Provider>;
};

// 5. Custom Hook for easy access
export const useBill = () => {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
};