import React from 'react';
// import Button from './Button';
import { MdClose } from 'react-icons/md';
// import PopAlert from './Layout/PopAlert';




interface Props {
  title: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<Props> = (props: Props) => {

  const { title, children, open, setOpen } = props;


  return (
    <div
      className={`${open ? 'block' : 'hidden'} fixed inset-0 z-50 overflow-auto bg-[#8080802e]`}
    >

      <div className={`flex flex-col items-center justify-center p-10 bg-slate-100 m-10 rounded`}>
        {/* <PopAlert /> */}
        <div className='flex items-center justify-between w-full border-b-2'>
          <h6 style={{ flexGrow: 1 }}>
            {title}
          </h6>
          <button onClick={()=>{setOpen(false);}} className={`text-white bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center  mr-2 mb-4 `}>
          <MdClose />

    </button>


        </div>
        <div className='mt-4 w-full'>
          <>
            {children}
          </>
        </div>
      </div>
    </div>
  );
}

export default Popup;
