import { auth } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { ActionButton } from '@/components/buttons';
import { txt as txtData } from '@/nls/texts';
import { signOut } from 'next-auth/react';

export default async function UserPage() {
    const session = await auth();

    if (!session) {
        redirect('/user/login');
    }

    const username = session.user?.name || session.user?.email || 'User';
    const txt = txtData;

    return (
        <main className='items-center p-24'>
            <p className='mb-12 text-2xl font-bold uppercase tracking-tight text-primaryDark'>
                Hej {username}!
            </p>
            {/* <ActionButton
                label={txt.user.logOut}
                onClick={() => signOut({ callbackUrl: "/user/login" })}
            />     */}
        </main>
    );
}
