import * as React from "react"
import { cn } from "../../lib/utils"

interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export const Calendar: React.FC<CalendarProps> = ({ value, onChange, className }) => {
  const [currentDate, setCurrentDate] = React.useState(value || new Date())

  const handleDateClick = (date: Date) => {
    setCurrentDate(date)
    onChange?.(date)
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="space-y-4">
        <div className="text-center font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - currentDate.getDay() + 1)
            return (
              <button
                key={i}
                onClick={() => handleDateClick(date)}
                className={cn(
                  "h-9 w-9 text-center text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                  date.getMonth() === currentDate.getMonth() ? "text-foreground" : "text-muted-foreground",
                  date.toDateString() === (value || currentDate).toDateString() && "bg-primary text-primary-foreground"
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Calendar
