import React from 'react'
import { IoMdHome, IoMdClipboard, IoMdSettings, IoMdBook, IoMdMenu, IoMdExit } from "react-icons/io";
import { BiBell, BiUserCheck } from "react-icons/bi";
import { GrMore } from 'react-icons/gr';
import { FaPersonCane, FaUser } from 'react-icons/fa6';
import { FaUserCircle } from 'react-icons/fa';

export default function Sidear({ onSelect, isOpen, toggleSideBar }) {



    const menuItems = [
        { name: "Dashboard", icon: IoMdHome },
        { name: "students Management", icon: FaUserCircle },
        { name: "Faculty Management", icon: FaUser },
        { name: "More", icon: GrMore },
    ];

    return (
        <>
            {/* <div className={`fixed md:relative w-64 h-screen  bg-gray-100 text-gray-900 p-4 transition-transform ${isOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
                <h1 className="text-xl font-bold mb-6 flex justify-between items-center">Student Portal
                    <span>
                        <button onClick={toggleSideBar}
                            className="lg:hidden "
                        >
                            &times;
                        </button>
                    </span>
                </h1>
                <nav>
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => { onSelect(item.name); toggleSideBar(); }}
                            className="flex items-center gap-2 p-3 w-full text-left hover:bg-blue-600 hover:text-white rounded-lg"
                        >
                            <item.icon size={20} />
                            {item.name}
                        </button>
                    ))}
                </nav>
            </div> */}
            <div className={` fixed md:relative w-64 h-screen transition-transform p-4 ${isOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
                <h5>sunil <span><button
                    className='lg:hidden'
                    onClick={toggleSideBar}>
                    &times;
                </button></span></h5>
                <nav>
                    {menuItems.map(name)}
                </nav>
            </div>
        </>
    );
}


