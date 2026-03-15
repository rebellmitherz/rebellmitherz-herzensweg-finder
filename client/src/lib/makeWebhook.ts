/**
 * Make.com Webhook Integration
 * Sendet Lead-Daten + Analyse-Ergebnis an Make für:
 * 1. Heiße-Lead-Alarm via WhatsApp (bei komplexen Fällen)
 * 2. Analyse-Ergebnis per E-Mail an den Nutzer
 */

import type { AnalysisResult } from "./analyzeCase";

const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/jk6od2m5xgsdk5b1eziji5br8ydip2sk";

const PRODUCT_NAMES: Record<string, string> = {
  jugendamt_antworten: "Jugendamt-Antworten",
  gutachten: "Gutachten-Analyse",
  akteneinsicht: "Akteneinsicht",
  protokollberichtigung: "Protokollberichtigung",
  durchsetzung: "Durchsetzung",
  elternschutzpaket: "Elternschutzpaket",
};

const PRODUCT_URLS: Record<string, string> = {
  jugendamt_antworten: "https://www.rebellsystem.de/jugendamt-antworten-produkt.html",
  gutachten: "https://www.rebellsystem.de/gutachten-produkt.html",
  akteneinsicht: "https://www.rebellsystem.de/akteneinsicht-produkt.html",
  protokollberichtigung: "https://www.rebellsystem.de/protokollberichtigung-produkt.html",
  durchsetzung: "https://www.rebellsystem.de/durchsetzung-produkt.html",
  elternschutzpaket: "https://www.rebellsystem.de/elternschutzpaket-produkt.html",
};

export interface WebhookPayload {
  // Lead-Daten
  email: string;
  timestamp: string;
  source: string;

  // Analyse-Ergebnis
  problemType: string;
  isComplex: boolean;
  summary: string;
  riskNote: string;
  nextStep: string;

  // Produkt-Empfehlung
  primaryProductName: string;
  primaryProductUrl: string;
  secondaryProductName: string;
  secondaryProductUrl: string;

  // Für WhatsApp-Alarm
  alertType: "hot_lead" | "standard_lead";
  alertMessage: string;

  // Für E-Mail-Versand
  emailSubject: string;
  emailBody: string;
}

function buildEmailBody(result: AnalysisResult): string {
  const primaryName = PRODUCT_NAMES[result.primaryProduct] || "Elternschutzpaket";
  const primaryUrl = PRODUCT_URLS[result.primaryProduct] || "https://www.rebellsystem.de";

  let body = `Hallo,\n\nHier ist deine vollständige Fallanalyse von Rebell mit Herz:\n\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `DEINE EINORDNUNG\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `${result.summary}\n\n`;

  if (result.riskNote) {
    body += `⚠️ WORAUF ES ANKOMMT\n`;
    body += `${result.riskNote}\n\n`;
  }

  if (result.detailBlocks && result.detailBlocks.length > 0) {
    result.detailBlocks.forEach((block) => {
      body += `📋 ${block.title.toUpperCase()}\n`;
      block.items.forEach((item) => {
        body += `• ${item}\n`;
      });
      body += `\n`;
    });
  }

  body += `💡 NÄCHSTER SCHRITT\n`;
  body += `${result.nextStep}\n\n`;

  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `EMPFOHLENE UNTERSTÜTZUNG\n`;
  body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  body += `${primaryName}\n`;
  body += `👉 ${primaryUrl}\n\n`;

  if (result.isComplex) {
    body += `Da dein Fall komplex ist, empfehle ich dir auch ein kostenloses 10-Minuten-Gespräch:\n`;
    body += `📅 https://calendly.com/rebellmitherz/rebellsystem\n\n`;
  }

  body += `Bei Fragen bin ich per WhatsApp erreichbar:\n`;
  body += `💬 https://wa.me/4915253482954\n\n`;
  body += `Herzliche Grüße,\nRebell mit Herz\n`;
  body += `www.rebellsystem.de\n`;

  return body;
}

function buildAlertMessage(email: string, result: AnalysisResult): string {
  const primaryName = PRODUCT_NAMES[result.primaryProduct] || "Elternschutzpaket";
  const isHot = result.isComplex || ["durchsetzung", "gutachten", "komplexe_situation"].includes(result.problemType);

  let msg = isHot ? `🔥 HEISSER LEAD!\n\n` : `📩 Neuer Lead\n\n`;
  msg += `E-Mail: ${email}\n`;
  msg += `Fall-Typ: ${result.problemType}\n`;
  msg += `Komplex: ${result.isComplex ? "Ja" : "Nein"}\n`;
  msg += `Empfehlung: ${primaryName}\n\n`;
  msg += `Zusammenfassung:\n${result.summary.substring(0, 200)}${result.summary.length > 200 ? "…" : ""}\n\n`;
  msg += `Nächster Schritt des Nutzers:\n${result.nextStep.substring(0, 150)}${result.nextStep.length > 150 ? "…" : ""}`;

  return msg;
}

export async function sendToMakeWebhook(email: string, result: AnalysisResult): Promise<void> {
  const isHot = result.isComplex || ["durchsetzung", "gutachten", "komplexe_situation"].includes(result.problemType);
  const primaryName = PRODUCT_NAMES[result.primaryProduct] || "Elternschutzpaket";
  const primaryUrl = PRODUCT_URLS[result.primaryProduct] || "https://www.rebellsystem.de";
  const secondaryName = PRODUCT_NAMES[result.secondaryProduct] || primaryName;
  const secondaryUrl = PRODUCT_URLS[result.secondaryProduct] || primaryUrl;

  const payload: WebhookPayload = {
    // Lead-Daten
    email,
    timestamp: new Date().toISOString(),
    source: "herzensweg-fallcheck",

    // Analyse
    problemType: result.problemType,
    isComplex: result.isComplex ?? false,
    summary: result.summary,
    riskNote: result.riskNote || "",
    nextStep: result.nextStep,

    // Produkte
    primaryProductName: primaryName,
    primaryProductUrl: primaryUrl,
    secondaryProductName: secondaryName,
    secondaryProductUrl: secondaryUrl,

    // WhatsApp-Alarm
    alertType: isHot ? "hot_lead" : "standard_lead",
    alertMessage: buildAlertMessage(email, result),

    // E-Mail
    emailSubject: `Deine Fallanalyse von Rebell mit Herz – ${primaryName}`,
    emailBody: buildEmailBody(result),
  };

  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Webhook-Fehler still ignorieren – kein Funnel-Abbruch
    console.warn("[Make Webhook] Fehler beim Senden:", err);
  }
}
