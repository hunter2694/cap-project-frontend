import React, { useRef } from "react";
import html2canvas from "html2canvas";

export default function Certificate({ name, difficulty, score, total }) {
  const ref = useRef();

  const downloadPNG = async () => {
    const node = ref.current;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true });
    const link = document.createElement("a");
    link.download = `certificate-${(name || "player").replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <div ref={ref} className="p-8 bg-white shadow rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-2">Certificate of Completion</h2>
        <p className="text-slate-600 mb-6">This certifies that</p>
        <div className="text-2xl font-semibold mb-4">{name}</div>
        <p className="mb-2">has completed the <strong>{difficulty}</strong> level of</p>
        <div className="text-xl font-medium mb-2">CyberAware — Gamified Cybersecurity Awareness Platform</div>
        <p className="mb-6">Score: {score} / {total}</p>
        <div className="text-sm text-slate-500">Date: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={downloadPNG}>Download PNG</button>
        <button className="px-4 py-2 rounded bg-slate-100" onClick={() => window.print()}>Print</button>
      </div>
    </div>
  );
}
