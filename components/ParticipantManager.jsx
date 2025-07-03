'use client';

import { useState } from 'react';
import { useBill } from '@/context/BillContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, UserMinus, User } from 'lucide-react';

export default function ParticipantManager() {
  const { state, dispatch, actions } = useBill();
  const [newParticipantName, setNewParticipantName] = useState('');

  const handleAddParticipant = () => {
    if (newParticipantName.trim()) {
      dispatch({
        type: actions.ADD_PARTICIPANT,
        payload: newParticipantName.trim()
      });
      setNewParticipantName('');
    }
  };

  const handleRemoveParticipant = (participantId) => {
    dispatch({
      type: actions.REMOVE_PARTICIPANT,
      payload: participantId
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddParticipant();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Users className="h-5 w-5" />
            Yang Ikut Bayar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nama orang"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleAddParticipant}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!newParticipantName.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambahin
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
             Tambahin aja semua orang yang bakal patungan bayar 👥
            </div>
          </div>
        </CardContent>
      </Card>

      {state.participants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <User className="h-5 w-5" />
              Daftar Peserta ({state.participants.length} orang)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {state.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{participant.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveParticipant(participant.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {state.participants.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lah belum ada yang bayar 😅</h3>
            <p className="text-gray-600 max-w-sm">
              Tambahin dulu list di atas. Nanti bisa ditambah lagi kalau ada yang ketinggalan!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}