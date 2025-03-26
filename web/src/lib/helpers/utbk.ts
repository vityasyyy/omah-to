
/**
 * UTBK PERSPECTIVE
 * @param {string} slug - name of image relative to /assets/utbk/ (fallback to 'placeholder' if not provided)
 * @param {number} score - score of the student
 * @param {string} education - education of the student
 * @param {string} description - description of the student
 */

export type UtbkStudent = {
  name: string
  slug: string
  score: number
  education: string
  description: string
}

export const UTBK_STUDENTS: UtbkStudent[] = [
  {
    name: 'Bobby Rahman Hartanto',
    slug: 'placeholder',
    score: 765,
    education: 'CS24 | Universitas Gadjah Mada',
    description:
      'Menurut aku, UTBK kemarin memang perlu persiapan matang sejak jauh-jauh hari. kita harus benar-benar paham basic-basic setiap subtes, terutama PK dan PM karena itu yang paling susah dan jadi subtes pendukung masuk Computer Science. Memang harus maksimal dalam belajar, tapi jangan maksain diri juga karena kesehatan saat utbk tuh yang paling penting supaya kita bisa ngerjain dengan lancar.',
  },
  {
    name: 'Mahardika Ramadhana',
    slug: 'placeholder',
    score: 756,
    education: 'CS24 | Universitas Gadjah Mada',
    description: 'Skor UTBK 2024 untuk Ilmu Komputer benar-benar di luar ekspektasi yaa. Rata-ratanya jauh lebih tinggi dibanding tahun lalu, dengan passing grade mencapai 740. Kalau dilihat dari subtesnya, yang paling perlu diperhatikan itu PK, PM, dan PU, karena pembobotannya ternyata signifikan banget, guys. Jadi, pastikan fokus belajar di tiga subtes itu biar peluang lolosnya makin besar!',
  },
  {
    name: 'Danar Fathurahman',
    slug: 'placeholder',
    score: 759,
    education: 'CS24 | Universitas Gadjah Mada',
    description: 'Sama kayak perang, butuh persiapan, strategi dan evaluasi selama menghadapi UTBK. Perbanyak latihan soal, jaga kesehatan, dan tetap fokus biar makin siap tempur! You can do it guys! Biar lolos, pilihan pertama harus compsci ugm ya xixixi',
  },
]

