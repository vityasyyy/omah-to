
export const SUBTESTS: Record<
  string,
  { title: string; src: string; index: number; description: string }
> = {
  subtest_pu: {
    title: 'Pengetahuan Umum',
    index: 1,
    src: 'pu',
    description:
      'Uji wawasan umummu dengan berbagai pertanyaan tentang dunia, sejarah, dan ilmu pengetahuan.',
  },
  subtest_ppu: {
    title: 'Pengetahuan dan Pemahaman Umum',
    index: 2,
    src: 'ppu',
    description:
      'Tes kemampuan memahami informasi dan wawasan umum dalam berbagai konteks.',
  },
  subtest_pbm: {
    title: 'Pengetahuan Membaca dan Menulis',
    index: 3,
    src: 'pbm',
    description:
      'Uji keterampilan membaca dan menulis untuk memahami dan menyampaikan informasi secara efektif.',
  },
  subtest_pk: {
    title: 'Pengetahuan Kuantitatif',
    index: 4,
    src: 'pk',
    description:
      'Tes pemahaman konsep matematika dasar dan kemampuan analisis kuantitatif.',
  },
  subtest_lbi: {
    title: 'Literasi Bahasa Indonesia',
    index: 5,
    src: 'lbi',
    description:
      'Uji pemahaman dan keterampilan berbahasa Indonesia dalam berbagai situasi komunikasi.',
  },
  subtest_lbe: {
    title: 'Literasi Bahasa Inggris',
    index: 6,
    src: 'lbe',
    description:
      'Tes kemampuan membaca dan memahami teks berbahasa Inggris dalam berbagai konteks.',
  },
  subtest_pm: {
    title: 'Penalaran Matematika',
    index: 7,
    src: 'pm',
    description:
      'Uji kemampuan berpikir logis dan pemecahan masalah melalui soal-soal matematika.',
  },
}