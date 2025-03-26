export const ALUMNI: Alumni[] = [
  {
    name: 'Fahmi Shampoerna',
    img: 'avatar',
    title: 'Full Stack Engineer',
    division: 'frontend',
    description: 'Suka ngoding, suka nongki, suka nongkrong',
    education: 'CS23 | Universitas Gadjah Mada',
  },
  {
    name: 'Ayasha Rahmadinni',
    img: 'avatar',
    title: 'Full Stack Engineer',
    division: 'backend',
    description: 'Suka ngoding, suka nongki, suka nongkrong',
    education: 'CS24 | Universitas Gadjah Mada',
  },
  {
    name: 'Ken Bima',
    img: 'avatar',
    title: 'CEO OmahTI 24/25',
    division: 'uiux',
    description: 'Suka ngoding, suka nongki, suka nongkrong',
    education: 'CS23 | Universitas Gadjah Mada',
  },
  {
    name: 'Dewi Prasetyo',
    img: 'avatar',
    title: 'Tukang Troll',
    division: 'mobapps',
    description: 'Suka ngoding, suka nongki, suka nongkrong',
    education: 'CS23 | Universitas Gadjah Mada',
  },
]

export type Alumni = {
  name: string
  img: string
  title: string
  description: string
  division?: 'frontend' | 'backend' | 'uiux' | 'mobapps' | 'cysec' | 'dsai' | 'gamedev' | 'cp'
  education: string
}
