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
  useModal,
} from "~/components/ui/animated-modal";
import { DateTimePicker } from "~/components/date-picker";
import { CallLog } from "~/components/calllog_display";

const AddCallScheduleForm = ({ patientId }: { patientId: number }) => {
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledTime) return;
    const payload = {
      patient_id: patientId,
      call_time: scheduledTime.toISOString(),
    };
    try {
      await axios.post(
        "http://localhost:8000/patients/scheduled-calls/",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log("Call schedule added");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm font-medium">Scheduled Time</label>
        <DateTimePicker
          value={scheduledTime ?? undefined}
          onChange={setScheduledTime}
        />
        <Button type="submit">Submit Call Schedule</Button>
      </form>
    </div>
  );
};

const AddMedicationAndScheduleForm = ({ patientId }: { patientId: number }) => {
  // FIX: Added "nick" field to the state
  const [medData, setMedData] = useState({
    name: "",
    nick: "",
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
  ) => setMedData({ ...medData, [e.target.name]: e.target.value });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !scheduledTime) return;
    setLoading(true);
    try {
      const medPayload = {
        name: medData.name,
        nick: medData.nick, // now included in payload
        patient_id: patientId,
        method: medData.method,
        dosage: parseFloat(medData.dosage),
        units: medData.units,
        frequency: parseInt(medData.frequency),
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : null,
        instructions: medData.instructions,
      };
      const medRes = await axios.post(
        "http://localhost:8000/patients/prescriptions/",
        medPayload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      const prescriptionId = medRes.data.id;
      const schedPayload = {
        prescription_id: prescriptionId,
        scheduled_time: scheduledTime.toISOString(),
        status,
      };
      const schedRes = await axios.post(
        "http://localhost:8000/medication-schedules/",
        schedPayload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log("Medication and schedule added:", schedRes.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-h-[70vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="font-bold">Medication Details</h3>
        <input
          type="text"
          name="name"
          placeholder="Medication Name"
          value={medData.name}
          onChange={handleMedChange}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
        {/* New input for "nick" */}
        <input
          type="text"
          name="nick"
          placeholder="Medication Nickname"
          value={medData.nick}
          onChange={handleMedChange}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
        <input
          type="text"
          name="method"
          placeholder="Method"
          value={medData.method}
          onChange={handleMedChange}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            name="dosage"
            placeholder="Dosage"
            value={medData.dosage}
            onChange={handleMedChange}
            required
            step="0.01"
            className="mt-1 block w-full rounded-md border p-2"
          />
          <input
            type="text"
            name="units"
            placeholder="Units"
            value={medData.units}
            onChange={handleMedChange}
            required
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>
        <input
          type="number"
          name="frequency"
          placeholder="Frequency"
          value={medData.frequency}
          onChange={handleMedChange}
          required
          className="mt-1 block w-full rounded-md border p-2"
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={medData.instructions}
          onChange={handleMedChange}
          className="mt-1 block w-full rounded-md border p-2"
        />
        <h3 className="font-bold">Prescription Dates</h3>
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
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Medication & Schedule"}
        </Button>
      </form>
    </div>
  );
};

function PageContent({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("");
  const [makeCall, setMakeCall] = useState(false);
  const [data, setData] = useState<any>(null);
  const { setOpen } = useModal();
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    params.then((d) => setSlug(d.slug));
  }, [params]);

  useEffect(() => {
    if (slug) {
      axios
        .get(`http://localhost:8000/patients/${slug}`)
        .then((res) => setData(res.data))
        .catch((err) => console.error(err));
    }
  }, [slug]);

  useEffect(() => {
    if (makeCall && data) {
      let callTime: Date;
      if (data.scheduled_calls && data.scheduled_calls.length > 0) {
        callTime = new Date(data.scheduled_calls[0].call_time);
      } else {
        callTime = new Date();
      }
      const hour = callTime.getHours().toString().padStart(2, "0");
      const minute = callTime.getMinutes().toString().padStart(2, "0");

      const payload = {
        first_name: data.patient.first_name,
        last_name: data.patient.last_name,
        follow_up_topics:
          "Nephew's piano concert, back pain, medication refills",
        phone_number: data.patient.phone_number,
        caregiver_number: "N/A",
        prescriptions: {
          ids: data.prescriptions.map((p: any) => p.id),
          names: data.prescriptions.map((p: any) => p.name),
        },
        bio: data.patient.bio,
        hour,
        minute,
      };

      axios
        .post("http://localhost:8000/make_call", payload, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => console.log("Call made:", response.data))
        .catch((error) => console.error("Error making call:", error))
        .finally(() => setMakeCall(false));
    }
  }, [makeCall, data]);

  const handleMakeCall = () => {
    setMakeCall(true);
  };

  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setOpen(true);
  };

  const formatDate = (dt: string) => new Date(dt).toLocaleDateString();
  const formatTime = (dt: string) => new Date(dt).toLocaleTimeString();

  const items = [
    {
      title: "Patient Info",
      description: "User details",
      header: null,
      children: data ? (
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold text-white">
              {data.patient.first_name.charAt(0)}
            </div>
            <div>
              <div className="font-bold">
                {data.patient.first_name} {data.patient.last_name}
              </div>
              <div className="text-sm text-gray-600">
                {data.patient.phone_number}
              </div>
              <div className="text-sm text-gray-600">{data.patient.bio}</div>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleMakeCall}>Make a Call</Button>
          </div>
        </div>
      ) : (
        "Loading..."
      ),
      className: "md:col-span-1",
    },
    {
      title: "Call Schedule",
      description: "Call timings",
      header: (
        <div className="flex items-center justify-between p-4">
          <span className="font-bold">Call Schedule</span>
          <Button
            onClick={() =>
              openModal(<AddCallScheduleForm patientId={parseInt(slug) || 1} />)
            }
          >
            Add New Schedule
          </Button>
        </div>
      ),
      children:
        data && data.scheduled_calls.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.scheduled_calls.map((c: any) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => openModal(<div>Edit Call Schedule</div>)}
                >
                  <TableCell>{formatDate(c.call_time)}</TableCell>
                  <TableCell>{formatTime(c.call_time)}</TableCell>
                  <TableCell>Call</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          "No call schedules."
        ),
      className: "md:col-span-2",
    },
    {
      title: "Call Logs",
      description: "Recent calls",
      header: (
        <div className="p-4">
          <span className="font-bold">Call Logs</span>
        </div>
      ),
      children:
        data && data.call_logs.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.call_logs.map((l: any) => (
                <TableRow
                  key={l.id}
                  className="cursor-pointer"
                  onClick={() =>
                    openModal(
                      <CallLog
                        first_name={data.patient.first_name}
                        datetime={new Date(l.call_time).toLocaleString()}
                        status={l.call_status}
                        transcript={l.transcription}
                        follow_up={l.follow_up}
                        concerns={""}
                        summary={l.summary}
                      />,
                    )
                  }
                >
                  <TableCell>{formatDate(l.call_time)}</TableCell>
                  <TableCell>{l.call_status}</TableCell>
                  <TableCell>{l.summary}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          "No call logs."
        ),
      className: "md:col-span-1",
    },
    {
      title: "Medications & Prescriptions",
      description: "Current meds & schedules",
      header: (
        <div className="flex items-center justify-between p-4">
          <span className="font-bold">Medications & Prescriptions</span>
          <Button
            onClick={() =>
              openModal(
                <AddMedicationAndScheduleForm
                  patientId={parseInt(slug) || 1}
                />,
              )
            }
          >
            Add Medication & Schedule
          </Button>
        </div>
      ),
      children:
        data && data.prescriptions.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.prescriptions.map((p: any) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() =>
                    openModal(<div>Edit Medication: {p.name}</div>)
                  }
                >
                  <TableCell>{p.name}</TableCell>
                  <TableCell>
                    {p.dosage} {p.units}
                  </TableCell>
                  <TableCell>{p.frequency}x/day</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          "No medications."
        ),
      className: "md:col-span-2",
    },
  ];

  const BentoGridDemo = () => (
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
