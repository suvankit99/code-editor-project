import React, { useState } from 'react'

const Editor = () => {
  const [clientList, setclientList] = useState([{}])
  return (
    <div className='main-page'>
      <div className='side-drawer'>
          <div >

          </div>
          <div className='display-clients'>

          </div>
          <div className=''>

          </div>
      </div>
      <div className='editor-area'>

      </div>
    </div>
  )
}

export default Editor