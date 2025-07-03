'use client';

import { createContext, useContext, useReducer } from 'react';

// 1. Define all possible actions to avoid typos
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
  RESET_STATE: 'RESET_STATE',
};

// 2. Define the initial, clean state of the application
const initialState = {
  billName: '',
  items: [],
  participants: [],
  tax: { amount: 11, isPercentage: true }, // Default tax to 11%
  tip: { amount: 0, isPercentage: false },
  discount: { amount: 0, isPercentage: false },
};

// 3. The Reducer: This is the brain of your state management
const billReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_BILL_NAME:
      return { ...state, billName: action.payload };

    case actions.ADD_ITEM:
      const newItem = {
        id: `item_${Date.now()}_${Math.random()}`,
        ...action.payload,
        assignedTo: [], // **CRITICAL**: Each new item must get its OWN assignment array
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
        // Also remove the participant from any item they were assigned to
        items: state.items.map(item => ({
          ...item,
          assignedTo: item.assignedTo.filter(id => id !== action.payload),
        })),
      };

    case actions.ASSIGN_ITEM:
      // **CRITICAL FIX**: This ensures immutability. It maps over the items array,
      // creating a new array. It only modifies the one specific item that needs
      // to be changed, returning a new object for it. All other items are
      // returned as they were, preventing side effects.
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
    
    case actions.RESET_STATE:
      return { ...initialState };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// 4. Create the actual React Context
const BillContext = createContext();

// 5. Create the Provider Component
// This component will wrap your app and provide the state to all children
export const BillProvider = ({ children }) => {
  const [state, dispatch] = useReducer(billReducer, initialState);

  // Helper functions (selectors) to get calculated values from state
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
    // Calculate the participant's proportion of the bill to distribute tax/tip fairly
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

  // The value that will be available to all consuming components
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

// 6. Custom Hook for easy consumption
// Instead of importing useContext and BillContext everywhere, components can just use useBill()
export const useBill = () => {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
};