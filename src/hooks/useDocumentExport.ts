"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function useDocumentExport() {
  const [isExporting, setIsExporting] = useState(false);

  // Helper to sanitize cloned DOM tree for html2canvas (removes unsupported lab() and oklch() color functions)
  const sanitizeClonedDoc = (clonedDoc: Document) => {
    // 1. Clean style elements
    const styleTags = Array.from(clonedDoc.querySelectorAll("style"));
    styleTags.forEach((style) => {
      try {
        if (style.textContent) {
          style.textContent = style.textContent
            .replace(/lab\([^)]+\)/gi, "rgba(0, 0, 0, 0.1)")
            .replace(/oklch\([^)]+\)/gi, "rgba(0, 0, 0, 0.1)");
        }
      } catch (e) {
        // Ignore cross-origin stylesheet errors
      }
    });

    // 2. Clean element inline styles & CSS custom properties
    const allElements = Array.from(clonedDoc.querySelectorAll("*"));
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style) {
        const styleAttr = htmlEl.getAttribute("style") || "";
        if (styleAttr.includes("lab(") || styleAttr.includes("oklch(")) {
          const cleanedStyle = styleAttr
            .replace(/lab\([^)]+\)/gi, "rgba(0, 0, 0, 0.1)")
            .replace(/oklch\([^)]+\)/gi, "rgba(0, 0, 0, 0.1)");
          htmlEl.setAttribute("style", cleanedStyle);
        }

        // Reset any inline shadow or filter that triggers lab/oklch color parsing in html2canvas
        if (htmlEl.style.boxShadow && (htmlEl.style.boxShadow.includes("lab(") || htmlEl.style.boxShadow.includes("oklch("))) {
          htmlEl.style.boxShadow = "none";
        }
        if (htmlEl.style.borderColor && (htmlEl.style.borderColor.includes("lab(") || htmlEl.style.borderColor.includes("oklch("))) {
          htmlEl.style.borderColor = "#e5e5e5";
        }
      }
    });
  };

  // 1. Export as PDF
  const exportToPDF = async (elementId: string, filename: string = "Document.pdf") => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => sanitizeClonedDoc(clonedDoc),
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Export as PNG Image
  const exportToImage = async (elementId: string, filename: string = "Document.png") => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      setIsExporting(true);
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => sanitizeClonedDoc(clonedDoc),
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = filename;
      link.click();
    } catch (err) {
      console.error("Error exporting image:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Export as DOCX Word Document
  const exportToDOCX = async (elementId: string, filename: string = "Document.docx") => {
    const element = document.getElementById(elementId);
    if (!element) return;

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
    } catch (err) {
      console.error("Error exporting DOCX:", err);
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
