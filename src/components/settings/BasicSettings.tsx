
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BasicSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false,
    autoSave: true,
    twoFactorAuth: false,
    passwordExpiry: 90,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Settings</h1>
        <p className="text-stone-600 mt-1">Manage your account preferences and security</p>
      </div>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          <TabsTrigger value="security">Account Security</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <div className="text-sm text-stone-600">Choose your preferred theme</div>
                </div>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <div className="text-sm text-stone-600">Receive notifications via email</div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <div className="text-sm text-stone-600">Receive push notifications in browser</div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto Save</Label>
                  <div className="text-sm text-stone-600">Automatically save changes</div>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <div className="text-sm text-stone-600">Add an extra layer of security to your account</div>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>

              <Separator />

              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Password Security</h5>
                <p className="text-sm text-blue-800 mb-3">
                  Your password will expire in {settings.passwordExpiry} days. Consider changing it regularly for better security.
                </p>
                <Button variant="outline" size="sm" className="text-blue-900 border-blue-200">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BasicSettings;
