
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
  const totalAmount = data.boqItems.reduce((sum, item) => sum + item.amount, 0);

  const groupedItems = data.boqItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BOQItem[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bill of Quantities (BOQ)</CardTitle>
          <CardDescription>Review project costs and submit for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.rate.toLocaleString()}</TableCell>
                            <TableCell>{item.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-stone-50">
                          <TableCell colSpan={4} className="font-medium">
                            {category} Subtotal:
                          </TableCell>
                          <TableCell className="font-medium">
                            TSh {items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ))}
                
                <div className="flex justify-end">
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
                <p>No resources have been selected. Please go back to the Resources & Materials step to add project requirements.</p>
              </div>
            )}
            
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
