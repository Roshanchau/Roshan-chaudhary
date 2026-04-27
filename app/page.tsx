"use client"

import Hero from "./components/hero"
const page=()=> {
  return (
    <div className={`flex-col items-center justify-center lg:p-14 lg:ml-40`}>
      <Hero/>
    </div>
  )
}

export default page