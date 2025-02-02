"use client";
import { cn } from "~/lib/utils";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BentoGrid, BentoGridItem } from "~/components/ui/bento-grid";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [makeCall, setMakeCall] = useState(false);
  const [slug, setSlug] = useState("");

  // Retrieve slug from params.
  useEffect(() => {
    params.then((data) => setSlug(data.slug));
  }, [params]);

  // Handle API call in useEffect when makeCall becomes true.
  useEffect(() => {
    if (makeCall) {
      const dummy_values = {
        id: 1,
        patient_id: 1,
        call_datetime: "2023-10-05 10:00:00",
        follow_up_topics:
          "Nephew's piano concert, back pain, medication refills",
        prescription_ids: "1,2,3",
        first_name: "John",
        last_name: "Doe",
        phone_number: "+16155856532",
        caregivers: "Jane Doe",
        prescription_name: "Aspirin",
        medication_status: "On Track",
      };
      axios
        .post("http://localhost:8000", dummy_values, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          console.log("Call made:", response.data);
        })
        .catch((error) => {
          console.error("Error making call:", error);
        })
        .finally(() => {
          setMakeCall(false);
        });
    }
  }, [makeCall]);

  const handleMakeCall = () => {
    setMakeCall(true);
  };

  const items = [
    // Patient/User Info
    {
      title: "Patient Info",
      description: "Registered user details",
      header: null,
      children: (
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
              J
            </div>
            <div>
              <div className="font-bold">John Doe</div>
              <div className="text-sm text-gray-600">john.doe@example.com</div>
              <div className="text-sm text-gray-600">123-456-7890</div>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleMakeCall}>Make a Call</Button>
          </div>
        </div>
      ),
      className: "md:col-span-1",
    },
    // Schedules
    {
      title: "Schedules",
      description: "Upcoming appointments",
      header: (
        <div className="flex items-center justify-between p-4">
          <span className="font-bold">Schedules</span>
          <Button>Add New Schedule</Button>
        </div>
      ),
      children: (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Event</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2025-02-01</TableCell>
              <TableCell>10:00 AM</TableCell>
              <TableCell>Doctor Appointment</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-02-03</TableCell>
              <TableCell>02:00 PM</TableCell>
              <TableCell>Therapy Session</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      className: "md:col-span-2",
    },
    // Call Logs
    {
      title: "Call Logs",
      description: "Recent call history",
      header: (
        <div className="p-4">
          <span className="font-bold">Call Logs</span>
        </div>
      ),
      children: (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>2025-01-30</TableCell>
              <TableCell>5 mins</TableCell>
              <TableCell>Jane Doe</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2025-01-28</TableCell>
              <TableCell>10 mins</TableCell>
              <TableCell>Dr. Smith</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      className: "md:col-span-1",
    },
    // Medications & Prescriptions
    {
      title: "Medications & Prescriptions",
      description: "Current medications and prescriptions",
      header: (
        <div className="flex items-center justify-between p-4">
          <span className="font-bold">Medications & Prescriptions</span>
          <Button>Add Prescription</Button>
        </div>
      ),
      children: (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Lisinopril</TableCell>
              <TableCell>10mg</TableCell>
              <TableCell>Once Daily</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Metformin</TableCell>
              <TableCell>500mg</TableCell>
              <TableCell>Twice Daily</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      className: "md:col-span-2",
    },
  ];

  function BentoGridDemo() {
    return (
      <BentoGrid className="mx-auto grid max-w-7xl auto-rows-[20rem] grid-cols-2 gap-4">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
          >
            {item.children}
          </BentoGridItem>
        ))}
      </BentoGrid>
    );
  }

  return (
    <div className={cn("space-y-8 p-4")}>
      {/* <h1 className="text-center text-3xl font-bold">{slug}</h1> */}
      <BentoGridDemo />
    </div>
  );
}
