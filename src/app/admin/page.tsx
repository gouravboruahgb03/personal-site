import { redirect } from "next/navigation";

// The admin home just sends you straight to the writing page — that's where
// you'll spend your time. The top menu bar handles jumping to "My posts".
export default function AdminPage() {
  redirect("/admin/write");
}
