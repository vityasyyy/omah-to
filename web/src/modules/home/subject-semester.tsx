'use client'
import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Container from '@/components/container'
import Heading, { HeadingSpan } from '@/components/home/heading'

const BUTTON_CONTENT_LEFT = [
  {
    label: 'Semester 1',
    subjects: [
      { no: '1', subject: 'Pemrograman', sks: '3' },
      { no: '2', subject: 'Praktikum Pemrograman', sks: '1' },
      { no: '3', subject: 'Logika Informatika', sks: '2' },
      { no: '4', subject: 'Aljabar Linier Fundamental', sks: '2' },
      { no: '5', subject: 'Kalkulus 1', sks: '3' },
      { no: '6', subject: 'Kimia Dasar 1', sks: '3' },
      { no: '7', subject: 'Fisika Dasar 1', sks: '3' },
      { no: '8', subject: 'Bahasa Indonesia', sks: '2' },
      { no: '9', subject: 'Agama', sks: '2' },
    ],
  },
  {
    label: 'Semester 2',
    subjects: [
      { no: '1', subject: 'Algoritma dan Struktur Data', sks: '3' },
      { no: '2', subject: 'Bahasa Inggris', sks: '2' },
      { no: '3', subject: 'Integral dan Persamaan Diferensial', sks: '3' },
      { no: '4', subject: 'Matematika Diskrit', sks: '3' },
      { no: '5', subject: 'Organisasi dan Arsitektur Komputer', sks: '2' },
      { no: '6', subject: 'Pengantar Statistika', sks: '2' },
      { no: '7', subject: 'Sistem Digital', sks: '2' },
      { no: '8', subject: 'Praktikum Algoritma dan Struktur Data', sks: '1' },
      { no: '9', subject: 'Pancasila', sks: '2' },
      { no: '10', subject: 'Kewarganegaraan', sks: '2' },
    ],
  },
  {
    label: 'Semester 3',
    subjects: [
      { no: '1', subject: 'Analisis Algoritma dan Kompleksitas', sks: '3' },
      { no: '2', subject: 'Basis Data', sks: '3' },
      { no: '3', subject: 'Jaringan Komputer', sks: '2' },
      { no: '4', subject: 'Kecerdasan Artifisial', sks: '3' },
      { no: '5', subject: 'Praktikum Basis Data', sks: '1' },
      { no: '6', subject: 'Praktikum Sistem Komputer dan Jaringan', sks: '1' },
      { no: '7', subject: 'Probabilitas dan Proses Stokastika', sks: '2' },
      { no: '8', subject: 'Sistem Operasi', sks: '2' },
    ],
  },
  {
    label: 'Semester 4',
    subjects: [
      { no: '1', subject: 'Filsafat Ilmu Komputer', sks: '1' },
      { no: '2', subject: 'Pengembangan Startup Digital', sks: '2' },
      { no: '3', subject: 'Metode Rekayasa Perangkat Lunak', sks: '2' },
      {
        no: '4',
        subject: 'Workshop Implementasi Rancangan Perangkat Lunak',
        sks: '2',
      },
      { no: '5', subject: 'Pembelajaran Mesin', sks: '3' },
      { no: '6', subject: 'Bahasa dan Otomata', sks: '3' },
      { no: '7', subject: 'Metode Numerik', sks: '2' },
      { no: '8', subject: 'Kriptografi dan Keamanan Informasi', sks: '3' },
      { no: '9', subject: 'Mata Kuliah Pilihan', sks: '3' },
    ],
  },
]

const BUTTON_CONTENT_RIGHT = [
  {
    label: 'Semester 5',
    subjects: [
      { no: '1', subject: 'Kelas Seminar', sks: '1' },
      { no: '2', subject: 'Metode Penelitian Ilmu Komputer', sks: '2' },
      { no: '3', subject: 'Pembelajaran Mesin Mendalam', sks: '3' },
      { no: '4', subject: 'Proyek Rekayasa Perangkat Lunak', sks: '3' },
      { no: '5', subject: 'Mata Kuliah Pilihan/MBKM', sks: '12' },
    ],
  },
  {
    label: 'Semester 6',
    subjects: [
      { no: '1', subject: 'KKN', sks: '3' },
      { no: '2', subject: 'Mata Kuliah Pilihan/MBKM', sks: '18' },
    ],
  },
  {
    label: 'Semester 7',
    subjects: [
      { no: '1', subject: 'Proposal Skripsi', sks: '2' },
      { no: '2', subject: 'Mata Kuliah Pilihan/MBKM', sks: '13' },
    ],
  },
  {
    label: 'Semester 8',
    subjects: [{ no: '1', subject: 'Skripsi', sks: '6' }],
  },
]

const SubjectSemester = () => {
  const [openSemestersLeft, setOpenSemestersLeft] = useState<number[]>([])
  const [openSemestersRight, setOpenSemestersRight] = useState<number[]>([])

  const toggleSemesterLeft = (index: number) => {
    setOpenSemestersLeft((prevOpen) =>
      prevOpen.includes(index)
        ? prevOpen.filter((i) => i !== index)
        : [...prevOpen, index]
    )
  }

  const toggleSemesterRight = (index: number) => {
    setOpenSemestersRight((prevOpen) =>
      prevOpen.includes(index)
        ? prevOpen.filter((i) => i !== index)
        : [...prevOpen, index]
    )
  }

  return (
    <Container className='mx-auto my-20 flex w-full flex-col px-6 py-8 text-center'>
      <section className='flex flex-col gap-6'>
        <Heading>
          Mata Kuliah yang Akan Membentuk Masa Depanmu di
          <HeadingSpan> Computer Science</HeadingSpan>!
        </Heading>
        <h3 className='text-xl font-normal'>Universitas Gadjah Mada</h3>

        {/* Button Container */}
        <div className='flex w-full flex-col items-start gap-6 overflow-auto lg:grid lg:grid-cols-2'>
          {/* Semester Buttons Left*/}
          <div className='grid w-full gap-6'>
            {BUTTON_CONTENT_LEFT.map((item, index) => {
              const isOpen = openSemestersLeft.includes(index)
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleSemesterLeft(index)}
                    className={`hover:bg-primary-200 bg-primary-100 flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left font-bold text-black shadow-md transition-all ease-in ${isOpen ? 'rounded-t-lg' : 'rounded-md'}`}
                  >
                    <span className='text-lg'>{item.label}</span>
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {/* Semester List Left */}
                  <div
                    className={`border-primary-100 overflow-hidden rounded-b-lg shadow-md transition-all duration-700 ease-in-out ${
                      isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className='border-primary-100 rounded-b-lg border-2 px-4 py-2 shadow-md'>
                      <table className='w-full'>
                        <thead className='border-b-primary-100 border-b-2 text-black'>
                          <tr>
                            <th className='w-[10%] px-4 py-3 text-center'>
                              No
                            </th>
                            <th className='w-[60%] px-4 py-3 text-center'>
                              Mata Kuliah
                            </th>
                            <th className='w-[30%] px-4 py-3 text-center'>
                              SKS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.subjects.map((subject, idx) => (
                            <tr
                              key={idx}
                              className='text-blacktransition hover:bg-gray-200'
                            >
                              <td className='px-4 py-3 text-center'>
                                {subject.no}
                              </td>
                              <td className='px-4 py-3 text-center'>
                                {subject.subject}
                              </td>
                              <td className='px-4 py-3 text-center'>
                                {subject.sks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Semester Buttons Right*/}
          <div className='grid w-full gap-6'>
            {BUTTON_CONTENT_RIGHT.map((item, index) => {
              const isOpen = openSemestersRight.includes(index)
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleSemesterRight(index)}
                    className={`hover:bg-primary-200 bg-primary-100 flex w-full cursor-pointer items-center justify-between px-5 py-3 text-left font-bold text-black shadow-md transition-all ease-in ${isOpen ? 'rounded-t-lg' : 'rounded-md'}`}
                  >
                    <span className='text-lg'>{item.label}</span>
                    <span className='material-symbols-outlined text-xl'>
                      {isOpen ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </button>

                  {/* Semester List Right */}
                  <div
                    className={`border-primary-100 overflow-hidden rounded-b-lg shadow-md transition-all duration-700 ease-in-out ${
                      isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className='border-primary-100 rounded-b-lg border-2 px-4 py-2 text-black shadow-md'>
                      <table className='w-full'>
                        <thead className='border-b-primary-100 border-b-2'>
                          <tr>
                            <th className='w-[10%] px-4 py-3 text-center'>
                              No
                            </th>
                            <th className='w-[60%] px-4 py-3 text-center'>
                              Mata Kuliah
                            </th>
                            <th className='w-[30%] px-4 py-3 text-center'>
                              SKS
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.subjects.map((subject, idx) => (
                            <tr
                              key={idx}
                              className='text-black transition hover:bg-gray-200'
                            >
                              <td className='px-4 py-3 text-center'>
                                {subject.no}
                              </td>
                              <td className='px-4 py-3 text-center'>
                                {subject.subject}
                              </td>
                              <td className='px-4 py-3 text-center'>
                                {subject.sks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </Container>
  )
}

export default SubjectSemester
