"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export function useDocumentExport() {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Comprehensive DOM sanitizer for html2canvas.
   * 1. Resolves lab()/oklch()/color-mix() to RGB fallbacks
   * 2. Fixes SVG icon alignment inside flex containers (the main cause of icon-shift)
   * 3. Forces explicit inline styles for flex alignment that html2canvas handles reliably
   */
  const sanitizeClonedDoc = (clonedDoc: Document) => {
    try {
      const win = clonedDoc.defaultView || window;
      const allNodes = Array.from(clonedDoc.querySelectorAll<HTMLElement>("*"));

      allNodes.forEach((node) => {
        try {
          const comp = win.getComputedStyle(node);
          if (comp) {
            // Fix unsupported color functions
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

        // Clean inline style strings with unsupported color functions
        const styleAttr = node.getAttribute("style") || "";
        if (styleAttr.includes("lab(") || styleAttr.includes("oklch(") || styleAttr.includes("color-mix(")) {
          const clean = styleAttr
            .replace(/lab\([\s\S]*?\)/gi, "rgb(0,0,0)")
            .replace(/oklch\([\s\S]*?\)/gi, "rgb(0,0,0)")
            .replace(/color-mix\([\s\S]*?\)/gi, "rgb(0,0,0)");
          node.setAttribute("style", clean);
        }
      });

      // Fix SVG icons inside flex containers - html2canvas doesn't handle SVG + flexbox well
      // Force SVGs to have explicit display and vertical alignment
      const svgElements = Array.from(clonedDoc.querySelectorAll<SVGElement>("svg"));
      svgElements.forEach((svg) => {
        const parent = svg.parentElement;
        if (parent) {
          const parentComp = win.getComputedStyle(parent);
          // If the parent is a flex container, force proper alignment
          if (parentComp.display === "flex" || parentComp.display === "inline-flex") {
            svg.style.display = "block";
            svg.style.flexShrink = "0";
            svg.style.alignSelf = "center";
            // Force explicit dimensions from attributes
            const w = svg.getAttribute("width") || svg.style.width;
            const h = svg.getAttribute("height") || svg.style.height;
            if (w) svg.style.width = w.includes("px") ? w : `${w}px`;
            if (h) svg.style.height = h.includes("px") ? h : `${h}px`;
            svg.style.minWidth = svg.style.width;
            svg.style.minHeight = svg.style.height;
          }
        }
      });

      // Fix flex containers with gap - html2canvas sometimes mishandles gap
      // Convert gap to explicit margins on children
      const flexContainers = Array.from(clonedDoc.querySelectorAll<HTMLElement>("[class*='flex']"));
      flexContainers.forEach((container) => {
        try {
          const comp = win.getComputedStyle(container);
          if ((comp.display === "flex" || comp.display === "inline-flex") && comp.alignItems === "center") {
            // Force explicit alignment styles that html2canvas respects
            container.style.display = "flex";
            container.style.alignItems = "center";
            
            // If this is a footer-like container with icon+text pattern, force line-height
            const children = Array.from(container.children) as HTMLElement[];
            children.forEach((child) => {
              if (child.tagName.toLowerCase() === "svg") {
                child.style.display = "block";
                child.style.flexShrink = "0";
              } else if (child.tagName.toLowerCase() === "span" || child.tagName.toLowerCase() === "p") {
                child.style.lineHeight = "1";
                child.style.display = "flex";
                child.style.alignItems = "center";
              }
            });
          }
        } catch (e) {}
      });

      // Clean <style> tags
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

  /**
   * Capture a single DOM element to a high-res canvas.
   */
  const captureElement = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    return html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1200,
      onclone: (clonedDoc) => sanitizeClonedDoc(clonedDoc),
    });
  };

  /**
   * Per-page PDF export. Finds individual page containers inside the element
   * and renders each one separately into its own PDF page.
   * This ensures exact 1:1 match between preview and PDF with no content shift.
   */
  const exportToPDF = async (elementId: string, filename: string = "Document.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Document element not found for export.");
      return;
    }

    try {
      setIsExporting(true);

      const a4WidthMm = 210;
      const a4HeightMm = 297;

      // Find individual page containers (direct children of the wrapper that have visible height)
      const pageContainers = Array.from(element.children).filter(
        (child) => child instanceof HTMLElement && child.offsetHeight > 0
      ) as HTMLElement[];

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      if (pageContainers.length > 1) {
        // Multi-page: render each page container individually for pixel-perfect output
        for (let i = 0; i < pageContainers.length; i++) {
          if (i > 0) pdf.addPage();

          const pageEl = pageContainers[i];
          const canvas = await captureElement(pageEl);

          // Scale canvas to fit exactly within A4 dimensions
          const imgData = canvas.toDataURL("image/png", 1.0);
          pdf.addImage(imgData, "PNG", 0, 0, a4WidthMm, a4HeightMm, undefined, "FAST");
        }
      } else {
        // Single-page document: capture the whole element
        const canvas = await captureElement(element);

        // Check if the canvas is taller than a single A4 page
        const canvasPageHeight = Math.floor((canvas.width * a4HeightMm) / a4WidthMm);
        
        if (canvas.height <= canvasPageHeight + 30) {
          // Single page - fits within A4
          const imgData = canvas.toDataURL("image/png", 1.0);
          pdf.addImage(imgData, "PNG", 0, 0, a4WidthMm, a4HeightMm, undefined, "FAST");
        } else {
          // Needs slicing into multiple pages
          let totalPages = Math.floor(canvas.height / canvasPageHeight);
          const remainder = canvas.height % canvasPageHeight;
          if (remainder > 30) totalPages += 1;
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
        }
      }

      pdf.save(filename);
      const pageCount = pageContainers.length > 1 ? pageContainers.length : 1;
      toast.success(`Successfully exported ${pageCount}-page PDF: ${filename}`);
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

      const canvas = await captureElement(element);

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
