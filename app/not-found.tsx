import Link from 'next/link';

export default function NotFound() {
    return (
        <section className='mx-auto flex min-h-[75vh] w-full flex-col items-center justify-center gap-6 px-6 py-12 text-center'>
            <h1 className='text-primary-dark text-2xl font-bold uppercase md:text-3xl'>
                Oops coś poszło nie tak
            </h1>
            <Link
                href='/'
                className='bg-primary-light rounded-lg border-2 border-black p-3 text-base font-extrabold uppercase select-none hover:cursor-pointer hover:bg-accent-light sm:px-6 sm:text-lg md:px-8 md:text-xl'
            >
                Wróć na stronę główną
            </Link>
        </section>
    );
}
