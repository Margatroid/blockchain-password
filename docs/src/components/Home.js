import React from 'react';

const Home = ({store}) => {
  return <div>
    <section className='hero is-primary'>
      <div className='hero-body'>
        <div className='container'>
          <h1 className='title'>
            Blockchain Password
          </h1>
          <h2 className='subtitle'>
            Open source experimental password manager built on the Ethereum blockchain.
          </h2>
        </div>
      </div>
    </section>

    <section className='section'>
      <a onClick={store.deployNewVault} className='button is-primary'>Deploy new vault</a>
    </section>
  </div>
};

export default Home;
