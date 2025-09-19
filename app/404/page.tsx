import {  ArrowLeftCircleIcon } from 'lucide-react'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <>
      <h2 className='text-6xl font-bold mb-6'>404</h2>
      <p className='mb-1'>Could not find requested resource</p>
      <Link href="/" className='flex justify-center items-center space-x-2'>< ArrowLeftCircleIcon size={16}/> <span className='underline underline-offset-2 '>Return Home</span></Link>
    </>
  )
}