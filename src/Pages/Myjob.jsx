import CreateApplication from '@/components/CreateApplication';
import CreateMyjob from '@/components/CreateMyjob';
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { BarLoader } from 'react-spinners';

const Myjob = () => {
  const {user,isLoaded}=useUser()

   if (!isLoaded) {
    return (
      <BarLoader size={150} width="100%" color="#69D2E7 " className="mb-4" />
    );
  }
  return (
    <div>
      <h1 className='gradient-title  font-extrabold text-center text-5xl md:7xl mb-10'>{
        user?.unsafeMetadata?.role==="Candidate"?"My Application":"My Jobs"}</h1>
        {
          user?.unsafeMetadata?.role==="Candidate"?<CreateApplication/>:<CreateMyjob/>
        }
    </div>
  )
}

export default Myjob
