import React from 'react'
import './Spinner.css'
interface Props {
  width?: string
}
const Spinner: React.FC<Props> = () => {
  return (
    <div className='w-full m-auto'>
      <svg className='spineer' viewBox="25 25 50 50">
        <circle r="10" cy="50" cx="50"></circle>
      </svg>
    </div>
  )
}

export default Spinner