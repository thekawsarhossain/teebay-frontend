import { useState } from 'react'
import { Tab } from '@headlessui/react'
import DashboardProducts from '../Components/DashboardProducts'

const tabs = [
    "Bought",
    "Sold",
    "Borrowed",
    "Lent"
]

type TabType = "Bought" | "Sold" | "Borrowed" | "Lent";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const Dashboard = () => {

    const [selectedTab, setSelected] = useState<TabType>("Bought")

    return (
        <div className="w-full">
            <Tab.Group>
                <Tab.List className="flex space-x-1 p-1">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab}
                            onClick={() => setSelected(tab as TabType)}
                            className={({ selected }) =>
                                classNames(
                                    'w-full py-2.5 text-sm font-medium leading-5',
                                    'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white text-indigo-600 shadow border-b-2 border-indigo-600'
                                        : 'hover:text-indigo-600'
                                )
                            }
                        >
                            {tab}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <DashboardProducts type={selectedTab} />
                </Tab.Panels>
            </Tab.Group>
        </div>
    )
}


export default Dashboard