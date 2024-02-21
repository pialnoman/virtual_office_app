import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  const [currentYear, setCurrentYear] = useState('');
  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);
  return (
    <CFooter fixed={false}>
      <div>
        {/* <a href="./releaseNotes.html" target="_blank" rel="noopener noreferrer">Release Notes</a> */}
        {/* <a href="https://dma.com.bd" target="_blank" rel="noopener noreferrer">Release Notes</a> */}
        <Link to="/dashboard/release-notes">Release Notes</Link>
        <span className="ml-1">&copy; DMA {currentYear}</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <a href="https://dma.com.bd" target="_blank" rel="noopener noreferrer">DMA</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
