// /components/ItemAssigner.jsx

'use client';

import { useBill } from '@/context/BillContext';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, CheckSquare, Square, AlertCircle } from 'lucide-react';

export default function ItemAssigner() {
  const { state, dispatch, actions } = useBill();

  const handleAssignmentChange = (itemId, participantId, isChecked) => {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;

    const currentAssignments = item.assignedTo || [];
    let newAssignments;

    if (isChecked) {
      if (currentAssignments.length >= item.quantity) {
        return; // Prevents assigning more than quantity allows
      }
      newAssignments = [...currentAssignments, participantId];
    } else {
      newAssignments = currentAssignments.filter(id => id !== participantId);
    }

    dispatch({
      type: actions.ASSIGN_ITEM,
      payload: { itemId, participantIds: newAssignments },
    });
  };

  const handleSelectAll = (itemId) => {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;

    const allParticipantIds = state.participants.map(p => p.id);
    const maxAssignments = Math.min(item.quantity, allParticipantIds.length);
    const currentlyAssigned = item.assignedTo || [];

    const newAssignments = currentlyAssigned.length === maxAssignments
      ? [] // If all are selected, deselect all
      : allParticipantIds.slice(0, maxAssignments); // Otherwise, select up to the max limit

    dispatch({
      type: actions.ASSIGN_ITEM,
      payload: { itemId, participantIds: newAssignments },
    });
  };

  const getAssignedCount = (item) => item?.assignedTo?.length || 0;

  const getItemSharePrice = (item) => {
    const assignedCount = getAssignedCount(item);
    if (!item || assignedCount === 0) return 0;
    return (item.price * item.quantity) / assignedCount;
  };

  if (state.items.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckSquare className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Makanannya mana? 🤔</h3>
          <p className="text-gray-600 max-w-sm">Balik ke Step 1 dulu, tambahin item yang mau dibagi-bagi.</p>
        </CardContent>
      </Card>
    );
  }

  if (state.participants.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Gak ada yang makan? 😂</h3>
          <p className="text-gray-600 max-w-sm">Balik ke Step 2 dulu, tambahin yang mau ikut makan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <CheckSquare className="h-5 w-5" /> Siapa Makan Apa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Centang siapa aja yang makan item tertentu. Nanti biayanya dibagi rata sama yang makan! 🍽️</p>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>Perhatian:</strong> Jumlah orang yang bisa dipilih dibatasi sesuai quantity item. Misal: Nasi Goreng qty 1 = maksimal 1 orang yang bisa dipilih.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {state.items.map((item) => {
          const assignedCount = getAssignedCount(item);
          const maxAssignments = Math.min(item.quantity, state.participants.length);
          const canAssignMore = assignedCount < item.quantity;

          return (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.quantity}x {formatCurrency(item.price)} = {formatCurrency(item.quantity * item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={assignedCount === item.quantity ? "default" : "secondary"} className="mb-2">
                      {assignedCount} / {maxAssignments} orang makan
                    </Badge>
                    {assignedCount > 0 && (
                      <p className="text-sm text-green-600 font-medium">{formatCurrency(getItemSharePrice(item))} per orang</p>
                    )}
                    {!canAssignMore && (
                      <p className="text-xs text-orange-600 font-medium mt-1">✅ Kuota penuh!</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button size="sm" variant="outline" onClick={() => handleSelectAll(item.id)} className="flex items-center gap-2">
                    {assignedCount === maxAssignments ? <><Square className="h-4 w-4" /> Batal Semua</> : <><CheckSquare className="h-4 w-4" /> Pilih Semua ({maxAssignments})</>}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {state.participants.map((participant) => {
                    const isAssigned = item.assignedTo?.includes(participant.id);
                    const isDisabled = !isAssigned && !canAssignMore;
                    return (
                      <label
                        key={`${item.id}-${participant.id}`}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          isDisabled ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                          : isAssigned ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 cursor-pointer'
                          : 'border-gray-100 bg-white hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <Checkbox
                          checked={isAssigned}
                          disabled={isDisabled}
                          onCheckedChange={(checked) => handleAssignmentChange(item.id, participant.id, checked)}
                          className="data-[state=checked]:bg-emerald-600"
                        />
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br ${
                            isAssigned ? 'from-emerald-500 to-green-500' : 'from-gray-400 to-gray-500'
                          }`}>
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`font-medium ${isAssigned ? 'text-emerald-900' : 'text-gray-700'}`}>
                            {participant.name}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}