
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Calculator, Download, FileText } from 'lucide-react';
import { Zone } from '@/types/gis';

interface BOQItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface BOQGenerationPanelProps {
  zones: Zone[];
  onExport: () => void;
}

const BOQGenerationPanel: React.FC<BOQGenerationPanelProps> = ({ zones, onExport }) => {
  const [boqItems, setBOQItems] = useState<BOQItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    generateBOQ();
  }, [zones]);

  const generateBOQ = () => {
    const totalArea = zones.reduce((acc, zone) => {
      const area = parseFloat(zone.area.split(' ')[0]) || 0;
      return acc + area;
    }, 0);

    const mockBOQ: BOQItem[] = [
      {
        id: '1',
        category: 'Earth Work',
        description: 'Excavation for main canal',
        quantity: Math.round(totalArea * 0.5),
        unit: 'cum',
        rate: 150,
        amount: 0
      },
      {
        id: '2',
        category: 'Materials',
        description: 'HDPE pipes (110mm)',
        quantity: Math.round(totalArea * 100),
        unit: 'meter',
        rate: 45,
        amount: 0
      },
      {
        id: '3',
        category: 'Materials',
        description: 'PVC pipes (75mm)',
        quantity: Math.round(totalArea * 150),
        unit: 'meter',
        rate: 32,
        amount: 0
      },
      {
        id: '4',
        category: 'Equipment',
        description: 'Drip emitters',
        quantity: Math.round(totalArea * 800),
        unit: 'nos',
        rate: 8,
        amount: 0
      },
      {
        id: '5',
        category: 'Labor',
        description: 'Installation and laying',
        quantity: Math.round(totalArea * 5),
        unit: 'days',
        rate: 500,
        amount: 0
      },
      {
        id: '6',
        category: 'Equipment',
        description: 'Control valves',
        quantity: zones.length * 2,
        unit: 'nos',
        rate: 1200,
        amount: 0
      }
    ];

    // Calculate amounts
    const updatedBOQ = mockBOQ.map(item => ({
      ...item,
      amount: item.quantity * item.rate
    }));

    setBOQItems(updatedBOQ);
    setTotalCost(updatedBOQ.reduce((sum, item) => sum + item.amount, 0));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Earth Work': return 'bg-amber-50 text-amber-700';
      case 'Materials': return 'bg-blue-50 text-blue-700';
      case 'Equipment': return 'bg-green-50 text-green-700';
      case 'Labor': return 'bg-purple-50 text-purple-700';
      default: return 'bg-stone-50 text-stone-700';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">BOQ Generation</CardTitle>
          </div>
          <CardDescription>Cost analysis for irrigation scheme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-emerald-800">Total Project Cost</h4>
                <p className="text-sm text-emerald-600">Based on {zones.length} zones</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-800">
                  ₹{totalCost.toLocaleString()}
                </div>
                <div className="text-sm text-emerald-600">
                  ₹{Math.round(totalCost / zones.reduce((acc, zone) => acc + parseFloat(zone.area.split(' ')[0]) || 0, 0))}/ha
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Bill of Quantities</h4>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-16">Qty</TableHead>
                    <TableHead className="w-16">Unit</TableHead>
                    <TableHead className="w-20">Rate</TableHead>
                    <TableHead className="w-24">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boqItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{item.description}</TableCell>
                      <TableCell className="text-sm">{item.quantity}</TableCell>
                      <TableCell className="text-sm">{item.unit}</TableCell>
                      <TableCell className="text-sm">₹{item.rate}</TableCell>
                      <TableCell className="text-sm font-medium">₹{item.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={onExport} className="flex-1" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export BOQ
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Earth Work', 'Materials', 'Equipment', 'Labor'].map(category => {
              const categoryTotal = boqItems
                .filter(item => item.category === category)
                .reduce((sum, item) => sum + item.amount, 0);
              const percentage = ((categoryTotal / totalCost) * 100).toFixed(1);
              
              return (
                <div key={category} className="flex justify-between items-center p-2 bg-stone-50 rounded">
                  <span className="text-sm font-medium">{category}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">₹{categoryTotal.toLocaleString()}</div>
                    <div className="text-xs text-stone-500">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BOQGenerationPanel;
