"use client";
import { useEffect, useState } from "react";

const BUTTON_CONTENT = [
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
  {
    label: "Semester X",
    subjects: [
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
      { code: "0X", subject: "Mata Kuliah", sks: "X" },
    ],
  },
];

const SubjectSemester = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
    document.head.appendChild(link);
  }, []);

  const [openSemesters, setOpenSemesters] = useState<number[]>([]);

  const toggleSemester = (index: number) => {
    setOpenSemesters((prevOpen) =>
      prevOpen.includes(index)
        ? prevOpen.filter((i) => i !== index)
        : [...prevOpen, index]
    );
  };

  return (
    <div className="flex w-full flex-col py-8 px-6 text-right mx-auto">
      <section className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold lg:text-3xl">
          Mata Kuliah yang Akan Membentuk Masa Depanmu di
          <span className="text-primary-500"> Computer Science</span>!
        </h1>
        <h3 className="text-xl font-bold">Universitas Gadjah Mada</h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
          {BUTTON_CONTENT.map((item, index) => {
            const isOpen = openSemesters.includes(index);
            return (
              <div key={index} className="w-full">
                <button
                  onClick={() => toggleSemester(index)}
                  className="ease-in flex items-center justify-between w-full rounded-md bg-[#304A91] text-white font-bold py-3 px-5 text-left shadow-md hover:bg-[#2b3e75] transition-all"
                >
                  <span className="text-lg">{item.label}</span>
                  <span className="material-symbols-outlined text-xl">
                    {isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                  </span>
                </button>

                <div
                  className={`overflow-hidden shadow-md border-[#304A91] transition-all duration-700 ease-in-out ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="rounded-md p-4 mt-2 border-[#304A91] border-2 shadow-md">
                    <table className="w-full">
                      <thead className="border-b-2 border-b-[#304A91] text-[#304A91]">
                        <tr>
                          <th className="w-[10%] px-4 py-3 text-center">No</th>
                          <th className="w-[60%] px-4 py-3 text-center">
                            Mata Kuliah
                          </th>
                          <th className="w-[30%] px-4 py-3 text-center">SKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.subjects.map((subject, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-gray-200 text-[#304A91] transition"
                          >
                            <td className="px-4 py-3 text-center">
                              {subject.code}
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
      </section>
    </div>
  );
};

export default SubjectSemester;
