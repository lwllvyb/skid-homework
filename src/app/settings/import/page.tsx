import ImportSettingsPage from "@/components/pages/ImportSettingsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting start - Skid Homework",
  description:
    "Getting start with the most powerful open source AI homework solver. Time-saving, no telemetry, free.",
};
export default function ImportSettings() {
  return <ImportSettingsPage />;
}
