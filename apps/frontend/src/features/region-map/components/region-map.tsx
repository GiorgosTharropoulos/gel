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

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

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
        Math.min(8, 0.9 / Math.max(dx / MAP_WIDTH, dy / MAP_HEIGHT)),
      );
      const translate = [MAP_WIDTH / 2 - scale * x, MAP_HEIGHT / 2 - scale * y];

      d3.select("svg g")
        .transition()
        .duration(750)
        .attr("transform", `translate(${translate}) scale(${scale})`);
    }
  }, [selectedRegionId]);

  return (
    <svg
      className="max-h-[600px] w-full"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      onClick={handleBackgroundClick}
    >
      <g className="regions">
        {featureCollection.features.map((feature, i) => (
          <path
            d={pathGenerator(feature) ?? ""}
            className={clsx(
              feature.id === selectedRegionId && "fill-yellow-500",
            )}
            fill={clsx(
              `rgba(38,50,56,${(1 / featureCollection.features.length) * i})`,
            )}
            stroke="#FFFFFF"
            strokeWidth={0.5}
            onClick={(event) => handleRegionClick(event, feature)}
            onMouseEnter={() => onEnterRegion(feature.id)}
          />
        ))}
      </g>
    </svg>
  );
}
