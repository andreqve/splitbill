'use client';

import { useState } from 'react';
import { useBill } from '@/context/BillContext';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, Copy, DollarSign, Receipt, CheckCircle, Minus } from 'lucide-react';

export default function FinalSummary() {
  const { state, dispatch, actions, getSubtotal, getTaxAmount, getTipAmount, getDiscountAmount, getTotal, getParticipantSummary } = useBill();
  const [taxInput, setTaxInput] = useState({ amount: state.tax.amount, isPercentage: state.tax.isPercentage });
  const [tipInput, setTipInput] = useState({ amount: state.tip.amount, isPercentage: state.tip.isPercentage });
  const [discountInput, setDiscountInput] = useState({ amount: state.discount.amount, isPercentage: state.discount.isPercentage });
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleTaxChange = (amount, isPercentage) => {
    const newTax = { amount: parseFloat(amount) || 0, isPercentage };
    setTaxInput(newTax);
    dispatch({ type: actions.SET_TAX, payload: newTax });
  };

  const handleTipChange = (amount, isPercentage) => {
    const newTip = { amount: parseFloat(amount) || 0, isPercentage };
    setTipInput(newTip);
    dispatch({ type: actions.SET_TIP, payload: newTip });
  };

  const handleDiscountChange = (amount, isPercentage) => {
    const newDiscount = { amount: parseFloat(amount) || 0, isPercentage };
    setDiscountInput(newDiscount);
    dispatch({ type: actions.SET_DISCOUNT, payload: newDiscount });
  };

  const copyToClipboard = async (participantId, index) => {
    const participant = state.participants.find(p => p.id === participantId);
    const summary = getParticipantSummary(participantId);
    
    const text = `
📋 ${state.billName || 'Pembagian Tagihan'} - ${participant.name}

📝 Item yang kamu bayar:
${summary.assignedItems.map(item => `• ${item.name} (${item.quantity}x): ${formatCurrency(item.share)}`).join('\n')}

💰 Ringkasan:
Subtotal: ${formatCurrency(summary.subtotal)}
Pajak: ${formatCurrency(summary.taxShare)}
Tip: ${formatCurrency(summary.tipShare)}
Diskon: -${formatCurrency(summary.discountShare)}
━━━━━━━━━━━━━━━━━━━━
Total yang harus dibayar: ${formatCurrency(summary.grandTotal)}

Jangan lupa bayar ya! 😊
`.trim();

    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const tipAmount = getTipAmount();
  const discountAmount = getDiscountAmount();
  const total = getTotal();

  return (
    <div className="space-y-6">
      {/* Tax and Tip Section */}
      <Card className="border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Calculator className="h-5 w-5" />
            Tambahan Biaya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tax Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Pajak (kalau ada)</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rp</span>
                <Switch
                  checked={taxInput.isPercentage}
                  onCheckedChange={(checked) => handleTaxChange(taxInput.amount, checked)}
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step={taxInput.isPercentage ? "0.1" : "1000"}
                min="0"
                value={taxInput.amount}
                onChange={(e) => handleTaxChange(e.target.value, taxInput.isPercentage)}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-24">
                = {formatCurrency(taxAmount)}
              </span>
            </div>
          </div>

          {/* Tip Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Tip (kalau ada)</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rp</span>
                <Switch
                  checked={tipInput.isPercentage}
                  onCheckedChange={(checked) => handleTipChange(tipInput.amount, checked)}
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step={tipInput.isPercentage ? "0.1" : "1000"}
                min="0"
                value={tipInput.amount}
                onChange={(e) => handleTipChange(e.target.value, tipInput.isPercentage)}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-24">
                = {formatCurrency(tipAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discount Section */}
      <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Minus className="h-5 w-5" />
            Pengurangan Biaya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Discount Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Gratis Ongkir / Voucher Promo</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rp</span>
                <Switch
                  checked={discountInput.isPercentage}
                  onCheckedChange={(checked) => handleDiscountChange(discountInput.amount, checked)}
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step={discountInput.isPercentage ? "0.1" : "1000"}
                min="0"
                value={discountInput.amount}
                onChange={(e) => handleDiscountChange(e.target.value, discountInput.isPercentage)}
                className="flex-1"
                placeholder="Masukkan nilai diskon"
              />
              <span className="text-sm text-gray-600 w-24">
                = -{formatCurrency(discountAmount)}
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            💡 <strong>Tips:</strong> Masukin nilai gratis ongkir atau voucher diskon yang dipake!
          </div>
        </CardContent>
      </Card>

      {/* Bill Summary */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Receipt className="h-5 w-5" />
            Total Semua
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pajak:</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tip:</span>
              <span>{formatCurrency(tipAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Diskon:</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Summaries */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Rincian per Orang
        </h3>
        
        {state.participants.map((participant, index) => {
          const summary = getParticipantSummary(participant.id);
          
          return (
            <Card key={participant.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <CardTitle className="text-lg">{participant.name}</CardTitle>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => copyToClipboard(participant.id, index)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {copiedIndex === index ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Udah disalin!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Salin
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {summary.assignedItems.length > 0 ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Yang kamu bayar:</h4>
                      {summary.assignedItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                          <span>{item.name} ({item.quantity}x)</span>
                          <span>{formatCurrency(item.share)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(summary.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pajak:</span>
                        <span>{formatCurrency(summary.taxShare)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tip:</span>
                        <span>{formatCurrency(summary.tipShare)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Diskon:</span>
                        <span>-{formatCurrency(summary.discountShare)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold text-indigo-600">
                        <span>Total kamu:</span>
                        <span>{formatCurrency(summary.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Wah, {participant.name} ga bayar apa-apa nih! Beruntung banget 😄</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}