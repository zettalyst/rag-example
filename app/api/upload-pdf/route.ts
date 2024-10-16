import { NextRequest, NextResponse } from "next/server";
import { loadPDFAndStore } from "@/lib/pdfLoader";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("pdf") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const tempFilePath = path.join(process.cwd(), "tmp", file.name);
  // if directory not exists, create it
  if (!fs.existsSync(path.join(process.cwd(), "tmp"))) {
    fs.mkdirSync(path.join(process.cwd(), "tmp"));
  } 
  await writeFile(tempFilePath, buffer);

  try {
    await loadPDFAndStore(tempFilePath, "pdf_collection");
    return NextResponse.json({ message: "PDF successfully uploaded and processed" });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({ error: "Error processing PDF" }, { status: 500 });
  }
}
