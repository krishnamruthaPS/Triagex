import React from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Bed, Users, BarChart2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Hospital } from "@/types/patient";

interface HospitalHeaderProps {
  hospital: Hospital;
  totalPatients: number;
}

const HospitalHeader: React.FC<HospitalHeaderProps> = ({
  hospital,
  totalPatients,
}) => {
  const location = useLocation();
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Hospital Name and Status */}
          <div className="flex items-center space-x-3 pr-16">
            <Activity className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              {hospital.name}
            </h1>
            <Badge
              variant={hospital.status === "online" ? "default" : "destructive"}
              className="ml-2"
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  hospital.status === "online" ? "bg-success" : "bg-destructive"
                }`}
              />
              {hospital.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Beds and Incoming Patients moved to right */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Incoming:</span>
              <span className="font-semibold text-foreground">
                {totalPatients}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Bed className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Available Beds:</span>
              <span className="font-semibold text-foreground">
                {hospital.availableBeds}/{hospital.totalBeds}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
          {/* Patient Statistics Button at top right */}
          <Link
            to="/patient-statistics"
            className={`flex items-center px-6 py-2 rounded-lg font-medium text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              location.pathname === "/patient-statistics"
                ? "bg-primary text-white shadow"
                : "bg-muted text-muted-foreground hover:bg-primary/10"
            }`}
            style={{ marginRight: 0 }}
          >
            <BarChart2 className="w-5 h-5 mr-2" />
            Patient Statistics
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HospitalHeader;
