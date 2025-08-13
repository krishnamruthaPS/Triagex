import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Hospital {
  _id: string;
  name: string;
  address?: string;
  location?: {
    coordinates: [number, number];
  };
}

interface HospitalComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function HospitalCombobox({ 
  value, 
  onChange, 
  placeholder = "Search hospitals...",
  className 
}: HospitalComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [hospitals, setHospitals] = React.useState<Hospital[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  
  // Debounce search to avoid too many API calls
  const debouncedSearchValue = useDebounce(searchValue, 300)

  // Fetch hospitals from API with error handling
  const fetchHospitals = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5001/api/hospitals')
      if (response.ok) {
        const data = await response.json()
        setHospitals(data)
        console.log('✅ Hospitals loaded:', data.length, 'hospitals found')
      } else {
        console.error('Failed to fetch hospitals:', response.statusText)
        // Fallback: You could show an error message to the user
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error)
      // Fallback: You could provide a manual input option
    } finally {
      setLoading(false)
    }
  }, [])

  // Load hospitals on component mount
  React.useEffect(() => {
    fetchHospitals()
  }, [fetchHospitals])

  // Filter hospitals based on search with intelligent matching
  const filteredHospitals = React.useMemo(() => {
    // Only show suggestions if user has typed at least 3 characters
    if (!debouncedSearchValue || debouncedSearchValue.length < 3) {
      return []
    }
    
    const searchLower = debouncedSearchValue.toLowerCase()
    
    // Score hospitals based on relevance
    const scoredHospitals = hospitals.map(hospital => {
      let score = 0
      const nameLower = hospital.name.toLowerCase()
      const addressLower = hospital.address?.toLowerCase() || ""
      
      // Exact match gets highest score
      if (nameLower === searchLower) score += 100
      // Name starts with search term
      else if (nameLower.startsWith(searchLower)) score += 50
      // Name contains search term
      else if (nameLower.includes(searchLower)) score += 25
      // Address contains search term
      else if (addressLower.includes(searchLower)) score += 10
      
      return { hospital, score }
    })
    
    // Filter and sort by score first, then alphabetically for same scores, then limit to 10 results
    return scoredHospitals
      .filter(item => item.score > 0)
      .sort((a, b) => {
        if (a.score === b.score) {
          return a.hospital.name.localeCompare(b.hospital.name)
        }
        return b.score - a.score
      })
      .slice(0, 10)
      .map(item => item.hospital)
  }, [hospitals, debouncedSearchValue])

  // Find selected hospital
  const selectedHospital = hospitals.find(hospital => hospital.name === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal h-auto min-h-[2.5rem] px-3 py-2 bg-white border-gray-300 text-gray-900",
            !value && "text-gray-500",
            className
          )}
        >
          {selectedHospital ? (
            <div className="flex flex-col items-start text-left">
              <span className="font-medium text-gray-900">{selectedHospital.name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-white border border-gray-200 shadow-lg" align="start">
        <Command className="bg-white">
          <CommandInput 
            placeholder="Search hospitals..." 
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-0 border-b border-gray-200 text-gray-900 placeholder-gray-500"
          />
          <CommandList className="bg-white max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-gray-600 flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-r-transparent"></div>
                Loading hospitals...
              </div>
            ) : (
              <>
                <CommandEmpty className="p-4 text-sm text-gray-500">
                  {!searchValue ? (
                    "Type at least 3 characters to search hospitals..."
                  ) : searchValue.length < 3 ? (
                    `Type ${3 - searchValue.length} more character${3 - searchValue.length === 1 ? '' : 's'} to search...`
                  ) : (
                    "No hospitals found matching your search."
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {filteredHospitals.map((hospital) => (
                    <CommandItem
                      key={hospital._id}
                      value={hospital.name}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? "" : currentValue)
                        setOpen(false)
                        setSearchValue("") // Clear search when selection is made
                      }}
                      className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 cursor-pointer text-gray-900"
                    >
                      <span className="font-medium">{hospital.name}</span>
                      <Check
                        className={cn(
                          "ml-2 h-4 w-4 text-blue-600",
                          value === hospital.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
