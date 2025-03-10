import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; 

const ReadyPath = () => {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        
            {/* Robot Image */}
            <div className="mt-8 flex justify-center">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64">
            <Image
              src="/robot.png" 
              alt="Robot Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3x">
          Siap <span className='text-[#304A91]'>menemukan</span>  dan  
          <span className='text-[#304A91]'> menemukan</span> jalurmu?
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xl text-black">
          Temukan Potensimu, Rancang Masa Depanmu!
        </p>

        {/* Button */}
        <div className="mt-8">
          <Link href="/daftar" passHref>
            <Button size={`lg`} className="bg-[#304A91] hover:bg-[#304A91]/90">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReadyPath;