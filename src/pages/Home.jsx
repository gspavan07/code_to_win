import React from 'react'
import Navbar from '../components/Navbar';
import RankingTable from '../components/Ranking';
import Login  from '../pages/Login'
function Home() {
  return (
      <div>
          <Navbar />
          <div className='grid grid-cols-5 '>
              <div className='col-span-3'> 
                  <h1 className='text-7xl text-blue-800 font-bold text-center mt-10'> ADITYA UNVERSITY</h1>
                  <div className='flex justify-center items-center py-10'> <RankingTable filter={false}/>
                  </div>
              </div>
              <div className='col-span-2'>
                  <Login/>
              </div>
          </div>
    </div>
  )
}
export default Home;