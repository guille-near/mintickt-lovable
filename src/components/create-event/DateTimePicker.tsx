import * as React from "react"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    date ? format(date, "HH:mm") : undefined
  )

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':')
        newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10))
      }
      setDate(newDate)
    } else {
      setDate(undefined)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (date) {
      const [hours, minutes] = time.split(':')
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10))
      setDate(newDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date ? "text-muted-foreground" : "text-foreground",
            "bg-background border-input hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          className="bg-white"
        />
        <div className="p-3 border-t border-border bg-white">
          <Select onValueChange={handleTimeSelect} value={selectedTime}>
            <SelectTrigger className="bg-white border-input">
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent className="bg-white border-input">
              {Array.from({ length: 24 * 4 }).map((_, i) => {
                const hours = Math.floor(i / 4)
                const minutes = (i % 4) * 15
                const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                return <SelectItem key={i} value={timeString} className="hover:bg-accent hover:text-accent-foreground">{timeString}</SelectItem>
              })}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}