import { useSuspenseQuery } from "@tanstack/react-query";

import { regionsNames } from "~/api/region";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const NATION_VALUE = "nation" as const;

export interface RegionSelectProps {
  onRegionChange: (regionId: string | null) => void;
  selectedRegion: string | null;
}

export function RegionSelect({
  selectedRegion,
  onRegionChange,
}: RegionSelectProps) {
  const { data: regionNames } = useSuspenseQuery(regionsNames());

  function handleRegionChange(regionId: string) {
    onRegionChange(regionId === NATION_VALUE ? null : regionId);
  }

  return (
    <Select
      onValueChange={handleRegionChange}
      value={selectedRegion ?? NATION_VALUE}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NATION_VALUE}>Nation</SelectItem>
        {Object.values(regionNames).map((region) => (
          <SelectItem key={region.id} value={region.id.toString()}>
            {region.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
