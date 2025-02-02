import { useState } from "react";
import { faker } from "@faker-js/faker";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const randomPassword = faker.internet.password(2);
  const [form, setForm] = useState({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    phone_number: faker.phone.number("##########"),
    password: randomPassword,
    confirm_password: randomPassword,
    patient: {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      phone_number: faker.phone.number("##########"),
      bio: faker.lorem.sentence(),
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("patient.")) {
      const key = name.split(".")[1];
      setForm({ ...form, patient: { ...form.patient, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/register",
        form,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log("Registration successful:", response.data);
    } catch (error: any) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {/* Caregiver fields */}
              <div className="grid gap-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="1234567890"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Patient fields */}
              <div className="grid gap-2">
                <Label htmlFor="patient.first_name">Patient First Name</Label>
                <Input
                  id="patient.first_name"
                  name="patient.first_name"
                  value={form.patient.first_name}
                  onChange={handleChange}
                  placeholder="Jane"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="patient.last_name">Patient Last Name</Label>
                <Input
                  id="patient.last_name"
                  name="patient.last_name"
                  value={form.patient.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="patient.phone_number">
                  Patient Phone Number
                </Label>
                <Input
                  id="patient.phone_number"
                  name="patient.phone_number"
                  value={form.patient.phone_number}
                  onChange={handleChange}
                  placeholder="0987654321"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="patient.bio">Patient Phone Number</Label>
                <Input
                  id="patient.bio"
                  name="patient.bio"
                  value={form.patient.bio}
                  onChange={handleChange}
                  placeholder="He likes sports"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
