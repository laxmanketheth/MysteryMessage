'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { useRouter } from "next/navigation"
// import dynamic from "next/dynamic";


const Navbar = () => {

    const router = useRouter();
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className='text-xl font-bold mb-4 md:mb-0'
                    href="/">Mystry Message</a>
                {
                    session ? (
                        <>
                            <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                            {/* <a href='/dashboard' className='mr-4'> Your Dashboard </a> */}
                            <Link href='/dashboard' className='mr-4'> Your Dashboard </Link>
                            <Button className='w-full md:w-auto' onClick= {() => signOut()}>
                                LogOut
                            </Button>
                        </>
                    ) : (
                        <Link href='/sign-in'>
                            <Button className='w-full md:w-auto'>Login / Logout</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    );
};

export default Navbar;
// export default dynamic (() => Promise.resolve(Navbar), {ssr: false})

