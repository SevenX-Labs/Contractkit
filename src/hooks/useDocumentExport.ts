"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export function useDocumentExport() {
  const [isExporting, setIsExporting] = useState(false);

  // Fail-safe DOM sanitizer for html2canvas
  // Resolves computed colors to explicit RGB inline styles to prevent lab() / oklch() errors
  const sanitizeClonedDoc = (clonedDoc: Document) => {
    try {
      const win = clonedDoc.defaultView || window;
      const allNodes = Array.from(clonedDoc.querySelectorAll<HTMLElement>("*"));

      allNodes.forEach((node) => {
        try {
          const comp = win.getComputedStyle(node);
          if (comp) {
            if (comp.color && (comp.color.includes("lab(") || comp.color.includes("oklch(") || comp.color.includes("color-mix("))) {
              node.style.color = "#111111";
            }
            if (comp.backgroundColor && (comp.backgroundColor.includes("lab(") || comp.backgroundColor.includes("oklch(") || comp.backgroundColor.includes("color-mix("))) {
              node.style.backgroundColor = comp.backgroundColor.includes("0, 0, 0, 0") || comp.backgroundColor.includes("transparent")
                ? "transparent"
                : "#ffffff";
            }
            if (comp.borderColor && (comp.borderColor.includes("lab(") || comp.borderColor.includes("oklch(") || comp.borderColor.includes("color-mix("))) {
              node.style.borderColor = "#e5e7eb";
            }
          }
        } catch (e) {}

        const styleAttr = node.getAttribute("style") || "";
        if (styleAttr.includes("lab(") || styleAttr.includes("oklch(") || styleAttr.includes("color-mix(")) {
          const clean = styleAttr
            .replace(/lab\([\s\S]*?\)/gi, "rgb(0,0,0)")
            .replace(/oklch\([\s\S]*?\)/gi, "rgb(0,0,0)")
            .replace(/color-mix\([\s\S]*?\)/gi, "rgb(0,0,0)");
          node.setAttribute("style", clean);
        }
      });

      const styleTags = Array.from(clonedDoc.querySelectorAll("style"));
      styleTags.forEach((st) => {
        if (st.textContent) {
          st.textContent = st.textContent
            .replace(/lab\([\s\S]*?\)/gi, "rgb(0,0,0)")
            .replace(/oklch\([\s\S]*?\)/gi, "rgb(0,0,0)")
            .replace(/color-mix\([\s\S]*?\)/gi, "rgb(0,0,0)");
        }
      });
    } catch (e) {
      console.warn("Sanitization warning:", e);
    }
  };

  // 1. Export as PDF with Multi-Page Canvas Slicing (Supports 1-page, 2-page, N-page documents perfectly)
  const exportToPDF = async (elementId: string, filename: string = "Document.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Document element not found for export.");
      return;
    }

    try {
      setIsExporting(true);

      const canvas = await html2canvas(element, {
        scale: 2, // Crisp 200 DPI resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        onclone: (clonedDoc) => sanitizeClonedDoc(clonedDoc),
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const a4WidthMm = 210;
      const a4HeightMm = 297;

      // Calculate canvas height corresponding to 1 A4 page in canvas pixels
      const canvasPageHeight = Math.floor((canvas.width * a4HeightMm) / a4WidthMm);
      
      // Calculate total pages, filtering out trailing pixel overflows (<= 30px)
      let totalPages = Math.floor(canvas.height / canvasPageHeight);
      const remainder = canvas.height % canvasPageHeight;
      if (remainder > 30) {
        totalPages += 1;
      }
      totalPages = Math.max(1, totalPages);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = canvasPageHeight;
        const ctx = pageCanvas.getContext("2d");

        if (ctx) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

          const sourceY = page * canvasPageHeight;
          const sourceHeight = Math.min(canvasPageHeight, canvas.height - sourceY);

          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight
          );

          const pageImgData = pageCanvas.toDataURL("image/png", 1.0);
          pdf.addImage(pageImgData, "PNG", 0, 0, a4WidthMm, a4HeightMm, undefined, "FAST");
        }
      }

      pdf.save(filename);
      toast.success(`Successfully exported ${totalPages}-page PDF: ${filename}`);
    } catch (err: any) {
      console.error("PDF Export error:", err);
      toast.error("Error exporting PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Export as High-Res PNG Image
  const exportToImage = async (elementId: string, filename: string = "Document.png") => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Document element not found for export.");
      return;
    }

    try {
      setIsExporting(true);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        onclone: (clonedDoc) => sanitizeClonedDoc(clonedDoc),
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png", 1.0);
      link.download = filename;
      link.click();
      toast.success(`Successfully exported Image: ${filename}`);
    } catch (err: any) {
      console.error("Image Export error:", err);
      toast.error("Error exporting Image.");
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Export as DOCX Word Document
  const exportToDOCX = async (elementId: string, filename: string = "Document.docx") => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Document element not found for export.");
      return;
    }

    try {
      setIsExporting(true);
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 11pt; color: #111111; line-height: 1.5; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
            th, td { border: 1px solid #cccccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1, h2, h3 { color: #0a0a0a; font-family: Arial, sans-serif; }
            .header-table { border: none !important; }
            .header-table td { border: none !important; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
        </html>
      `;

      const blob = new Blob(["\ufeff" + htmlContent], {
        type: "application/msword",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename.endsWith(".docx") ? filename : `${filename}.docx`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success(`Successfully exported DOCX: ${filename}`);
    } catch (err: any) {
      console.error("Error exporting DOCX:", err);
      toast.error(`DOCX generation error: ${err?.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPDF,
    exportToImage,
    exportToDOCX,
    isExporting,
  };
}
