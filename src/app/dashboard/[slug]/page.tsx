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
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useModal,
} from "~/components/ui/animated-modal";
import { DateTimePicker } from "~/components/date-picker";

// ----- New Form: Call Schedule Form -----
const AddCallScheduleForm = () => {
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [status, setStatus] = useState("active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledTime) return;
    const scheduleData = {
      scheduled_time: scheduledTime.toISOString(),
      status,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/call_schedules",
        scheduleData,
        { headers: { "Content-Type": "application/json" } },
      );
      console.log("Call schedule added:", response.data);
    } catch (error) {
      console.error("Error adding call schedule:", error);
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Scheduled Time</label>
          <DateTimePicker
            value={scheduledTime ?? undefined}
            onChange={setScheduledTime}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button type="submit">Submit Call Schedule</Button>
      </form>
    </div>
  );
};

// ----- New Form: Combined Medication & Schedule Form -----
// Updated to use a scrollable container and reduced spacing
const AddMedicationAndScheduleForm = () => {
  const [medFormData, setMedFormData] = useState({
    name: "",
    method: "",
    dosage: "",
    units: "",
    frequency: "",
    instructions: "",
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  const handleMedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMedFormData({ ...medFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !scheduledTime) return;
    setLoading(true);
    try {
      const medPayload = {
        name: medFormData.name,
        patient_id: 1, // demo value
        method: medFormData.method,
        dosage: parseFloat(medFormData.dosage),
        units: medFormData.units,
        frequency: parseInt(medFormData.frequency),
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : null,
        instructions: medFormData.instructions,
      };
      const medResponse = await axios.post(
        "http://localhost:8000/medications",
        medPayload,
        { headers: { "Content-Type": "application/json" } },
      );
      const prescriptionId = medResponse.data.id;
      const scheduleData = {
        prescription_id: prescriptionId,
        scheduled_time: scheduledTime.toISOString(),
        status,
      };
      const schedResponse = await axios.post(
        "http://localhost:8000/medication_schedules",
        scheduleData,
        { headers: { "Content-Type": "application/json" } },
      );
      console.log("Medication & schedule added:", {
        medication: medResponse.data,
        schedule: schedResponse.data,
      });
    } catch (error) {
      console.error("Error adding medication and schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-base font-bold">Medication Details</h3>
        <div>
          <label className="block text-sm font-medium">Medication Name</label>
          <input
            type="text"
            name="name"
            value={medFormData.name}
            onChange={handleMedChange}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Method</label>
          <input
            type="text"
            name="method"
            value={medFormData.method}
            onChange={handleMedChange}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium">Dosage</label>
            <input
              type="number"
              name="dosage"
              value={medFormData.dosage}
              onChange={handleMedChange}
              className="mt-1 block w-full rounded-md border p-2"
              required
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Units</label>
            <input
              type="text"
              name="units"
              value={medFormData.units}
              onChange={handleMedChange}
              className="mt-1 block w-full rounded-md border p-2"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Frequency (times per day)
          </label>
          <input
            type="number"
            name="frequency"
            value={medFormData.frequency}
            onChange={handleMedChange}
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Instructions</label>
          <textarea
            name="instructions"
            value={medFormData.instructions}
            onChange={handleMedChange}
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>
        <h3 className="text-base font-bold">Prescription Dates</h3>
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <DateTimePicker
            value={startDate ?? undefined}
            onChange={setStartDate}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <DateTimePicker value={endDate ?? undefined} onChange={setEndDate} />
        </div>
        {/*<h3 className="text-base font-bold">Schedule Details</h3>*/}
        {/*<div>*/}
        {/*  <label className="block text-sm font-medium">Scheduled Time</label>*/}
        {/*  <DateTimePicker*/}
        {/*    value={scheduledTime ?? undefined}*/}
        {/*    onChange={setScheduledTime}*/}
        {/*  />*/}
        {/*</div>*/}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Medication & Schedule"}
        </Button>
      </form>
    </div>
  );
};

function PageContent({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const { setOpen } = useModal();

  useEffect(() => {
    params.then((data) => setSlug(data.slug));
  }, [params]);

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setOpen(true);
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
            <Button
              onClick={() =>
                openModal(<div>Call Modal Content: form to make a call</div>)
              }
            >
              Make a Call
            </Button>
          </div>
        </div>
      ),
      className: "md:col-span-1",
    },
    // Call Schedule
    {
      title: "Call Schedule",
      description: "Configure call timing",
      header: (
        <div className="flex items-center justify-between p-4">
          <span className="font-bold">Call Schedule</span>
          <Button onClick={() => openModal(<AddCallScheduleForm />)}>
            Add New Schedule
          </Button>
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
            <TableRow
              onClick={() =>
                openModal(<div>Edit Call Schedule: Conference Call</div>)
              }
              className="cursor-pointer"
            >
              <TableCell>2025-02-01</TableCell>
              <TableCell>10:00 AM</TableCell>
              <TableCell>Conference Call</TableCell>
            </TableRow>
            <TableRow
              onClick={() =>
                openModal(<div>Edit Call Schedule: Client Call</div>)
              }
              className="cursor-pointer"
            >
              <TableCell>2025-02-03</TableCell>
              <TableCell>02:00 PM</TableCell>
              <TableCell>Client Call</TableCell>
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
            <TableRow
              onClick={() =>
                openModal(<div>Edit Call Log: Jane Doe, 5 mins</div>)
              }
              className="cursor-pointer"
            >
              <TableCell>2025-01-30</TableCell>
              <TableCell>5 mins</TableCell>
              <TableCell>Jane Doe</TableCell>
            </TableRow>
            <TableRow
              onClick={() =>
                openModal(<div>Edit Call Log: Dr. Smith, 10 mins</div>)
              }
              className="cursor-pointer"
            >
              <TableCell>2025-01-28</TableCell>
              <TableCell>10 mins</TableCell>
              <TableCell>Dr. Smith</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      className: "md:col-span-1",
    },
    // Medications & Prescriptions (Combined with Schedule)
    {
      title: "Medications & Prescriptions",
      description: "Current medications and schedule",
      header: (
        <div className="flex items-center justify-between p-4">
          <span className="font-bold">Medications & Prescriptions</span>
          <Button onClick={() => openModal(<AddMedicationAndScheduleForm />)}>
            Add Medication & Schedule
          </Button>
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
            <TableRow
              onClick={() => openModal(<div>Edit Medication: Lisinopril</div>)}
              className="cursor-pointer"
            >
              <TableCell>Lisinopril</TableCell>
              <TableCell>10mg</TableCell>
              <TableCell>Once Daily</TableCell>
            </TableRow>
            <TableRow
              onClick={() => openModal(<div>Edit Medication: Metformin</div>)}
              className="cursor-pointer"
            >
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
    <>
      <div className={cn("space-y-8 p-4")}>
        <BentoGridDemo />
      </div>
      <ModalBody>
        <ModalContent className="min-h-[80vh] min-w-[90vw]">
          {modalContent}
        </ModalContent>
      </ModalBody>
    </>
  );
}

export default function PageWrapper(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Modal closeOnOutsideClick={false}>
      <PageContent {...props} />
    </Modal>
  );
}
