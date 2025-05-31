import React, { ComponentType } from 'react';
import Header from './Header';
import Footer from './Footer';




const withMainComponent = <P extends object>(
  WrappedComponent: ComponentType<P>
) =>
  class extends React.Component<P> {
    render() {
      const { ...props } = this.props;
      return (<>
        <main className=' w-full overflow-x-hidden pl-24 md:pl-56  min-h-[93vh] min-w-[508px]'>
          <Header />
          <WrappedComponent {...props as P} />
        </main>
        <footer className='pl-56'>

          <Footer />
        </footer>
      </>
      );
    }
  };

export default withMainComponent;