import { useState } from 'react'
import './App.css'
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { MySketch } from './sketch/MySketch';

function App() {

  return (
    <div>
      <ReactP5Wrapper sketch={MySketch} />
    </div>
  )
}

export default App
