import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import CriticalityDoughnutChart from "./CriticalityDoughnutChart";
import { EmergencyModal } from "./EmergencyModal";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Activity, Stethoscope, FileText } from 'lucide-react';

interface PatientData {
  patientName: string;
  age: string;
  gender: string;
  heartRate: string;
  systolicBP: string;
  diastolicBP: string;
  temperature: string;
  oxygenSaturation: string;
  symptoms: string[];
  additionalInfo: string;
}

interface TriageFormProps {
  onSubmit?: (data: PatientData) => void;
}

const symptoms = [
  'Chest Pain',
  'Dizziness',
  'Trauma',
  'Fever',
  'Unconsciousness',
  'Difficulty Breathing',
  'Severe Bleeding',
  'Nausea/Vomiting',
  'Abdominal Pain',
  'Headache',
  'Confusion',
  'Seizures'
];

const TriageForm: React.FC<TriageFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PatientData>({
    patientName: '',
    age: '',
    gender: '',
    heartRate: '',
    systolicBP: '',
    diastolicBP: '',
    temperature: '',
    oxygenSaturation: '',
    symptoms: [],
    additionalInfo: ''
  });
  const { toast } = useToast();
  const [instructions, setInstructions] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [criticalityScore, setCriticalityScore] = useState<number>(4);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      symptoms: checked
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.patientName || !formData.age || !formData.gender) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in patient name, age, and gender.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    setInstructions("");
    setHasPredicted(false);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockScore = Math.floor(Math.random() * 10) + 1;
      const mockInstructions = `Based on the assessment, the patient shows ${mockScore >= 7 ? 'high' : mockScore >= 4 ? 'moderate' : 'low'} priority symptoms. Recommend ${mockScore >= 7 ? 'immediate medical attention' : mockScore >= 4 ? 'prompt evaluation' : 'standard triage protocol'}.`;
      setCriticalityScore(mockScore);
      setInstructions(mockInstructions);
      setHasPredicted(true);
      toast({
        title: "Assessment Complete",
        description: `Criticality score: ${mockScore}/10`,
      });
    } catch (err) {
      setCriticalityScore(-1);
      setHasPredicted(true);
      toast({
        title: "Assessment Failed",
        description: "Could not complete triage assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
    onSubmit?.(formData);
  };

  const handleLogout = () => {
    // Mock logout - replace with actual logout logic
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <>
      <EmergencyModal open={isEmergencyOpen} onOpenChange={setIsEmergencyOpen} />
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Stethoscope className="h-6 w-6" />
              Emergency Triage Assessment
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsEmergencyOpen(true)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle mr-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3l-8.47-14.14a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                Emergency
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Patient Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName" className="text-sm font-medium">
                    Patient Name *
                  </Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    placeholder="Enter patient name"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">
                    Age *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Age in years"
                    min="0"
                    max="150"
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    Gender *
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Vital Signs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Vital Signs</h3>
              </div>
              <div className="p-4 bg-background-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Heart Rate (bpm)</Label>
                    <Select value={formData.heartRate} onValueChange={val => handleInputChange('heartRate', val)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low (&lt;60)</SelectItem>
                        <SelectItem value="Normal">Normal (60-100)</SelectItem>
                        <SelectItem value="High">High (&gt;100)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Blood Pressure (mmHg)</Label>
                    <Select value={formData.systolicBP} onValueChange={val => handleInputChange('systolicBP', val)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low (&lt;90/60)</SelectItem>
                        <SelectItem value="Normal">Normal (90-120/60-80)</SelectItem>
                        <SelectItem value="High">High (&gt;140/90)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Temperature (°C)</Label>
                    <Select value={formData.temperature} onValueChange={val => handleInputChange('temperature', val)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low (&lt;36.0)</SelectItem>
                        <SelectItem value="Normal">Normal (36.0-37.5)</SelectItem>
                        <SelectItem value="High">High (&gt;37.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Oxygen Saturation (%)</Label>
                    <Select value={formData.oxygenSaturation} onValueChange={val => handleInputChange('oxygenSaturation', val)}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low (&lt;95)</SelectItem>
                        <SelectItem value="Normal">Normal (95-100)</SelectItem>
                        <SelectItem value="High">High (&gt;100)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            {/* Symptoms */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Symptoms (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 bg-background-50 rounded-lg">
                {symptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={formData.symptoms.includes(symptom)}
                      onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                    />
                    <Label
                      htmlFor={symptom}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {/* Criticality Score Chart - only visible after prediction */}
            {hasPredicted && (
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-xl font-bold text-foreground">Criticality Score</h3>
                <div className="w-32 h-32 flex items-center justify-center border-2 border-border rounded-lg bg-card">
                  {loading ? (
                    <span className="text-primary font-semibold">Evaluating...</span>
                  ) : (
                    <CriticalityDoughnutChart score={criticalityScore} />
                  )}
                </div>
              </div>
            )}
            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <Label htmlFor="additionalInfo" className="text-lg font-semibold">
                  Additional Information
                </Label>
              </div>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                className="min-h-[100px] resize-none"
                placeholder="Enter any additional information about the patient's condition..."
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                disabled={loading}
              >
                {loading ? "Evaluating..." : "Evaluate Triage"}
              </Button>
            </div>
            {/* Gemini Instructions */}
            {instructions && (
              <div className="p-4 bg-accent rounded-lg border border-border">
                <h4 className="text-lg font-bold mb-2 text-accent-foreground">Assessment Recommendations</h4>
                <p className="text-sm text-accent-foreground whitespace-pre-wrap">{instructions}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default TriageForm;
