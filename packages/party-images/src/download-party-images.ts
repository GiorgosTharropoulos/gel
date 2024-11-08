import fs from "node:fs/promises";
import path from "node:path";
import type { Config as SVGOConfig } from "svgo";
import ky from "ky";
import { optimize } from "svgo";

import type { PartyDetails } from "@gel/data";
import { parties as partiesMap } from "@gel/data";

const ignoredParties = new Set([998]);
const parties = Object.values(partiesMap).filter(
  (p) => !ignoredParties.has(p.id),
);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const imagesDir = path.join(
  __dirname,
  "../../../apps/backend/public/party-images",
);

const svgoConfig = {
  plugins: [
    // Essential optimizations
    {
      name: "preset-default",
      params: {
        overrides: {
          // Disable or adjust the convertColors plugin
          convertColors: {
            currentColor: false,
            names2hex: false,
            rgb2hex: false,
            shorthex: false,
            shortname: false,
          },
        },
      },
    },
    // Remove XML instructions
    {
      name: "removeXMLProcInst",
    },
    // Optimize paths
    {
      name: "convertPathData",
      params: {
        noSpaceAfterFlags: false,
      },
    },
    // Round numeric values
    {
      name: "cleanupNumericValues",
      params: {
        floatPrecision: 3,
        leadingZero: true,
      },
    },
    // Minify styles
    {
      name: "minifyStyles",
    },
    // Remove empty attributes
    {
      name: "removeEmptyAttrs",
    },
    // Remove empty text
    {
      name: "removeEmptyText",
    },
    // Remove empty containers
    {
      name: "removeEmptyContainers",
    },
    // Merge paths
    {
      name: "mergePaths",
    },
  ],
  // Global configuration
  multipass: true, // Multiple passes for better optimization
} satisfies SVGOConfig;

const http = ky.create({
  keepalive: true,
  prefixUrl:
    "https://ekloges-prev.singularlogic.eu/2023/june/v/home/data/2023b/images/",
});

async function downloadPartyImage(party: PartyDetails) {
  if (!party.logo) return;

  const filePath = path.join(imagesDir, party.logo);

  const svgResponse = await http.get(`y${party.id}.svg`, {
    throwHttpErrors: false,
  });
  if (svgResponse.ok) {
    const { data } = optimize(await svgResponse.text(), svgoConfig);
    await fs.writeFile(filePath, data, "utf-8");
  } else {
    const pngBuffer = await http.get(`y${party.id}.png`).arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(pngBuffer), "utf-8");
  }
}

await Promise.all(parties.map((party) => downloadPartyImage(party)));
