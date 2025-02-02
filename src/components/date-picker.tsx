"use client";
import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

export interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    undefined,
  );
  const effectiveDate = value !== undefined ? value : internalDate;
  const [isOpen, setIsOpen] = React.useState(false);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (onChange) {
        onChange(selectedDate);
      } else {
        setInternalDate(selectedDate);
      }
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    valueStr: string,
  ) => {
    if (effectiveDate) {
      const newDate = new Date(effectiveDate);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(valueStr) % 12) + (newDate.getHours() >= 12 ? 12 : 0),
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(valueStr));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        if (valueStr === "PM" && currentHours < 12) {
          newDate.setHours(currentHours + 12);
        } else if (valueStr === "AM" && currentHours >= 12) {
          newDate.setHours(currentHours - 12);
        }
      }
      if (onChange) {
        onChange(newDate);
      } else {
        setInternalDate(newDate);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !effectiveDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {effectiveDate ? (
            format(effectiveDate, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        onMouseDown={(e) => e.stopPropagation()} // Prevent popover clicks from closing the modal
      >
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={effectiveDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      effectiveDate &&
                      effectiveDate.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      effectiveDate && effectiveDate.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea>
              <div className="flex p-2 sm:flex-col">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      effectiveDate &&
                      ((ampm === "AM" && effectiveDate.getHours() < 12) ||
                        (ampm === "PM" && effectiveDate.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
