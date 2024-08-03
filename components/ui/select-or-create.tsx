import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOrCreateProps {
  options: string[];
  placeholder: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function SelectOrCreate({
  options,
  placeholder,
  onValueChange,
  disabled,
}: SelectOrCreateProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newValue, setNewValue] = useState("");

  const handleSelectChange = (value: string) => {
    if (value === "create_new") {
      setIsCreating(true);
    } else {
      onValueChange(value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(e.target.value);
  };

  const handleCreateNew = () => {
    if (newValue.trim()) {
      onValueChange(newValue.trim());
      setIsCreating(false);
      setNewValue("");
    }
  };

  if (isCreating) {
    return (
      <div className="flex space-x-2">
        <Input
          value={newValue}
          onChange={handleInputChange}
          placeholder="Enter new value"
          className="flex-grow"
        />
        <Button onClick={handleCreateNew}>Add</Button>
        <Button variant="outline" onClick={() => setIsCreating(false)}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Select onValueChange={handleSelectChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
        <SelectItem value="create_new">Create new...</SelectItem>
      </SelectContent>
    </Select>
  );
}
