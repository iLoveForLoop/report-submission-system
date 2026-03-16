import { useState } from 'react';

import { AtSign } from 'lucide-react';
import { BriefcaseBusiness } from 'lucide-react';
import { CalendarPlus } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { SquarePen } from 'lucide-react';

import { User } from '@/types'
import { Link } from '@inertiajs/react';
import EditUserDialog from './edit-user-dialog';

type pageProps = {
    user: User
}

export default function UserProfile({user}:pageProps) {
    const [openDialog, setOpenDialog] = useState(false)
    return (
        <div className=''>
            <div className=''>
                <div className='cover-container h-[60vh] rounded-md relative border p-6 z-100 '>
                    <div className='flex items-center justify-between'>
                        <Link
                            href={'/program-head/manage-users'}
                            className='flex items-center gap-1 text-primary-foreground font-medium dark:text-foreground'
                        >
                            <ArrowLeft size={15} />
                            Back
                        </Link>
                        <div title='Edit Profile'>
                            <SquarePen
                                onClick={() => setOpenDialog(true)}
                                size={20}
                                className='text-primary-foreground cursor-pointer dark:text-foreground'
                            />
                        </div>
                    </div>

                    <div className='absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t p-6 rounded-md from-black/80 via-black/40 to-transparent'>
                        <div className='lg:flex gap-4 items-end'>
                            <div className="relative flex h-20 w-20 lg:h-32 lg:w-32 items-center justify-center rounded-full bg-primary/90 text-2xl lg:text-5xl font-semibold text-primary-foreground border-4 border-white shadow-lg ring-2 ring-white/20 flex-shrink-0 mb-2 lg:mb-0">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}

                            </div>

                            <div className='flex-1 text-white'>
                                <h1 className='font-bold lg:text-3xl mb-1 drop-shadow-md'>{user.name}</h1>

                                <div className='space-y-1.5'>
                                    <p className='text-sm flex gap-2 items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full w-fit'>
                                        <AtSign size={14} className="text-blue-300" />
                                        <span className="text-white/90 text-xs lg:text-base">{user.email}</span>
                                    </p>

                                    <p className='text-sm flex gap-2 items-center'>
                                        <BriefcaseBusiness size={14} className="text-blue-300" />
                                        <span className="font-medium text-xs lg:text-base">{user.department}</span>
                                        <span className="text-white/60">•</span>
                                        <span className="text-white/80 text-xs lg:text-base">{user.position}</span>
                                    </p>

                                    <p className='text-sm flex gap-2 items-center text-white/80'>
                                        <CalendarPlus size={14} className="text-blue-300" />
                                        <span className='text-xs lg:text-base'>Joined {new Date(user.created_at).toLocaleDateString(
                                            'en-US',
                                            {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            },
                                        )}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditUserDialog
                openDialog={openDialog}
                closeDialog={() => setOpenDialog(false)}
                user={user}
            />
        </div>
    )
}
