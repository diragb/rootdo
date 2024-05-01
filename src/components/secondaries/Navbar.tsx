// Packages:
import React from 'react'
import { useTheme } from 'next-themes'

// Imports:
import { MoonStars } from '@phosphor-icons/react/dist/ssr/MoonStars'
import { Sun } from '@phosphor-icons/react/dist/ssr/Sun'

// Components:
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Functions:
const Navbar = () => {
  // Constants:
  const { setTheme } = useTheme()

  // Return:
  return (
    <div className='w-full h-[3.75rem] flex justify-center items-center px-4 border-b-2'>
      <div className='w-full sm:w-[50%] h-full flex justify-between items-center'>
        <div className='text-2xl'><span className='font-bold'>Root</span>Do</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' className='focus:outline-none'>
              <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <MoonStars className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              <span className='sr-only'>Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Exports:
export default Navbar
