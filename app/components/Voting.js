import React from 'react'
import {getWeb3} from "../web3";

function voting() {

  useEffect(() => {
    async function initialize() {
      const web3Instance = getWeb3();
    }
  }, []);
  return (
    <div>voting</div>
  )
}

export default voting