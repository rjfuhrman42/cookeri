import { Recipe } from "schema-dts";

import React from "react";
import { Button } from "@nextui-org/button";
import { ImportIcon } from "./icons";

type Props = {
  url: string;
  setUrl: (url: string) => void;
  setData: (data: Recipe) => void;
};

function ImportBar({ url, setUrl, setData }: Props) {
  /*

    Todos:
    [] Handle when calls to sites are blocked by firewall
    [] Handle when sites do not use JSON-LD or follow expected pattern
    [] Better error handling (define what this means)

  */

  async function importData() {
    if (url.length <= 0) return;
    try {
      const res = await fetch(`/api/proxy?url=${url.trim()}`);
      const data = await res.text();

      const parser = new DOMParser();

      const temp_doc = parser.parseFromString(data, "text/html");
      const json_ld_element = temp_doc.querySelector(
        'script[type="application/ld+json"]'
      );

      /* TODO: Handle cases where there is no JSON-LD
         For now, skip over the JSON-LD parsing portion and return */

      if (json_ld_element === null) return;

      // Search for the Recipe @type and parse it
      const json = JSON.parse(json_ld_element?.innerHTML);

      // If no @graph attribute, then the data is JSON-LD, but not in the format we expect
      // For now, just log the error and return
      if (!json["@graph"]) {
        console.log("No recipe data found in json-ld graph!", json);
        return;
      }

      // Filter out the Recipe data from the graph
      const recipeData: Recipe = json["@graph"].filter((item: any) => {
        if (item["@type"] === "Recipe") {
          return item;
        }
      })[0];

      setData(recipeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="w-full flex flex-col gap-4 z-10 items-center justify-center font-mono text-sm">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full border p-2 text-black"
      />
      <Button
        className="font-league-spartan text-lg text-white w-full px-4"
        onClick={() => importData()}
        size="md"
        color="success"
        endContent={<ImportIcon stroke="white" />}
      >
        Import
      </Button>
    </div>
  );
}

export default ImportBar;
