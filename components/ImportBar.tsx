import { JsonLdDocument, JsonLdProcessor } from "jsonld";
import React from "react";

type Props = {
  url: string;
  setUrl: (url: string) => void;
};

function ImportBar({ url, setUrl }: Props) {
  async function importData() {
    if (url.length <= 0) return;
    try {
      const res = await fetch(`/api/proxy?url=${url.trim()}`);
      const data = await res.text();

      const parser = new DOMParser();

      const temp_doc = parser.parseFromString(data, "text/html");
      const el = temp_doc.querySelector('script[type="application/ld+json"]');

      /* TODO: Handle cases where there is no JSON-LD
         For now, skip over the JSON-LD parsing portion and return */
      if (el === null) return;

      // Search for the Recipe @type and parse it
      const json = JSON.parse(el?.innerHTML as string);
      json["@graph"].forEach((item: any) => {
        if (item["@type"] === "Recipe") {
          console.log(item);
        }
      });

      console.log("res", data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-white p-2 w-[40rem] text-black"
        />
        <button onClick={() => importData()} className="bg-green-400 px-4 py-2">
          IMPORT
        </button>
      </div>
    </>
  );
}

export default ImportBar;
