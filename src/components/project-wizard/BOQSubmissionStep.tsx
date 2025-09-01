
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Send } from 'lucide-react';
import { BOQItem } from '@/types/project-wizard';

interface BOQSubmissionStepProps {
  data: {
    boqItems: BOQItem[];
    comments?: string;
  };
  onUpdate: (data: Partial<{ boqItems: BOQItem[]; comments: string }>) => void;
  onSubmit: () => void;
}

const BOQSubmissionStep: React.FC<BOQSubmissionStepProps> = ({ data, onUpdate, onSubmit }) => {
  const [editIdx, setEditIdx] = React.useState<string | null>(null);
  const [newItem, setNewItem] = React.useState<BOQItem | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const totalAmount = data.boqItems.reduce((sum, item) => sum + item.amount, 0);
  const groupedItems = data.boqItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BOQItem[]>);

  // Inline edit handlers
  const handleEdit = (id: string) => setEditIdx(id);
  const handleEditChange = (id: string, field: keyof BOQItem, value: any) => {
    const updated = data.boqItems.map(item =>
      item.id === id ? { ...item, [field]: value, amount: field === 'quantity' || field === 'rate' ? (field === 'quantity' ? value * item.rate : item.quantity * value) : item.amount } : item
    );
    onUpdate({ boqItems: updated });
  };
  const handleEditSave = () => setEditIdx(null);
  const handleRemove = (id: string) => {
    onUpdate({ boqItems: data.boqItems.filter(item => item.id !== id) });
  };
  // Add new item
  const handleAddNew = () => {
    setNewItem({ id: Date.now().toString(), category: '', description: '', quantity: 1, unit: '', rate: 0, amount: 0 });
    setError(null);
  };
  const handleNewItemChange = (field: keyof BOQItem, value: any) => {
    if (!newItem) return;
    let updated = { ...newItem, [field]: value };
    if (field === 'quantity' || field === 'rate') {
      updated.amount = (field === 'quantity' ? value : updated.quantity) * (field === 'rate' ? value : updated.rate);
    }
    setNewItem(updated);
  };
  const handleNewItemSave = () => {
    if (!newItem) return;
    if (!newItem.category || !newItem.description || !newItem.unit || newItem.quantity <= 0 || newItem.rate < 0) {
      setError('All fields are required and must be valid.');
      return;
    }
    onUpdate({ boqItems: [...data.boqItems, newItem] });
    setNewItem(null);
    setError(null);
  };
  // Export (UI only)
  const handleExport = (type: 'pdf' | 'excel') => {
    alert(`Export as ${type.toUpperCase()} coming soon!`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bill of Quantities (BOQ)</CardTitle>
          <CardDescription>Review, edit, and submit project costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-2 justify-end mb-2">
              <Button variant="outline" onClick={() => handleExport('pdf')}>Export PDF</Button>
              <Button variant="outline" onClick={() => handleExport('excel')}>Export Excel</Button>
            </div>
            {data.boqItems.length > 0 ? (
              <>
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-lg font-semibold capitalize bg-stone-100 px-3 py-2 rounded">
                      {category}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Rate (TSh)</TableHead>
                          <TableHead>Amount (TSh)</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            {editIdx === item.id ? (
                              <>
                                <TableCell>
                                  <input
                                    className="border rounded px-2 py-1 w-full"
                                    value={item.description}
                                    onChange={e => handleEditChange(item.id, 'description', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    min={0}
                                    className="border rounded px-2 py-1 w-20"
                                    value={item.quantity}
                                    onChange={e => handleEditChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    className="border rounded px-2 py-1 w-20"
                                    value={item.unit}
                                    onChange={e => handleEditChange(item.id, 'unit', e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    min={0}
                                    className="border rounded px-2 py-1 w-24"
                                    value={item.rate}
                                    onChange={e => handleEditChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                  />
                                </TableCell>
                                <TableCell>{item.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Button size="sm" onClick={handleEditSave}>Save</Button>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.rate.toLocaleString()}</TableCell>
                                <TableCell>{item.amount.toLocaleString()}</TableCell>
                                <TableCell className="flex gap-1">
                                  <Button size="sm" variant="outline" onClick={() => handleEdit(item.id)}>Edit</Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleRemove(item.id)}>Remove</Button>
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                        <TableRow className="bg-stone-50">
                          <TableCell colSpan={4} className="font-medium">
                            {category} Subtotal:
                          </TableCell>
                          <TableCell className="font-medium">
                            TSh {items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
                <div className="flex justify-end mt-4">
                  <Card className="w-64">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Project Cost:</span>
                        <span className="text-xl font-bold text-emerald-600">
                          TSh {totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-stone-500">
                <p>No BOQ items have been added. Use the button below to add work items.</p>
              </div>
            )}
            {/* Add new item row */}
            {newItem ? (
              <div className="flex flex-col gap-2 border p-4 rounded bg-stone-50">
                <div className="flex gap-2">
                  <input className="border rounded px-2 py-1 w-32" placeholder="Category" value={newItem.category} onChange={e => handleNewItemChange('category', e.target.value)} />
                  <input className="border rounded px-2 py-1 flex-1" placeholder="Description" value={newItem.description} onChange={e => handleNewItemChange('description', e.target.value)} />
                  <input className="border rounded px-2 py-1 w-20" placeholder="Unit" value={newItem.unit} onChange={e => handleNewItemChange('unit', e.target.value)} />
                  <input className="border rounded px-2 py-1 w-20" type="number" min={0} placeholder="Qty" value={newItem.quantity} onChange={e => handleNewItemChange('quantity', parseFloat(e.target.value) || 0)} />
                  <input className="border rounded px-2 py-1 w-24" type="number" min={0} placeholder="Rate" value={newItem.rate} onChange={e => handleNewItemChange('rate', parseFloat(e.target.value) || 0)} />
                  <span className="w-28 text-right font-medium">{newItem.amount.toLocaleString()}</span>
                  <Button size="sm" onClick={handleNewItemSave}>Add</Button>
                  <Button size="sm" variant="destructive" onClick={() => setNewItem(null)}>Cancel</Button>
                </div>
                {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
              </div>
            ) : (
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleAddNew}>+ Add BOQ Item</Button>
              </div>
            )}
            <div className="space-y-2 mt-4">
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Textarea
                id="comments"
                value={data.comments || ''}
                onChange={(e) => onUpdate({ comments: e.target.value })}
                placeholder="Add any additional comments or notes..."
                rows={4}
              />
            </div>
            <div className="flex justify-center pt-6">
              <Button 
                onClick={onSubmit} 
                size="lg" 
                className="px-8"
                disabled={data.boqItems.length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Project for Approval
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BOQSubmissionStep;
