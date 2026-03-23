"use client";
import Image from "next/image";
import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">

      <FileUpload />
    </div>
  );
}
