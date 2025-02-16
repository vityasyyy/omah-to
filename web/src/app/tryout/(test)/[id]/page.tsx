import StyledCard from '@/components/tryout/styled-card'
import AnswerCard from '@/modules/tryout/answer-card'

const TryoutPage = () => {
  return (
    <main className='grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3'>
      <StyledCard title='Soal' className='md:col-span-2'>
        Lorem ipsum dolor sit amet consectetur. Scelerisque ac posuere feugiat
        sed amet egestas. Pellentesque non scelerisque nisl tincidunt mattis
        auctor morbi auctor. Elit auctor arcu volutpat rhoncus ut. Malesuada
        faucibus neque lectus varius mattis pretium. Lorem ipsum dolor sit amet
        consectetur. Scelerisque ac posuere feugiat sed amet egestas.
        Pellentesque non scelerisque nisl tincidunt mattis auctor morbi auctor.
        Elit auctor arcu volutpat rhoncus ut. Malesuada faucibus neque lectus
        varius mattis pretium. 
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur. Scelerisque ac posuere feugiat
        sed amet egestas. Pellentesque non scelerisque nisl tincidunt mattis
        auctor morbi auctor. Elit auctor arcu volutpat rhoncus ut. Malesuada
        faucibus neque lectus varius mattis pretium. Lorem ipsum dolor sit amet
        consectetur. Scelerisque ac posuere feugiat sed amet egestas.
        Pellentesque non scelerisque nisl tincidunt mattis auctor morbi auctor.
        Elit auctor arcu volutpat rhoncus ut. Malesuada faucibus neque lectus
        varius mattis pretium. 
        <br />
        <br />
        Lorem ipsum dolor sit amet consectetur. Scelerisque ac posuere feugiat
        sed amet egestas. Pellentesque non scelerisque nisl tincidunt mattis
        auctor morbi auctor. Elit auctor arcu volutpat rhoncus ut. Malesuada
        faucibus neque lectus varius mattis pretium. Lorem ipsum dolor sit amet
        consectetur. Scelerisque ac posuere feugiat sed amet egestas.
        Pellentesque non scelerisque nisl tincidunt mattis auctor morbi auctor.
        Elit auctor arcu volutpat rhoncus ut. Malesuada faucibus neque lectus
        varius mattis pretium. 
        <br />
        <br />
      </StyledCard>
      <AnswerCard variant='choice' />
    </main>
  )
}

export default TryoutPage
