import Banner from '@/components/banner/Banner';
import NoScroll from '@/components/NoScroll';

export default function Home() {
    return (
        <main className='m-auto flex w-full flex-1 flex-col'>
            <NoScroll />
            <Banner />
        </main>
    );
}
