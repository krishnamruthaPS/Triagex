import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import LocationPicker from "./LocationPicker";

interface EmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emergencyTypes = [
  "Accident",
  "Pediatrics",
  "Pregnancy in Labour",
  "Old Age",
  "Other"
];

const EmergencyModal: React.FC<EmergencyModalProps> = ({ open, onOpenChange }) => {
  const [type, setType] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [locationCoords, setLocationCoords] = React.useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [gettingLocation, setGettingLocation] = React.useState(false);
  const [patientName, setPatientName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("");

  const navigateToHospitalSelect = () => { window.location.href = '/nearest-hospital'; };

  const handleEmergencySubmit = async () => {
    // Basic validation
    if (!patientName || !age || !gender || !type || (type === "Accident" && !locationCoords)) {
      alert("Please fill all required fields and use your location for accident address.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5001/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patientName,
          age: age ? Number(age) : null,
          gender,
          additionalInfo: type === "Accident" && locationCoords ? `Accident Location: ${locationCoords.address}` : type,
          symptoms: [type],
          aiScore: null,
          aiInstructions: null
        })
      });
      if (!response.ok) throw new Error('Submission failed');
      const triageResp = await response.json().catch(()=> null);
      const triageRecord = triageResp && (triageResp.triage || triageResp);
      if (triageRecord && triageRecord._id) {
        sessionStorage.setItem('currentTriage', JSON.stringify({
          triageId: triageRecord._id,
          patient: { patientName, age, gender, additionalInfo: type === "Accident" && locationCoords ? `Accident Location: ${locationCoords.address}` : type, symptoms: [type] },
          aiScore: null,
          aiInstructions: null
        }));
      }
      onOpenChange(false);
      setTimeout(navigateToHospitalSelect, 500);
    } catch (err) {
      alert("Emergency submission failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2">
            <span><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3l-8.47-14.14a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span>
            EMERGENCY TRIAGE
          </DialogTitle>
          <DialogDescription>
            Complete this form immediately for emergency triage. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-semibold">Patient Name *</label>
            <Input value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Enter patient name" required />
          </div>
          <div className="space-y-2">
            <label className="font-semibold">Age *</label>
            <Input value={age} onChange={e => setAge(e.target.value)} type="number" placeholder="Enter age" required />
          </div>
          <div className="space-y-2">
            <label className="font-semibold">Gender *</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="font-semibold">Type of Emergency *</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {emergencyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {type === "Accident" && (
            <div className="space-y-2 bg-red-50 p-4 rounded-lg">
              <label className="font-semibold">Accident Location *</label>
              <div className="flex gap-2">
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Accident address will appear here" readOnly />
                <Button type="button" onClick={() => {
                  setGettingLocation(true);
                  navigator.geolocation.getCurrentPosition(
                    pos => {
                      const lat = pos.coords.latitude;
                      const lng = pos.coords.longitude;
                      const address = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
                      setLocation(address);
                      setLocationCoords({ lat, lng, address });
                      setGettingLocation(false);
                    },
                    err => {
                      alert("Could not get current location.");
                      setGettingLocation(false);
                    }
                  );
                }} disabled={gettingLocation} className="bg-blue-600 text-white">
                  {gettingLocation ? "Getting..." : "Use My Location"}
                </Button>
              </div>
              {location && <div className="text-xs text-gray-600 mt-1">Current location will be used for accident address.</div>}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={handleEmergencySubmit}>Select Hospital</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { EmergencyModal };
