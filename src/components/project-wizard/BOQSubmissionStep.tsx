
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
  // Mock BOQ data
  const mockBOQItems: BOQItem[] = [
    {
      id: '1',
      category: 'Equipment',
      description: 'Drip irrigation pipes',
      quantity: 1000,
      unit: 'meters',
      rate: 25,
      amount: 25000
    },
    {
      id: '2',
      category: 'Labor',
      description: 'Installation labor',
      quantity: 20,
      unit: 'days',
      rate: 500,
      amount: 10000
    },
    {
      id: '3',
      category: 'Equipment',
      description: 'Control valves',
      quantity: 10,
      unit: 'pieces',
      rate: 1200,
      amount: 12000
    }
  ];

  const totalAmount = mockBOQItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bill of Quantities (BOQ)</CardTitle>
          <CardDescription>Review project costs and submit for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBOQItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>₹{item.rate}</TableCell>
                    <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="flex justify-end">
              <Card className="w-64">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Cost:</span>
                    <span className="text-xl font-bold text-emerald-600">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
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
              <Button onClick={onSubmit} size="lg" className="px-8">
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
