'use client';

import { useState, useRef } from 'react';
import { useBill } from '@/context/BillContext';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Receipt, Edit2, ShoppingCart, Camera, Upload, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function BillSetup() {
  const { state, dispatch, actions } = useBill();
  const [editingItem, setEditingItem] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef(null);
  
  // Create 2 default input rows instead of 5
  const [inputRows, setInputRows] = useState([
    { id: 1, name: '', quantity: '', price: '' },
    { id: 2, name: '', quantity: '', price: '' }
  ]);

  const handleInputChange = (rowId, field, value) => {
    setInputRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ));
  };

  const handleAddItem = (rowId) => {
    const row = inputRows.find(r => r.id === rowId);
    if (row.name && row.quantity && row.price) {
      dispatch({
        type: actions.ADD_ITEM,
        payload: { 
          name: row.name, 
          quantity: parseInt(row.quantity) || 1, 
          price: parseFloat(row.price) || 0 
        }
      });
      
      // Clear the row
      setInputRows(prev => prev.map(r => 
        r.id === rowId ? { ...r, name: '', quantity: '', price: '' } : r
      ));
    }
  };

  const handleKeyPress = (e, rowId) => {
    if (e.key === 'Enter') {
      handleAddItem(rowId);
    }
  };

  const isRowComplete = (row) => {
    return row.name.trim() && row.quantity && row.price;
  };

  const handleUpdateItem = (item) => {
    dispatch({
      type: actions.UPDATE_ITEM,
      payload: { ...item, price: parseFloat(item.price) }
    });
    setEditingItem(null);
  };

  const handleRemoveItem = (itemId) => {
    dispatch({
      type: actions.REMOVE_ITEM,
      payload: itemId
    });
  };

  const getTotal = () => {
    return state.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  // OCR functionality
  const parseReceiptText = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const items = [];
    
    // Enhanced patterns for Indonesian receipts
    const pricePatterns = [
      /(.+?)\s+x\s*(\d+)\s+(\d+[.,]?\d*)\s*$/i,    // Item x1 25000 format
      /(.+?)\s+(\d+[.,]?\d*)\s*$/,                 // Item 25000 format
      /(.+?)\s+Rp\s*(\d+[.,]?\d*)\s*$/i,          // Item Rp 25000 format
      /(.+?)\s+(\d+)\s*k\s*$/i,                   // Item 25k format
      /(.+?)\s+(\d+[.,]\d{3})\s*$/,               // Item 25.000 format
    ];

    for (const line of lines) {
      // Skip lines that are clearly not items
      if (line.toLowerCase().includes('total') || 
          line.toLowerCase().includes('subtotal') ||
          line.toLowerCase().includes('pajak') ||
          line.toLowerCase().includes('tax') ||
          line.toLowerCase().includes('service') ||
          line.toLowerCase().includes('receipt') ||
          line.toLowerCase().includes('terima kasih') ||
          line.toLowerCase().includes('thank') ||
          line.length < 3) {
        continue;
      }

      for (const pattern of pricePatterns) {
        const match = line.match(pattern);
        if (match) {
          let itemName, price, quantity = 1;
          
          if (match.length === 4) {
            // Format: Item x1 25000
            itemName = match[1].trim();
            quantity = parseInt(match[2]) || 1;
            price = match[3].replace(/[.,]/g, '');
          } else {
            // Format: Item 25000
            itemName = match[1].trim();
            price = match[2].replace(/[.,]/g, '');
          }
          
          // Handle 'k' suffix (thousands)
          if (price.toLowerCase().includes('k')) {
            price = price.toLowerCase().replace('k', '000');
          }
          
          // Clean up item name
          const cleanName = itemName
            .replace(/^\d+\s*[x×]\s*/i, '') // Remove quantity prefix
            .replace(/\s+\d+\s*$/, '')      // Remove trailing numbers
            .trim();

          const numericPrice = parseFloat(price);
          
          if (cleanName.length > 2 && numericPrice > 0) {
            items.push({
              name: cleanName,
              quantity: quantity,
              price: numericPrice
            });
            break; // Found a match, move to next line
          }
        }
      }
    }

    return items;
  };

  const handleReceiptScan = async (file) => {
    if (!file) return;

    setIsScanning(true);
    setScanProgress(0);

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100));
          }
        }
      });

      const extractedText = result.data.text;
      console.log('Extracted text:', extractedText);
      
      const parsedItems = parseReceiptText(extractedText);
      console.log('Parsed items:', parsedItems);

      // Add parsed items to the bill
      parsedItems.forEach(item => {
        dispatch({
          type: actions.ADD_ITEM,
          payload: item
        });
      });

      if (parsedItems.length === 0) {
        alert('Tidak bisa menemukan item di receipt ini. Coba foto yang lebih jelas atau tambah manual aja ya! 📸');
      } else {
        alert(`Berhasil scan ${parsedItems.length} item dari receipt! 🎉`);
      }

    } catch (error) {
      console.error('OCR Error:', error);
      alert('Gagal scan receipt. Coba lagi atau tambah manual aja ya! 😅');
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleReceiptScan(file);
    }
    // Reset file input
    event.target.value = '';
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Fallback mock scan function
  const handleMockScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch('/api/ocr');
      const data = await response.json();
      
      // Add mock items to the bill
      data.items.forEach(item => {
        dispatch({
          type: actions.ADD_ITEM,
          payload: {
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }
        });
      });

      setScanProgress(100);
      setTimeout(() => {
        alert(`Berhasil scan ${data.items.length} item dari receipt! 🎉`);
        setIsScanning(false);
        setScanProgress(0);
      }, 500);

    } catch (error) {
      console.error('Mock scan error:', error);
      alert('Gagal scan receipt. Coba lagi atau tambah manual aja ya! 😅');
      setIsScanning(false);
      setScanProgress(0);
    }

    clearInterval(progressInterval);
  };

  return (
    <div className="space-y-6">
      {/* Bill Name */}
      <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Receipt className="h-5 w-5" />
            Nama Tagihan 📝
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              id="billName"
              placeholder="contoh: Makan Bergizi Bayar"
              value={state.billName}
              onChange={(e) => dispatch({
                type: actions.SET_BILL_NAME,
                payload: e.target.value
              })}
              className="text-lg font-medium"
            />
          </div>
        </CardContent>
      </Card>

      {/* Unified Scan Receipt & Manual Entry Section */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <ShoppingCart className="h-5 w-5" />
            List Makanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Receipt Scanner Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="h-5 w-5 text-indigo-600" />
              <h3 className="font-medium text-indigo-800">Scan Receipt 📸</h3>
            </div>
            
            <p className="text-sm text-gray-600">
              Upload foto receipt buat otomatis detect item dan harga! Atau coba demo scan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={triggerFileSelect}
                disabled={isScanning}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 flex-1"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scanning... {scanProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Receipt
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleMockScan}
                disabled={isScanning}
                variant="outline"
                className="flex items-center gap-2 flex-1"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Demo Scan...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Demo Scan
                  </>
                )}
              </Button>
            </div>

            {isScanning && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="text-xs text-gray-500">
              💡 <strong>Tips:</strong> Foto yang jelas dan terang akan memberikan hasil scan yang lebih akurat!
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">ATAU</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Manual Entry Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Edit2 className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-800">Tambah Manual ✍️</h3>
            </div>
            
            <div className="space-y-3">
              {inputRows.map((row) => (
                <div key={row.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Nama makanan/minuman"
                      value={row.name}
                      onChange={(e) => handleInputChange(row.id, 'name', e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, row.id)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Berapa"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, row.id)}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Harga (Rp)"
                      step="1000"
                      min="0"
                      value={row.price}
                      onChange={(e) => handleInputChange(row.id, 'price', e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, row.id)}
                    />
                  </div>
                  <div>
                    <Button 
                      onClick={() => handleAddItem(row.id)}
                      disabled={!isRowComplete(row)}
                      className={`w-full ${
                        isRowComplete(row) 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              💡 <strong>Tips:</strong> Isi semua kolom terus Enter, atau tombol + buat nambahin!
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      {state.items.length > 0 && (
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-purple-800">
              <span className="flex items-center gap-2">
                📋 Daftar Item ({state.items.length})
              </span>
              <span className="text-lg font-bold text-emerald-600">
                Total: {formatCurrency(getTotal())}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                  {editingItem?.id === item.id ? (
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="md:col-span-2"
                      />
                      <Input
                        type="number"
                        value={editingItem.quantity}
                        onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 1 })}
                        min="1"
                      />
                      <Input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                        step="1000"
                        min="0"
                      />
                      <div className="flex gap-2 md:col-span-4">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateItem(editingItem)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Simpan ✅
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(null)}
                        >
                          Batal ❌
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-lg">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.quantity}x {formatCurrency(item.price)} = <span className="font-semibold text-emerald-600">{formatCurrency(item.quantity * item.price)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(item)}
                          className="hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveItem(item.id)}
                          className="hover:bg-red-600"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {state.items.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg border-2 border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-emerald-800">
                    🧮 Total Keseluruhan:
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(getTotal())}
                  </span>
                </div>
                <p className="text-sm text-emerald-700 mt-2">
                  Udah ada {state.items.length} item! Gas lanjut next step 🚀
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}