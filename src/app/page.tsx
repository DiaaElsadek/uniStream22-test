"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      router.push("/home"); // لو في توكن يروح للصفحة الرئيسية
    } else {
      router.push("/login"); // لو مفيش يروح لصفحة اللوجين
    }
  }, [router]);

  useEffect(() => {
    console.clear();
  }, []);


  return null; // مش محتاج تعرض حاجة هنا
}
