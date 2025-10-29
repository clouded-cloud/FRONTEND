import React from 'react'

const MiniCard = ({title, icon, number, footerNum}) => {
  return (
    <div className='bg-1a1a1a py-1 sm:py-2 px-1 sm:px-2 rounded-lg w-full sm:w-50\% border border-gray-700'>
        <div className='flex items-start justify-between'>
            <h1 className='text-f5f5f5 text-xs sm:text-sm font-semibold tracking-wide'>{title}</h1>
            <button className={`${title === "Total Earnings" ? "bg-green-500" : "bg-blue-500"} p-1 rounded-lg text-f5f5f5 text-base sm:text-lg`}>{icon}</button>
        </div>
        <div>
            <h1 className='text-f5f5f5 text-base sm:text-lg font-bold mt-1 sm:mt-2'>{
              title === "Total Earnings" ? `KSH${number}` : number}</h1>
            <h1 className='text-f5f5f5 text-xs mt-0.5'><span className='text-green-400'>{footerNum}%</span> than yesterday</h1>
        </div>
    </div>
  )
}

export default MiniCard