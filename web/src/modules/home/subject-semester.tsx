"use client";
import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from 'lucide-react'
import Container from "@/components/container"

const BUTTON_CONTENT_LEFT = [
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
];

const BUTTON_CONTENT_RIGHT = [
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
      { no: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
];

const SubjectSemester = () => {
  const [openSemestersLeft, setOpenSemestersLeft] = useState<number[]>([]);
  const [openSemestersRight, setOpenSemestersRight] = useState<number[]>([]);


  const toggleSemesterLeft = (index: number) => {
    setOpenSemestersLeft((prevOpen) =>
      prevOpen.includes(index)
        ? prevOpen.filter((i) => i !== index)
        : [...prevOpen, index]
    );
  };

  const toggleSemesterRight = (index: number) => {
    setOpenSemestersRight((prevOpen) =>
      prevOpen.includes(index)
        ? prevOpen.filter((i) => i !== index)
        : [...prevOpen, index]
    );
  };

  return (
    <Container className="flex my-20 w-full flex-col py-8 px-6 text-center mx-auto">
      <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold lg:text-3xl">
          Mata Kuliah yang Akan Membentuk Masa Depanmu di
          <span className="text-primary-700"> Computer Science</span>!
        </h1>
        <h3 className="text-xl font-bold">Universitas Gadjah Mada</h3>

        {/* Button Container */}
        <div className="flex flex-col items-start lg:grid lg:grid-cols-2 gap-6 w-full overflow-auto">
          {/* Semester Buttons Left*/}
          <div className="grid gap-6 w-full">
            {BUTTON_CONTENT_LEFT.map((item, index) => {
              const isOpen = openSemestersLeft.includes(index);
              return(
                <div key={index}>
                  <button
                    onClick={() => toggleSemesterLeft(index)}
                    className={`hover:bg-primary-200 cursor-pointer ease-in flex items-center justify-between w-full bg-primary-100 
                      text-black font-bold py-3 px-5 text-left shadow-md transition-all ${isOpen ? "rounded-t-lg" : "rounded-md"}`}>
                    <span className="text-lg">{item.label}</span>
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {/* Semester List Left */}
                  <div 
                    className={`overflow-hidden shadow-md border-primary-100 transition-all rounded-b-lg duration-700 ease-in-out ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="rounded-b-lg px-4 py-2 border-primary-100 border-2 shadow-md">
                      <table className="w-full">
                        <thead className="border-b-2 border-b-primary-100 text-black">
                          <tr>
                            <th className="w-[10%] px-4 py-3 text-center">No</th>
                            <th className="w-[60%] px-4 py-3 text-center">Mata Kuliah</th>
                            <th className="w-[30%] px-4 py-3 text-center">SKS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.subjects.map((subject, idx) => (
                            <tr key={idx}
                              className="hover:bg-gray-200 text-blacktransition">
                              <td className="px-4 py-3 text-center">
                                {subject.no}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {subject.subject}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {subject.sks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Semester Buttons Right*/}
          <div className="grid gap-6 w-full">
            {BUTTON_CONTENT_RIGHT.map((item, index) => {
              const isOpen = openSemestersRight.includes(index);
              return(
                <div key={index}>
                  <button
                    onClick={() => toggleSemesterRight(index)}
                    className={`hover:bg-primary-200 cursor-pointer ease-in flex items-center justify-between w-full bg-primary-100 
                      text-black font-bold py-3 px-5 text-left shadow-md transition-all ${isOpen ? "rounded-t-lg" : "rounded-md"}`}>
                    <span className="text-lg">{item.label}</span>
                    <span className="material-symbols-outlined text-xl">
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </button>

                  {/* Semester List Right */}
                  <div 
                    className={`overflow-hidden shadow-md border-primary-100 transition-all rounded-b-lg duration-700 ease-in-out ${
                      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="rounded-b-lg px-4 py-2 border-primary-100 border-2 shadow-md text-black">
                      <table className="w-full">
                        <thead className="border-b-2 border-b-primary-100">
                          <tr>
                            <th className="w-[10%] px-4 py-3 text-center">No</th>
                            <th className="w-[60%] px-4 py-3 text-center">Mata Kuliah</th>
                            <th className="w-[30%] px-4 py-3 text-center">SKS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.subjects.map((subject, idx) => (
                            <tr key={idx}
                              className="hover:bg-gray-200 text-black transition">
                              <td className="px-4 py-3 text-center">
                                {subject.no}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {subject.subject}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {subject.sks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Container>
  );
};

export default SubjectSemester;