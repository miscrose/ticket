import  { useState ,useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import type {selectOption} from "../types/option"

interface SelectBoxProps {
  options: selectOption[]
  placeholder?: string
  onSelect?: (option: selectOption) => void
  value?: selectOption | null
}

export function SelectBox({ options, placeholder = "Sélectionner une option", onSelect, value }: SelectBoxProps) {
  const [open, setOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState(value?.key || "")

  useEffect(() => {
    setSelectedKey(value?.key || "")
  }, [value])

  const selectedOption = options.find((opt) => opt.key === selectedKey)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Rechercher..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Aucune option trouvée.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.key}
                  value={opt.label}
                  onSelect={() => {
                    setSelectedKey(opt.key)
                    onSelect?.(opt)
                    setOpen(false)
                  }}
                >
                  {opt.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedKey === opt.key ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
