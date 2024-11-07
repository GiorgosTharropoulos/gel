import * as React from "react";
import { invariant } from "@tanstack/react-router";
import clsx from "clsx";
import * as d3 from "d3";
import { feature } from "topojson-client";

import { mapdata } from "~/data/topo";

type GeoJSONFeature = GeoJSON.FeatureCollection<
  GeoJSON.GeometryObject,
  GeoJSON.GeoJsonProperties
>["features"][number];

interface Feature extends GeoJSONFeature {
  id: string;
}

interface FeatureCollection
  extends GeoJSON.FeatureCollection<
    GeoJSON.GeometryObject,
    GeoJSON.GeoJsonProperties
  > {
  features: Feature[];
}

const featureCollection = feature(
  // @ts-expect-error - types are wrong
  mapdata,
  mapdata.objects.tracts,
) as unknown as FeatureCollection;

const identityProjection = d3
  .geoIdentity()
  .fitSize([800, 600], featureCollection);
const pathGenerator = d3.geoPath().projection(identityProjection);
const featuresMap = new Map(featureCollection.features.map((d) => [d.id, d]));

export interface RegionMapProps {
  selectedRegionId: string | null;
  onSelectRegion(regionId: string | null): void;
  onEnterRegion(regionId: string): void;
}

export function RegionMap({
  onSelectRegion,
  selectedRegionId,
  onEnterRegion,
}: RegionMapProps) {
  function handleRegionClick(event: React.MouseEvent, d: Feature) {
    event.stopPropagation();
    onSelectRegion(d.id);
  }

  function handleBackgroundClick() {
    onSelectRegion(null);
  }

  React.useEffect(() => {
    if (selectedRegionId === null) {
      d3.select("svg g").transition().duration(750).attr("transform", "");
    } else {
      const feature = featuresMap.get(selectedRegionId);
      invariant(
        feature,
        `Could not find feature with id "${selectedRegionId}"`,
      );

      const [[x0, y0], [x1, y1]] = pathGenerator.bounds(feature);
      const dx = x1 - x0;
      const dy = y1 - y0;
      const x = (x0 + x1) / 2;
      const y = (y0 + y1) / 2;
      const scale = Math.max(
        1,
        Math.min(8, 0.9 / Math.max(dx / 800, dy / 600)),
      );
      const translate = [800 / 2 - scale * x, 600 / 2 - scale * y];

      d3.select("svg g")
        .transition()
        .duration(750)
        .attr("transform", `translate(${translate}) scale(${scale})`);
    }
  }, [selectedRegionId]);

  return (
    <svg
      className="max-h-[600px] w-full"
      viewBox="0 0 800 600"
      onClick={handleBackgroundClick}
    >
      <g className="regions">
        {featureCollection.features.map((d, i) => (
          <path
            d={pathGenerator(d) ?? ""}
            className={clsx(d.id === selectedRegionId && "fill-yellow-500")}
            fill={clsx(
              `rgba(38,50,56,${(1 / featureCollection.features.length) * i})`,
            )}
            stroke="#FFFFFF"
            strokeWidth={0.5}
            onClick={(event) => handleRegionClick(event, d)}
            onMouseEnter={() => onEnterRegion(d.id)}
          />
        ))}
      </g>
    </svg>
  );
}
