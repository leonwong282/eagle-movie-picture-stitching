/**
 * Forms Demo
 *
 * Showcases form controls:
 * - Input with various states
 * - Select dropdown
 * - Checkbox
 * - Slider with value display
 * - Form validation patterns
 */
import { useState } from 'react';
import { Settings, Sliders, CheckSquare, Type } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Slider,
  Button,
} from '@/components';

export function FormsDemo() {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [qualityValue, setQualityValue] = useState([80]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission handled here
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Text Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5 text-primary" />
            Text Input
          </CardTitle>
          <CardDescription>Input variants and states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-input">Default Input</Label>
            <Input
              id="default-input"
              placeholder="Enter text..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-input">Disabled Input</Label>
            <Input id="disabled-input" placeholder="Cannot edit..." disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="error-input">With Error</Label>
            <Input
              id="error-input"
              placeholder="Invalid input"
              className="border-destructive focus:ring-destructive"
            />
            <p className="text-xs text-destructive">This field is required</p>
          </div>
        </CardContent>
      </Card>

      {/* Select Dropdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-chart-2" />
            Select Dropdown
          </CardTitle>
          <CardDescription>Radix UI Select with custom styling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger>
                <SelectValue placeholder="Choose format..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG - Lossless</SelectItem>
                <SelectItem value="jpg">JPG - Compressed</SelectItem>
                <SelectItem value="webp">WebP - Modern</SelectItem>
                <SelectItem value="avif">AVIF - Best Compression</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Disabled Select</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Cannot select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option">Option</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectValue && (
            <p className="text-sm text-muted-foreground">
              Selected:{' '}
              <span className="font-medium text-foreground">{selectValue.toUpperCase()}</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Checkbox */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-success" />
            Checkbox
          </CardTitle>
          <CardDescription>Toggle options with checkboxes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="auto-preview"
              checked={checkboxChecked}
              onCheckedChange={(checked) => setCheckboxChecked(checked as boolean)}
            />
            <Label htmlFor="auto-preview">Enable auto-preview</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="notifications" defaultChecked />
            <Label htmlFor="notifications">Show notifications</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="disabled-checkbox" disabled />
            <Label htmlFor="disabled-checkbox" className="text-muted-foreground">
              Disabled option
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="disabled-checked" disabled defaultChecked />
            <Label htmlFor="disabled-checked" className="text-muted-foreground">
              Disabled checked
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Sliders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-chart-4" />
            Sliders
          </CardTitle>
          <CardDescription>Range controls with value display</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Crop Amount</Label>
              <span className="text-sm font-medium">{sliderValue[0]}%</span>
            </div>
            <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Quality</Label>
              <span className="text-sm font-medium">{qualityValue[0]}%</span>
            </div>
            <Slider
              value={qualityValue}
              onValueChange={setQualityValue}
              max={100}
              min={10}
              step={5}
            />
          </div>
          <div className="space-y-3">
            <Label className="text-muted-foreground">Disabled Slider</Label>
            <Slider defaultValue={[30]} max={100} step={1} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Complete Form Example */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Complete Form Example</CardTitle>
          <CardDescription>Combining all form controls into a cohesive form</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" placeholder="My Awesome Plugin" />
              </div>
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Output Quality</Label>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Slider defaultValue={[85]} max={100} min={10} step={5} />
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="preserve-metadata" defaultChecked />
                <Label htmlFor="preserve-metadata">Preserve metadata</Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="optimize-size" />
                <Label htmlFor="optimize-size">Optimize file size</Label>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end">
              <Button type="button" variant="outline">
                Reset
              </Button>
              <Button type="submit" variant="primary">
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FormsDemo;
