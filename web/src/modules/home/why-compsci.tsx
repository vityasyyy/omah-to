import BoldUnderline from '@/components/bold-underline'
import Container from '@/components/container'
import { Bold } from 'lucide-react'

type sideType = 'left' | 'right'
const CARD_CONTENT = [
  {
    title: <>80%</>,
    description: (
      <>Perusahaan IT menawarkan Remote Work, memberikan fleksibilitas kerja.</>
    ),
  },
  {
    title: <>25%</>,
    description: (
      <>
        Pekerjaan di bidang Computer Science tumbuh <strong>lebih cepat</strong>{' '}
        daripada semua industri lainnya.
      </>
    ),
  },
  {
    title: <>$80K+/Tahun</>,
    description: (
      <>
        Computer Science adalah jalur terbaik menuju gaji tinggi dengan peluang
        global dan karier —bahkan di usia muda!
      </>
    ),
  },
  {
    title: <>55%</>,
    description: (
      <>
        Startup teknologi didirikan oleh lulusan Computer Science dan kamu bisa
        memulainya hanya dengan laptop.
      </>
    ),
  },
]
const CHAT_CONTENT = [
  {
    side: 'left' as sideType,
    text: (
      <>
        Lebih dari sekadar coding, Computer Science mengajarkan{' '}
        <BoldUnderline>
          {' '}
          logika, problem-solving, dan pola pikir sistematis
        </BoldUnderline>{' '}
        yang dapat diterapkan di berbagai aspek kehidupan.
      </>
    ),
  },
  {
    side: 'right' as sideType,
    text: (
      <>
        Mengenal <BoldUnderline> lebih dekat cara kerja </BoldUnderline>dunia
        digital yang kamu gunakan setiap hari.
      </>
    ),
  },
  {
    side: 'left' as sideType,
    text: (
      <>
        <BoldUnderline> Mix and match minatmu</BoldUnderline> dengan Computer
        Science untuk membawa inovasi seru yang bisa mengubah dunia!
      </>
    ),
  },
  {
    side: 'right' as sideType,
    text: (
      <>
        Hanya dengan ide brilian dan logika tajam, kamu bisa{' '}
        <BoldUnderline> menciptakan sesuatu dari nol</BoldUnderline>!
      </>
    ),
  },
]

const WhyCompsci = () => {
  return (
    <Container className='my-8 gap-12 md:gap-16 items-center lg:items-start lg:flex-row-reverse'>
      <section className='flex flex-col gap-8'>
        <h1 className='text-2xl font-bold lg:text-3xl'>
          Kenapa <span className='text-primary-500'> Computer Science </span>
          bisa jadi tiket menuju masa depanmu?
        </h1>
        <main className='flex flex-col gap-4'>
          {CHAT_CONTENT.map((content, i) => (
            <ChatBubble key={i} side={content.side} text={content.text} />
          ))}
        </main>
      </section>
      <Card />
    </Container>
  )
}

const ChatBubble = ({
  side = 'left',
  text,
}: {
  side: sideType
  text: string | React.ReactNode
}) => (
  <main
    className={`text-primary-new-500 shadow-primary-new-200/40 w-full max-w-[80%] rounded-t-lg border-2 border-neutral-200 p-3 text-sm shadow-lg lg:max-w-[66%] ${side === 'left' ? 'self-start rounded-br-lg' : 'self-end rounded-bl-lg'}`}
  >
    {text}
  </main>
)

const Card = () => {
  return (
    <main className='border-primary-new-500 shadow-primary-new-200 flex w-[75vw] mx-8 rotate-x-15 rotate-y-15 -rotate-z-10 flex-col gap-4 rounded-xl border-4 p-8 shadow-2xl lg:ml-8 max-w-sm'>
      {CARD_CONTENT.map((content, i) => (
        <div key={i} className='w-fit'>
          <h1 className='text-primary-new-400 text-xl font-bold md:text-2xl'>
            {content.title}
          </h1>
          <p className='text-sm font-light text-black md:text-base'>
            {content.description}
          </p>
        </div>
      ))}
    </main>
  )
}

export default WhyCompsci
