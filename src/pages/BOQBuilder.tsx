
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Calculator, Download, Plus, Trash2 } from 'lucide-react';

const BOQBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [landSize, setLandSize] = useState('');
  const [irrigationType, setIrrigationType] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  
  const activities = [
    'Micro Irrigation System Installation',
    'Sprinkler System Setup',
    'Drip Irrigation Network',
    'Water Storage Tank Construction',
    'Pump House Construction'
  ];

  const irrigationTypes = [
    'Micro-drip',
    'Sprinkler',
    'Surface Drip',
    'Furrow',
    'Border Strip'
  ];

  const sampleResources = [
    {
      id: 1,
      name: 'PVC Pipe (4 inch)',
      unit: 'meter',
      rate: 120,
      quantity: 500,
      total: 60000
    },
    {
      id: 2,
      name: 'Drip Emitters',
      unit: 'piece',
      rate: 2.5,
      quantity: 2000,
      total: 5000
    },
    {
      id: 3,
      name: 'Filter Unit',
      unit: 'set',
      rate: 15000,
      quantity: 1,
      total: 15000
    },
    {
      id: 4,
      name: 'Labour Cost',
      unit: 'day',
      rate: 500,
      quantity: 30,
      total: 15000
    }
  ];

  const totalCost = sampleResources.reduce((sum, resource) => sum + resource.total, 0);
  const costPerHa = landSize ? Math.round(totalCost / parseFloat(landSize)) : 0;

  const steps = [
    { id: 1, title: 'Activity Selection', description: 'Choose irrigation activity' },
    { id: 2, title: 'Land Details', description: 'Enter area and specifications' },
    { id: 3, title: 'Resources', description: 'Add materials and labor' },
    { id: 4, title: 'Preview & Submit', description: 'Review BOQ and submit' }
  ];

  const addResource = () => {
    const newResource = {
      id: Date.now(),
      name: '',
      unit: 'piece',
      rate: 0,
      quantity: 0,
      total: 0
    };
    setResources([...resources, newResource]);
  };

  const removeResource = (id: number) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const updateResource = (id: number, field: string, value: any) => {
    setResources(resources.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        if (field === 'rate' || field === 'quantity') {
          updated.total = updated.rate * updated.quantity;
        }
        return updated;
      }
      return r;
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">BOQ Builder</h1>
          <p className="text-stone-600 mt-1">Build comprehensive Bill of Quantities for irrigation projects</p>
        </div>
        <Button variant="outline" className="border-emerald-200 text-emerald-700">
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Progress Steps */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Progress</CardTitle>
            <CardDescription>Step {currentStep} of 4</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                    currentStep === step.id
                      ? 'bg-emerald-100 border border-emerald-200'
                      : currentStep > step.id
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-stone-50 border border-stone-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === step.id
                        ? 'bg-emerald-600 text-white'
                        : currentStep > step.id
                        ? 'bg-green-600 text-white'
                        : 'bg-stone-300 text-stone-600'
                    }`}
                  >
                    {step.id}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-stone-800">
                      {step.title}
                    </div>
                    <div className="text-xs text-stone-600">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Activity Selection */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <CardTitle>Select Activity</CardTitle>
                </div>
                <CardDescription>Choose the main irrigation activity for this BOQ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="activity">Irrigation Activity</Label>
                  <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activities.map((activity) => (
                        <SelectItem key={activity} value={activity}>
                          {activity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedActivity && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-medium text-emerald-800 mb-2">Selected Activity</h4>
                    <p className="text-sm text-emerald-700">{selectedActivity}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Land Details */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Land Details</CardTitle>
                <CardDescription>Enter land area and irrigation specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landSize">Land Area (hectares)</Label>
                    <Input
                      id="landSize"
                      type="number"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      placeholder="e.g., 10.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="irrigationType">Irrigation Type</Label>
                    <Select value={irrigationType} onValueChange={setIrrigationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {irrigationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="cropType">Primary Crop</Label>
                  <Input id="cropType" placeholder="e.g., Wheat, Cotton, Vegetables" />
                </div>
                <div>
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input id="soilType" placeholder="e.g., Sandy, Clay, Loamy" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Resources */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resources & Materials</CardTitle>
                    <CardDescription>Add materials, equipment, and labor costs</CardDescription>
                  </div>
                  <Button size="sm" onClick={addResource} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Resource
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleResources.map((resource) => (
                    <div key={resource.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-stone-50 rounded-lg">
                      <div className="col-span-4">
                        <Input value={resource.name} readOnly className="text-sm" />
                      </div>
                      <div className="col-span-2">
                        <Input value={resource.unit} readOnly className="text-sm" />
                      </div>
                      <div className="col-span-2">
                        <Input value={resource.rate} readOnly className="text-sm" />
                      </div>
                      <div className="col-span-2">
                        <Input value={resource.quantity} readOnly className="text-sm" />
                      </div>
                      <div className="col-span-1">
                        <span className="text-sm font-medium">₹{resource.total.toLocaleString()}</span>
                      </div>
                      <div className="col-span-1">
                        <Button size="sm" variant="outline" className="p-1 h-8 w-8">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>BOQ Preview</CardTitle>
                <CardDescription>Review your Bill of Quantities before submission</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-stone-600">Activity:</span>
                      <div className="font-medium">{selectedActivity}</div>
                    </div>
                    <div>
                      <span className="text-stone-600">Land Area:</span>
                      <div className="font-medium">{landSize} hectares</div>
                    </div>
                    <div>
                      <span className="text-stone-600">Irrigation Type:</span>
                      <div className="font-medium">{irrigationType}</div>
                    </div>
                    <div>
                      <span className="text-stone-600">Total Resources:</span>
                      <div className="font-medium">{sampleResources.length} items</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-2">Cost Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Total Project Cost:</div>
                      <div className="font-bold">₹{totalCost.toLocaleString()}</div>
                      <div>Cost per Hectare:</div>
                      <div className="font-bold">₹{costPerHa.toLocaleString()}/ha</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-stone-200"
            >
              Previous
            </Button>
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
                Next Step
              </Button>
            ) : (
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Submit BOQ
              </Button>
            )}
          </div>
        </div>

        {/* Cost Summary Sidebar */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-lg">Cost Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-800">
                  ₹{totalCost.toLocaleString()}
                </div>
                <div className="text-sm text-emerald-600">Total Project Cost</div>
              </div>
              
              {landSize && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-800">
                    ₹{costPerHa.toLocaleString()}/ha
                  </div>
                  <div className="text-sm text-blue-600">Cost per Hectare</div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium text-stone-800">Resource Breakdown</h4>
                {sampleResources.map((resource) => (
                  <div key={resource.id} className="flex justify-between text-sm">
                    <span className="text-stone-600 truncate mr-2">{resource.name}</span>
                    <span className="font-medium">₹{resource.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BOQBuilder;
