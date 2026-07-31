"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { toast } from "sonner";

export function useDocumentExport() {
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Comprehensive DOM sanitizer for html2canvas.
   * 1. Resets all ancestor transforms, scale, zoom & negative margins on cloned element
   * 2. Removes duplicate elements with the target ID in clonedDoc
   * 3. Resolves lab()/oklch()/color-mix() to RGB fallbacks
   * 4. Removes text-shadow and text node transforms which cause duplicate text layers in html2canvas
   * 5. Fixes SVG icon alignment inside flex containers
   */
  const sanitizeClonedDoc = (clonedDoc: Document, clonedElement?: HTMLElement) => {
    try {
      const win = clonedDoc.defaultView || window;

      // 1. If clonedElement is provided, fix duplicate IDs and reset ancestor transforms
      if (clonedElement) {
        if (clonedElement.id) {
          const matchingElements = Array.from(clonedDoc.querySelectorAll(`#${clonedElement.id}`));
          if (matchingElements.length > 1) {
            for (let i = 1; i < matchingElements.length; i++) {
              if (matchingElements[i] !== clonedElement) {
                matchingElements[i].remove();
              }
            }
          }
        }

        // Reset styling on target element
        clonedElement.style.transform = "none";
        clonedElement.style.webkitTransform = "none";
        clonedElement.style.boxShadow = "none";
        clonedElement.style.margin = "0 auto";

        // Reset transforms, scale, zoom, filters and margins on all ancestor containers up to body
        let curr = clonedElement.parentElement;
        while (curr && curr !== clonedDoc.body) {
          curr.style.transform = "none";
          curr.style.webkitTransform = "none";
          curr.style.zoom = "1";
          curr.style.margin = "0";
          curr.style.padding = "0";
          curr.style.filter = "none";
          curr.style.backdropFilter = "none";
          curr.style.display = "block";
          curr.style.width = "auto";
          curr.style.height = "auto";
          curr = curr.parentElement;
        }
      }

      // Reset root body element in clone
      if (clonedDoc.body) {
        clonedDoc.body.style.transform = "none";
        clonedDoc.body.style.webkitTransform = "none";
        clonedDoc.body.style.zoom = "1";
        clonedDoc.body.style.margin = "0";
        clonedDoc.body.style.padding = "0";
        clonedDoc.body.style.backgroundColor = "#ffffff";
      }

      // 2. Sanitize all nodes in the document
      const allNodes = Array.from(clonedDoc.querySelectorAll<HTMLElement>("*"));

      allNodes.forEach((node) => {
        try {
          const comp = win.getComputedStyle(node);
          if (comp) {
            // Text shadow causes html2canvas to draw double text!
            if (comp.textShadow && comp.textShadow !== "none") {
              node.style.textShadow = "none";
            }

            // Text transform (rotate/scale on text elements) causes double text rendering in html2canvas
            const tag = node.tagName.toLowerCase();
            if (tag === "span" || tag === "p" || tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "div") {
              if (comp.transform && comp.transform !== "none") {
                node.style.transform = "none";
                node.style.webkitTransform = "none";
              }
            }

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
      onclone: (clonedDoc, clonedElement) => sanitizeClonedDoc(clonedDoc, clonedElement),
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

      // Find explicit page containers (marked with data-page or full A4 height >= 850px)
      const pageContainers = Array.from(element.children).filter(
        (child) =>
          child instanceof HTMLElement &&
          child.offsetHeight > 0 &&
          (child.hasAttribute("data-page") ||
           child.classList.contains("document-page") ||
           child.offsetHeight >= 850)
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

          // Scale canvas to fit exactly within A4 dimensions preserving 1:1 ratio
          const renderHeightMm = (canvas.height * a4WidthMm) / canvas.width;
          const imgData = canvas.toDataURL("image/png", 1.0);
          pdf.addImage(imgData, "PNG", 0, 0, a4WidthMm, Math.min(a4HeightMm, renderHeightMm), undefined, "FAST");
        }
      } else {
        // Single-page document: capture the whole element
        const canvas = await captureElement(element);
        const renderHeightMm = (canvas.height * a4WidthMm) / canvas.width;
        const canvasPageHeight = Math.floor((canvas.width * a4HeightMm) / a4WidthMm);
        
        if (canvas.height <= canvasPageHeight + 30) {
          // Single page - fits within A4
          const imgData = canvas.toDataURL("image/png", 1.0);
          pdf.addImage(imgData, "PNG", 0, 0, a4WidthMm, Math.min(a4HeightMm, renderHeightMm), undefined, "FAST");
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

  // 2. Export as High-Res PNG Image (or ZIP for multi-page)
  const exportToImage = async (elementId: string, filename: string = "Document.png") => {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error("Document element not found for export.");
      return;
    }

    try {
      setIsExporting(true);

      const a4WidthMm = 210;
      const a4HeightMm = 297;
      const baseName = filename.replace(/\.(png|zip|jpg|jpeg)$/i, "");

      // Find explicit page containers (marked with data-page or full A4 height >= 850px)
      const pageContainers = Array.from(element.children).filter(
        (child) =>
          child instanceof HTMLElement &&
          child.offsetHeight > 0 &&
          (child.hasAttribute("data-page") ||
           child.classList.contains("document-page") ||
           child.offsetHeight >= 850)
      ) as HTMLElement[];

      if (pageContainers.length > 1) {
        // Multi-page: render each page individually and pack into ZIP archive
        const zip = new JSZip();

        for (let i = 0; i < pageContainers.length; i++) {
          const pageEl = pageContainers[i];
          const canvas = await captureElement(pageEl);
          const dataUrl = canvas.toDataURL("image/png", 1.0);
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          zip.file(`${baseName}_page_${i + 1}.png`, base64Data, { base64: true });
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipUrl = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = zipUrl;
        link.download = `${baseName}.zip`;
        link.click();
        URL.revokeObjectURL(zipUrl);

        toast.success(`Successfully exported ${pageContainers.length}-page Images ZIP: ${baseName}.zip`);
      } else {
        // Single container element: capture and slice if content spans multiple A4 pages
        const canvas = await captureElement(element);
        const canvasPageHeight = Math.floor((canvas.width * a4HeightMm) / a4WidthMm);

        if (canvas.height <= canvasPageHeight + 30) {
          // 1 page content: direct PNG download
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png", 1.0);
          link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
          link.click();
          toast.success(`Successfully exported Image: ${link.download}`);
        } else {
          // Spans multiple pages: slice into individual page images and pack into ZIP
          let totalPages = Math.floor(canvas.height / canvasPageHeight);
          const remainder = canvas.height % canvasPageHeight;
          if (remainder > 30) totalPages += 1;
          totalPages = Math.max(1, totalPages);

          if (totalPages > 1) {
            const zip = new JSZip();

            for (let page = 0; page < totalPages; page++) {
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

                const dataUrl = pageCanvas.toDataURL("image/png", 1.0);
                const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
                zip.file(`${baseName}_page_${page + 1}.png`, base64Data, { base64: true });
              }
            }

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const zipUrl = URL.createObjectURL(zipBlob);
            const link = document.createElement("a");
            link.href = zipUrl;
            link.download = `${baseName}.zip`;
            link.click();
            URL.revokeObjectURL(zipUrl);

            toast.success(`Successfully exported ${totalPages}-page Images ZIP: ${baseName}.zip`);
          } else {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png", 1.0);
            link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
            link.click();
            toast.success(`Successfully exported Image: ${link.download}`);
          }
        }
      }
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
