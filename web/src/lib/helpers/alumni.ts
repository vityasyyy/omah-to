export type Alumni = {
  name: string
  slug?: string
  title: string
  description: string
  division?:
    | 'frontend'
    | 'backend'
    | 'uiux'
    | 'mobapps'
    | 'cysec'
    | 'dsai'
    | 'gamedev'
    | 'cp'
  education: string
  main?: true
}
/**
 * array of alumni objects
 * @param {string} slug - name of image relative to /assets/alumni/ (fallback to 'placeholder' if not provided)
 * @param {boolean} main - if true, the alumni will show up on the landing page, else it will show up on the career match up results page
 */

export const ALUMNI: Alumni[] = [
  // LANDING PAGE ALUMNI
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  {
    name: 'Sabrina Anggraini',
    slug: 'sabrina-anggraini',
    title: 'Co-founder Natuno Design Lab',
    division: 'uiux',
    description:
      'Seorang pakar UI/UX yang telah membentuk standar desain digital dengan pengalaman lebih dari lima tahun. Ia tidak hanya mengembangkan produk berbasis riset dan usability testing, tetapi juga membimbing desainer melalui kursus UX, serta membagikan wawasan di Dribbble dan Medium, membantu membentuk generasi baru desainer yang lebih inovatif.',
    education: 'CS12 | Universitas Gadjah Mada',
    main: true,
  },
  {
    name: 'Mario Adriel Gosal',
    slug: 'mario-adriel',
    title: 'Product Manager',
    division: 'dsai',
    description:
      'Sebagai Product Manager di tiket.com, Mario berperan dalam mengembangkan fitur inovatif yang meningkatkan pengalaman jutaan pengguna dalam industri perjalanan dan perhotelan. Dengan latar belakang yang kuat dalam data science dan business analytics, ia terus mengoptimalkan layanan berbasis teknologi untuk membuat perjalanan lebih mudah dan nyaman.',
    education: 'CS18 | Universitas Gadjah Mada',
    main: true,
  },
  {
    name: 'Kevin (Joe) Jonathan',
    slug: 'placeholder',
    title: 'Founder of Jojobug',
    description:
      'Pendiri Jojobug, startup yang menghadirkan solusi teknologi untuk otomatisasi dan optimasi proses bisnis. Dengan visinya, Kevin menciptakan sistem yang lebih efisien dan mudah diakses oleh berbagai industri, mendorong digitalisasi di sektor bisnis untuk meningkatkan produktivitas.',
    education: 'Universitas Gadjah Mada',
    main: true,
  },
  {
    name: 'Alvin Januar Ramadan',
    slug: 'alvin-januar',
    title: 'Software Engineer',
    division: 'frontend',
    description:
      'Sebagai Software Engineer di Gojek, Alvin berkontribusi dalam membangun dan mengoptimalkan sistem yang mendukung layanan transportasi, pembayaran, dan logistik bagi jutaan pengguna. Karyanya memastikan layanan yang lebih cepat, aman, dan efisien di ekosistem Gojek.',
    education: 'CS18 | Universitas Gadjah Mada',
    main: true,
  },
  {
    name: 'Arief Pujo Arianto',
    slug: 'arief-pujo',
    title: 'AI Engineer',
    division: 'dsai',
    description:
      'AI Engineer di Pinhome yang mengembangkan teknologi kecerdasan buatan untuk membantu jutaan orang menemukan properti ideal dengan lebih cepat dan akurat. Dengan AI yang ia kembangkan, pengalaman pencarian properti menjadi lebih personal dan efisien.',
    education: 'CS18 | Universitas Gadjah Mada',
    main: true,
  },
  {
    name: 'Muhammad Pramadika',
    slug: 'placeholder',
    title: 'Co-Founder Signal4G Trading & Research',
    division: 'backend',
    description:
      'Sebagai Co-Founder Signal4G Trading & Research, ia mengembangkan solusi berbasis data untuk membantu investor dan trader mengambil keputusan yang lebih cerdas dalam pasar keuangan, membuktikan bagaimana teknologi dapat mengubah cara orang berinvestasi.',
    education: 'CS16 | Universitas Gadjah Mada',
    main: true,
  },
  {
    name: 'Caroline Chan',
    slug: 'caroline-chan',
    title: 'iOS Developer',
    division: 'mobapps',
    description:
      'Sebagai iOS Developer di Apple Developer Academy @ Infinite Learning, Caroline mengembangkan aplikasi iOS inovatif yang mengoptimalkan pengalaman pengguna. Ia juga terlibat dalam penerapan teknologi terbaru dalam ekosistem Apple, membantu menciptakan aplikasi yang lebih interaktif dan user-friendly.',
    education: 'CS19 | Universitas Gadjah Mada',
    main: true,
  },
  {
    name: 'Angger Dillah K.',
    slug: 'angger-dillah',
    title: 'UX Researcher',
    division: 'uiux',
    description:
      'Senior UX Researcher di DELOS yang memastikan produk teknologi lebih intuitif dan sesuai dengan kebutuhan pengguna. Dengan pendekatan berbasis data, ia membantu membangun pengalaman digital yang lebih baik dan lebih inklusif bagi pengguna di berbagai industri.',
    education: 'Universitas Gadjah Mada',
    main: true,
  },
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  // FRONTEND
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  {
    name: 'Andreas Kevin Rahman',
    slug: 'placeholder',
    title: 'Software Developer',
    division: 'frontend',
    description:
      'Seorang Software Developer di Indomaret Group dengan pengalaman dalam pengembangan sistem dan aplikasi untuk mendukung operasional bisnis ritel. Mengoptimalkan teknologi untuk meningkatkan efisiensi dan pengalaman pengguna dalam ekosistem digital Indomaret.',
    education: 'CS17 | Universitas Gadjah Mada',
  },
  {
    name: 'Daniel Suranta Sitepu',
    slug: 'placeholder',
    title: 'Frontend Engineer',
    division: 'frontend',
    description:
      'Frontend Engineer di Tiket.com yang mengembangkan antarmuka pengguna yang responsif dan menarik. Berfokus pada teknologi web modern untuk memastikan pengalaman pengguna optimal.',
    education: 'CS18 | Universitas Gadjah Mada',
  },
  {
    name: 'Vidiskiu Fortino Kurniawan',
    slug: 'placeholder',
    title: 'VP of Engineering',
    division: 'frontend',
    description:
      'Seorang VP of Engineering di Bukit Vista Hospitality Services, sebuah perusahaan yang menggabungkan teknologi dengan industri perhotelan untuk mengoptimalkan manajemen properti dan pengalaman tamu. Berperan dalam pengembangan solusi digital berbasis data untuk meningkatkan efisiensi operasional, otomatisasi proses, serta inovasi layanan di sektor hospitality.',
    education: 'CS16 | Universitas Gadjah Mada',
  },
  // MOBILE APPS
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  {
    name: 'Prabowo Wahyu Sudarno',
    slug: 'placeholder',
    title: 'Mobile Android Developer',
    division: 'mobapps',
    description:
      'Mobile Android Developer dengan pengalaman di Mamikos dan Astra, berfokus pada pengembangan aplikasi Android. Mengembangkan fitur dan meningkatkan performa aplikasi untuk pengalaman pengguna yang lebih baik.',
    education: 'CS14 | Universitas Gadjah Mada',
  },
  {
    name: 'Hadi Fahriza',
    slug: 'placeholder',
    title: 'Mobile App Developer',
    division: 'mobapps',
    description:
      'Mobile App Developer di CAD-IT Consultants (ASIA) Pte Ltd yang berpengalaman dalam pengembangan aplikasi lintas platform. Berkontribusi dalam membangun solusi mobile yang inovatif dan efisien.',
    education: 'CS16 | Universitas Gadjah Mada',
  },
  // UI/UX
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  {
    name: 'Ken Bima Satria Gandasasmita',
    slug: 'placeholder',
    title: 'UX Champion',
    division: 'uiux',
    description:
      'Pemenang 1st UX Challenge - 4C National Competition dan finalis GEMASTIK XVII User Experience Design. Berprestasi di berbagai kompetisi UX tingkat nasional, membuktikan kemampuannya dalam merancang solusi digital yang inovatif dan berorientasi pengguna.',
    education: 'CS23 | Universitas Gadjah Mada',
  },
  {
    name: 'Nadia Hasna Azzahra',
    slug: 'placeholder',
    title: 'UX & Product Design Enthusiast',
    division: 'uiux',
    description:
      'Runner-up TECHFEST UI/UX Competition dan finalis GEMASTIK XVI 2023 dalam kategori Desain Pengalaman Pengguna. Aktif dalam berbagai kompetisi UX tingkat nasional, menunjukkan keahliannya dalam merancang solusi digital yang inovatif dan berpusat pada pengguna.',
    education: 'CS21 | Universitas Gadjah Mada',
  },
  {
    name: 'Gabriella Christina Kandinata',
    slug: 'placeholder',
    title: 'Product Designer',
    division: 'uiux',
    description:
      'Seorang Product Designer di Fairatmos, sebelumnya UI/UX Engineer di Momentree. Berpengalaman dalam merancang solusi digital yang berorientasi pada pengguna, dengan keahlian dalam desain antarmuka, pengalaman pengguna, dan pengembangan produk berbasis riset.',
    education: 'Universitas Gadjah Mada',
  },
  // BACKEND
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  {
    name: 'Patrick Aura Wibawa',
    slug: 'placeholder',
    title: 'Backend Developer',
    division: 'backend',
    description:
      'Pernah menjadi Backend Developer di Tokopedia yang membangun serta mengelola sistem backend berskala besar. Mengoptimalkan performa server agar layanan tetap cepat dan stabil.',
    education: 'CS16 | Universitas Gadjah Mada',
  },
  {
    name: 'Putra Perdana Haryana',
    slug: 'placeholder',
    title: 'Backend Engineer',
    division: 'backend',
    description:
      'Backend Engineer dengan pengalaman di GRUNDFOS, SMEsHub, dan Warkum, berfokus pada pengembangan sistem backend yang efisien. Memiliki keahlian dalam membangun infrastruktur digital untuk berbagai industri.',
    education: 'CS15 | Universitas Gadjah Mada',
  },
  {
    name: 'Josua Aditya Mustiko',
    slug: 'placeholder',
    title: 'Software Engineer',
    division: 'backend',
    description:
      'Seorang Software Engineer di Xendit dan Tiket.com yang mengembangkan solusi backend untuk sistem pembayaran dan layanan digital. Menjamin keandalan serta keamanan data dalam transaksi online.',
    education: 'CS15 | Universitas Gadjah Mada',
  },
  {
    name: 'Ikhsan Permadi Kusumah',
    slug: 'placeholder',
    title: 'Lead Backend Engineer',
    division: 'backend',
    description:
      'Lead Backend Engineer yang menangani arsitektur sistem backend dan memimpin tim pengembang. Bertanggung jawab atas skalabilitas serta efisiensi sistem backend perusahaan.',
    education: 'CS10 | Universitas Gadjah Mada',
  },
  // DATA SCIENCE & AI
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  {
    name: 'Nabila Yumna',
    slug: 'placeholder',
    title: 'Data Science Enthusiast',
    division: 'dsai',
    description:
      'Pemenang 1st Honorable Mention Data Mining Competition dan Juara 1 Scientific Writing Competition. Berprestasi dalam berbagai kompetisi data science dan penelitian, termasuk 3rd Winner Data Royale Competition. Memiliki pengalaman dalam pengembangan sistem klasifikasi pakaian menggunakan Deep Learning dan Expert Systems, serta optimalisasi pencarian e-commerce berbasis Deep Learning dan Clustering.',
    education: 'CS23 | Universitas Gadjah Mada',
  },
  {
    name: 'Muhammad Dafa Wisnu Galih',
    slug: 'placeholder',
    title: 'Data Analytics & Mining Enthusiast',
    division: 'dsai',
    description:
      'Pemenang 1st Data Competition – ISFEST UMN dan 2nd Winner Datathon Final Stage – RISTEK Datathon UI. Finalis Data Analytics Dash – COMPFEST 16 UI dan Data Mining Division – GEMASTIK XVII. Berpengalaman dalam analisis data, eksplorasi pola, dan pengolahan informasi untuk solusi berbasis data.',
    education: 'CS22 | Universitas Gadjah Mada',
  },
  {
    name: 'Hafid Ambardi',
    slug: 'placeholder',
    title: 'Data Science & AI Enthusiast',
    division: 'dsai',
    description:
      'Pemenang 1st Place RISTEK Datathon Fraud Detection, meraih posisi teratas dalam Overall Team serta Best Metric Evaluation & Kaggle Leaderboard. Juga meraih 2nd Place dalam kategori E-Commerce Search Engine Innovation di RISTEK Datathon. Berpengalaman dalam pengolahan data, machine learning, dan pengembangan sistem berbasis kecerdasan buatan untuk analisis dan optimasi.',
    education: 'CS23 | Universitas Gadjah Mada',
  },
  {
    name: 'Desthalia',
    slug: 'placeholder',
    title: 'Data Division Lead',
    division: 'dsai',
    description:
      'Data Scientist di Widya Analytic yang berfokus pada analisis data untuk menghasilkan wawasan bisnis yang berharga. Mengembangkan model machine learning serta algoritma untuk mengoptimalkan pengolahan data.',
    education: 'CS15 | Universitas Gadjah Mada',
  },
  // GAME DEVELOPMENT
  // ----------------------------------------------------------
  // ----------------------------------------------------------
  {
    name: 'Doni Tan Hero',
    slug: 'placeholder',
    title: 'Game Programer',
    division: 'gamedev',
    description:
      'Game Programmer di Niji Games Studio yang mengembangkan mekanisme permainan serta mengoptimalkan kode. Berfokus pada pemrograman efisien untuk memastikan pengalaman bermain yang lancar.',
    education: 'CS18 | Universitas Gadjah Mada',
  },
]
