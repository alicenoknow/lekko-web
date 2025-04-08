import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        };
    }

    const res = await fetch('https://your-go-backend.com/data', {
        headers: {
            Authorization: `Bearer ${session.token}`,
        },
    });
    const data = await res.json();

    return {
        props: { data },
    };
}
export default function Results() {
    return (
        <main className='items-center p-24'>
            <div>Results</div>
        </main>
    );
}
